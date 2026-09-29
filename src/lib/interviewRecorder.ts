export type DeliveryMetrics = {
  averageLevel: number;
  levelVariation: number;
  quietFraction: number;
  sampledSeconds: number;
};

export type InterviewRecording = {
  blob: Blob;
  deliveryMetrics: DeliveryMetrics | null;
  frames: string[];
};

export function startInterviewRecorder(stream: MediaStream) {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Video recording is unavailable in this browser.");
  }

  if (!stream.getVideoTracks().length || !stream.getAudioTracks().length) {
    throw new Error("Turn on both the camera and microphone first.");
  }

  const mimeType = [
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ].find((type) => MediaRecorder.isTypeSupported(type));

  const recorder = new MediaRecorder(stream, {
    ...(mimeType ? { mimeType } : {}),
    videoBitsPerSecond: 500_000,
    audioBitsPerSecond: 64_000,
  });

  const chunks: Blob[] = [];
  const levels: number[] = [];
  const frames: string[] = [];
  let audioContext: AudioContext | null = null;
  let sampleTimer: number | undefined;
  let frameTimer: number | undefined;
  let firstFrameTimer: number | undefined;
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  void video.play().catch(() => {});

  const captureFrame = () => {
    if (!video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 512 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = canvas.toDataURL("image/jpeg", 0.65);
    if (!frames.length) frames.push(frame);
    else {
      frames.push(frame);
      if (frames.length > 3) frames.splice(1, 1);
    }
  };
  firstFrameTimer = window.setTimeout(captureFrame, 1000);
  frameTimer = window.setInterval(captureFrame, 15_000);

  try {
    audioContext = new AudioContext();
    if (audioContext.state === "suspended") {
      void audioContext.resume().catch(() => {});
    }
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    sampleTimer = window.setInterval(() => {
      if (audioContext?.state !== "running") return;
      analyser.getFloatTimeDomainData(samples);
      const meanSquare = samples.reduce((sum, value) => sum + value * value, 0) / samples.length;
      levels.push(Math.sqrt(meanSquare));
    }, 250);
  } catch {
    void audioContext?.close();
    audioContext = null;
  }

  const cleanup = () => {
    window.clearInterval(sampleTimer);
    window.clearInterval(frameTimer);
    window.clearTimeout(firstFrameTimer);
    video.pause();
    video.srcObject = null;
    void audioContext?.close();
  };

  const finished = new Promise<InterviewRecording>((resolve, reject) => {
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    });

    recorder.addEventListener("error", () => {
      cleanup();
      reject(new Error("Video recording failed."));
    }, { once: true });

    recorder.addEventListener("stop", () => {
      cleanup();
      const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
      if (!blob.size) {
        reject(new Error("The recording is empty."));
        return;
      }

      const averageLevel = levels.length
        ? levels.reduce((sum, value) => sum + value, 0) / levels.length
        : 0;
      const variation = levels.length
        ? Math.sqrt(levels.reduce((sum, value) => sum + (value - averageLevel) ** 2, 0) / levels.length)
        : 0;

      resolve({
        blob,
        frames,
        deliveryMetrics: levels.length >= 20 ? {
          averageLevel: Math.round(averageLevel * 1000) / 1000,
          levelVariation: Math.round(variation * 1000) / 1000,
          quietFraction: Math.round(levels.filter((value) => value < 0.015).length / levels.length * 100) / 100,
          sampledSeconds: Math.round(levels.length / 4),
        } : null,
      });
    }, { once: true });
  });
  void finished.catch(() => {});

  try {
    recorder.start(1000);
  } catch (error) {
    cleanup();
    throw error;
  }

  return {
    stop: () => {
      if (recorder.state !== "inactive") recorder.stop();
      return finished;
    },
  };
}
