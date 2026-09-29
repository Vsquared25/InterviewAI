import type { DeliveryMetrics } from "./interviewRecorder";

export type MediaFeedbackSample = {
  frames: string[];
  deliveryMetrics: DeliveryMetrics | null;
};

function waitForEvent(
  element: HTMLVideoElement,
  successEvent: string,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => finish(new Error("Video sampling timed out.")), timeoutMs);
    const onSuccess = () => finish();
    const onError = () => finish(new Error("The recording could not be sampled."));
    const finish = (error?: Error) => {
      window.clearTimeout(timeout);
      element.removeEventListener(successEvent, onSuccess);
      element.removeEventListener("error", onError);
      if (error) reject(error);
      else resolve();
    };

    element.addEventListener(successEvent, onSuccess, { once: true });
    element.addEventListener("error", onError, { once: true });
  });
}

export async function sampleRecordingFrames(blob: Blob): Promise<string[]> {
  const url = URL.createObjectURL(blob);
  const video = document.createElement("video");
  video.muted = true;
  video.preload = "metadata";

  try {
    const metadataLoaded = waitForEvent(video, "loadedmetadata");
    video.src = url;
    await metadataLoaded;

    if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.videoWidth) {
      return [];
    }

    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 512 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return [];

    const frames: string[] = [];
    for (const fraction of [0.2, 0.5, 0.8]) {
      const seeked = waitForEvent(video, "seeked");
      video.currentTime = Math.min(video.duration - 0.01, video.duration * fraction);
      await seeked;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL("image/jpeg", 0.65));
    }
    return frames;
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}
