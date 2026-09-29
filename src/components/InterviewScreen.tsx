import {
  ArrowLeft,
  CirclePause,
  Clock3,
  Lightbulb,
  Mic2,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import type { InterviewMode } from "../data/interviewData";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  speakQuestion,
  stopQuestionSpeech,
} from "../lib/questionSpeech";
import {
  createTranscriptSession,
  type TranscriptSession,
} from "../lib/transcriptSession";
import { CameraPreview } from "./CameraPreview";
import { startInterviewRecorder, type InterviewRecording } from "../lib/interviewRecorder";


export function InterviewScreen({ mode, role, company, question, answer, isRecording, onAnswerChange, onRecordingChange, onExit, onFinish, elapsedSeconds, questionNumber, totalQuestions, uploadProgress, }: { mode: InterviewMode; role: string; company: string; question: string; answer: string; isRecording: boolean; onAnswerChange: (value: string) => void; onRecordingChange: (value: boolean) => void; onExit: () => void; onFinish: (
  transcript: string,
  finishRecording: () => Promise<InterviewRecording | null>,
) => void | Promise<void>; elapsedSeconds: number; questionNumber: number; totalQuestions: number; uploadProgress: number | null; }) {

const speechSessionRef = useRef<TranscriptSession | null>(null);
const cameraStreamRef = useRef<MediaStream | null>(null);
const videoRecorderRef = useRef<ReturnType<typeof startInterviewRecorder> | null>(null);
const finishingVideoRef = useRef<Promise<InterviewRecording> | null>(null);
const [isVideoRecording, setIsVideoRecording] = useState(false);
const [recordedVideo, setRecordedVideo] = useState<InterviewRecording | null>(null);
const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
const [videoError, setVideoError] = useState("");

const handleCameraStreamChange = useCallback(
  (stream: MediaStream | null) => {
    if (!stream && videoRecorderRef.current) {
      const activeRecorder = videoRecorderRef.current;
      videoRecorderRef.current = null;
      const finishing = activeRecorder.stop();
      finishingVideoRef.current = finishing;
      void finishing.then((recording) => {
        if (!mountedRef.current) return;
        setRecordedVideo(recording);
        setIsVideoRecording(false);
      }).catch(() => {
        if (!mountedRef.current) return;
        setVideoError("The recording ended before it could be saved.");
        setIsVideoRecording(false);
      });
    }
    cameraStreamRef.current = stream;
  },
  [],
);
const automaticListeningRef = useRef(false);
const automaticListenTimerRef = useRef<number | undefined>(undefined);
const startListeningRef = useRef<() => void>(() => {});
const [automaticListening, setAutomaticListening] = useState(false);
const autoReadTimerRef = useRef<number | undefined>(undefined);
const [speechError, setSpeechError] = useState("");
const [isSpeechBusy, setIsSpeechBusy] = useState(false);

const [isFinishing, setIsFinishing] = useState(false);
const finishPendingRef = useRef(false);
const mountedRef = useRef(false);
const [isInterviewerSpeaking, setIsInterviewerSpeaking] =
  useState(false);

useEffect(() => {
  mountedRef.current = true;

  return () => {
    mountedRef.current = false;
  };
}, []);
const playCurrentQuestion = useCallback(() => {
  if (
    speechSessionRef.current ||
    finishPendingRef.current
  ) {
    return;
  }

  setSpeechError("");
  setIsInterviewerSpeaking(true);

  speakQuestion(question, {
    onEnd: () => {
      if (mountedRef.current) {
        setIsInterviewerSpeaking(false);
        if (automaticListeningRef.current) {
  automaticListenTimerRef.current = window.setTimeout(() => {
    startListeningRef.current();
  }, 300);
}
      }
    },
    onError: (error) => {
      if (!mountedRef.current) return;

      setIsInterviewerSpeaking(false);

      if (error !== "interrupted" && error !== "canceled") {
        setSpeechError(
          "Question playback failed. Try Replay question.",
        );
      }
    },
  });
}, [question]);
useEffect(() => {
  autoReadTimerRef.current = window.setTimeout(() => {
    if (
      speechSessionRef.current ||
      finishPendingRef.current
    ) {
      return;
    }

    playCurrentQuestion();
  }, 2000);

  return () => {
    window.clearTimeout(autoReadTimerRef.current);
    window.clearTimeout(automaticListenTimerRef.current);
    stopQuestionSpeech();
    setIsInterviewerSpeaking(false);
    speechSessionRef.current?.abort();
    speechSessionRef.current = null;
    onRecordingChange(false);
  };
}, [question, questionNumber, onRecordingChange, playCurrentQuestion,]);

const finishVideoRecording = async (): Promise<InterviewRecording | null> => {
  const activeRecorder = videoRecorderRef.current;

  if (!activeRecorder) return finishingVideoRef.current ?? recordedVideo;

  videoRecorderRef.current = null;
  const finishing = activeRecorder.stop();
  finishingVideoRef.current = finishing;
  const recording = await finishing;
  setRecordedVideo(recording);
  setIsVideoRecording(false);
  return recording;
};

const handleFinish = async () => {
  if (isInterviewerSpeaking ||
  isSpeechBusy ||
  finishPendingRef.current) return;
  window.clearTimeout(autoReadTimerRef.current);
  window.clearTimeout(automaticListenTimerRef.current);

  finishPendingRef.current = true;
  setIsFinishing(true);
  setSpeechError("");
  stopQuestionSpeech();

  try {
    const session = speechSessionRef.current;
    const transcript = session ? await session.stop() : answer;

    if (!mountedRef.current) return;

    if (!transcript.trim()) {
      setSpeechError(
        "No response was captured. Start answering and try again.",
      );
      return;
    }

    onAnswerChange(transcript);
    await onFinish(transcript, finishVideoRecording);
  } catch {
    if (mountedRef.current) {
      setSpeechError(
        "Could not finish this response. Please try again.",
      );
    }
  } finally {
    finishPendingRef.current = false;

    if (mountedRef.current) {
      setIsFinishing(false);
    }
  }
};

const toggleListening = useCallback(() => {
  if (
    isInterviewerSpeaking ||
    isSpeechBusy ||
    isFinishing ||
    finishPendingRef.current
  ) {
    return;
  }

  window.clearTimeout(autoReadTimerRef.current);
  window.clearTimeout(automaticListenTimerRef.current);

  const currentSession = speechSessionRef.current;

  if (currentSession) {
    setIsSpeechBusy(true);
    void currentSession.stop();
    return;
  }

  setSpeechError("");
  stopQuestionSpeech();

  const session = createTranscriptSession(answer, {
    onTranscript: onAnswerChange,
    onListeningChange: (listening) => {
      onRecordingChange(listening);
      setIsSpeechBusy(false);

      if (!listening) {
        speechSessionRef.current = null;
      }
    },
    onError: setSpeechError,
  });

  if (!session) return;

  speechSessionRef.current = session;
  setIsSpeechBusy(true);
  session.start();
}, [
  answer,
  isFinishing,
  isInterviewerSpeaking,
  isSpeechBusy,
  onAnswerChange,
  onRecordingChange,
]);

useEffect(() => {
  startListeningRef.current = toggleListening;
}, [toggleListening]);

const toggleAutomaticListening = async () => {
  if (automaticListeningRef.current) {
    automaticListeningRef.current = false;
    setAutomaticListening(false);
    window.clearTimeout(automaticListenTimerRef.current);

    const session = speechSessionRef.current;

    if (session) {
      setIsSpeechBusy(true);
      void session.stop();
    }

    return;
  }

  setSpeechError("");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    stream.getTracks().forEach((track) => track.stop());

    if (!mountedRef.current) return;

    automaticListeningRef.current = true;
    setAutomaticListening(true);

    window.clearTimeout(autoReadTimerRef.current);
    playCurrentQuestion();
  } catch {
    if (mountedRef.current) {
      setSpeechError(
        "Microphone access is needed for automatic listening. Allow it in your browser's site settings.",
      );
    }
  }
};

useEffect(() => {
  if (isRecording) {
    stopQuestionSpeech();
  }
}, [isRecording]);

useEffect(() => {
  if (!recordedVideo) return;

  const url = URL.createObjectURL(recordedVideo.blob);
  setRecordedVideoUrl(url);

  return () => URL.revokeObjectURL(url);
}, [recordedVideo]);

const toggleVideoRecording = async () => {
  const activeRecorder = videoRecorderRef.current;

  if (activeRecorder) {
    videoRecorderRef.current = null;

    try {
      const finishing = activeRecorder.stop();
      finishingVideoRef.current = finishing;
      setRecordedVideo(await finishing);
      setVideoError("");
    } catch (error) {
      setVideoError(
        error instanceof Error ? error.message : "Could not finish the recording.",
      );
    } finally {
      setIsVideoRecording(false);
    }

    return;
  }

  const stream = cameraStreamRef.current;

  if (!stream) {
    setVideoError("Enable the camera and microphone first.");
    return;
  }

  try {
    setRecordedVideo(null);
    finishingVideoRef.current = null;
    setRecordedVideoUrl(null);
    setVideoError("");
    videoRecorderRef.current = startInterviewRecorder(stream);
    setIsVideoRecording(true);
  } catch (error) {
    setVideoError(
      error instanceof Error ? error.message : "Could not start recording.",
    );
  }
};

  return <section className="animate-in p-5 sm:p-8 lg:p-10"><header className="flex flex-wrap items-center justify-between gap-4"><div><button type="button" onClick={onExit} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-950"><ArrowLeft size={16} aria-hidden="true" /> Leave session</button><div className="flex items-center gap-3"><p className="font-[Lexend] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Mock interview</p><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">Question {questionNumber} of {totalQuestions}</span></div><p className="mt-2 text-slate-600">{role} · {company} · {mode}</p></div><div className="flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3 text-violet-950"><Clock3 size={20} aria-hidden="true" /><div><p className="text-xs font-semibold text-violet-700">Answer time</p><p className="font-[Lexend] text-lg font-semibold">
  {formatTime(elapsedSeconds)}
</p></div></div></header>
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_270px]"><div className="min-w-0"><section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-100"><Sparkles size={16} aria-hidden="true" /> Your question</span><button
  type="button"
  onClick={() => {
  window.clearTimeout(autoReadTimerRef.current);window.clearTimeout(automaticListenTimerRef.current);
  playCurrentQuestion();
}}
  disabled={
  isRecording ||
  isSpeechBusy ||
  isFinishing ||
  !("speechSynthesis" in window)
}
  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-100 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
>
  <Volume2 size={17} aria-hidden="true" />
  {"speechSynthesis" in window
    ? "Replay question"
    : "Speech playback unavailable"}
</button></div><h1 className="mt-8 max-w-3xl text-balance font-[Lexend] text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">{question}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Answer as if your interviewer is in the room. A clear example and a thoughtful reflection are more useful than a perfect script.</p></section>
      <section className="mt-6 rounded-3xl border border-violet-100 p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-[Lexend] text-xl font-semibold tracking-[-0.02em]">Your response</p><p className="mt-1 text-sm text-slate-600">Speak naturally. Your transcript updates as you talk and may revise words while listening. Your browser may process audio online.</p></div><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${isRecording ? "bg-pink-50 text-pink-700" : "bg-slate-100 text-slate-600"}`}><span className={`size-2 rounded-full ${isRecording ? "bg-pink-500 animate-pulse" : "bg-slate-400"}`} />{isInterviewerSpeaking
  ? "Interviewer speaking"
  : isRecording
    ? "Listening"
    : "Ready when you are"}</span></div>{speechError && (
  <p role="alert" className="mt-4 text-sm font-semibold text-pink-700">
    {speechError}
  </p>
)}<textarea
  value={answer}
  readOnly
  className="mt-6 min-h-40 w-full resize-y rounded-2xl bg-violet-50 p-4 text-base leading-7 text-slate-900 placeholder:text-slate-500"
  placeholder="Your spoken response will appear here."
    aria-label="Live response transcript"
/>

<CameraPreview onStreamChange={handleCameraStreamChange} />
<div className="mt-4">
  <p className="mb-3 text-sm leading-6 text-slate-600">
    Video is optional. If you record, the clip is saved privately with this session. A few still frames and basic microphone-level measurements may be sent for AI presentation feedback; the full video is not sent to the AI service.
  </p>
  {recordedVideo && !isVideoRecording && (
    <p className="mb-3 text-sm text-violet-800">
      Starting another clip will replace this one for the saved session.
    </p>
  )}
  <button
    type="button"
    onClick={() => void toggleVideoRecording()}
    disabled={isFinishing}
    className="rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-50 disabled:opacity-60"
  >
    {isVideoRecording ? "Stop video recording" : "Start video recording"}
  </button>
  {videoError && <p role="alert" className="mt-2 text-sm font-semibold text-pink-700">{videoError}</p>}
  {recordedVideo && <p className="mt-2 text-sm text-slate-600">Recording captured ({Math.round(recordedVideo.blob.size / 1024)} KB).</p>}
  {recordedVideoUrl && (
  <video
    controls
    playsInline
    src={recordedVideoUrl}
    className="mt-4 w-full rounded-xl bg-slate-950"
  />
)}
</div>

{uploadProgress !== null && (
  <p role="status" className="mt-4 text-sm font-semibold text-violet-800">
    Uploading private recording: {uploadProgress}%
  </p>
)}
<div className="mt-5 flex flex-wrap items-center justify-between gap-4">
  <button type="button" onClick={toggleListening}
disabled={isSpeechBusy || isFinishing} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition ${isRecording ? "bg-slate-800 hover:bg-slate-700" : "bg-pink-500 hover:bg-pink-400"}`}>{isRecording ? <CirclePause size={18} aria-hidden="true" /> : <Mic2 size={18} aria-hidden="true" />}{isRecording ? "Pause practice" : "Start answering"}</button><button
  type="button"
  onClick={() => void toggleAutomaticListening()}
  disabled={isSpeechBusy || isFinishing || isInterviewerSpeaking}
  className="mb-4 rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 disabled:opacity-50"
>
  {automaticListening
    ? "Turn off automatic listening"
    : "Enable automatic listening"}
</button><button type="button" onClick={() => void handleFinish()}
disabled={isSpeechBusy || isFinishing}className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50"><Square size={16} aria-hidden="true" /> {isFinishing ? "Finishing…" : "Finish response"}</button></div></section></div>
      <aside className="rounded-3xl bg-violet-50 p-6 xl:self-start"><div className="flex items-center gap-2 text-violet-800"><Lightbulb size={19} aria-hidden="true" /><p className="font-[Lexend] font-semibold">A quick structure</p></div><ol className="mt-5 space-y-4 text-sm leading-6 text-violet-950"><li><span className="font-semibold">Situation</span><br />Set the context in one or two sentences.</li><li><span className="font-semibold">Task</span><br />Explain what you were responsible for.</li><li><span className="font-semibold">Action</span><br />Focus on the choices you made.</li><li><span className="font-semibold">Result</span><br />Share what changed and what you learned.</li></ol><p className="mt-6 border-t border-violet-200 pt-4 text-sm leading-6 text-violet-900">You can pause at any time. There is no live scoring while you speak.</p></aside></div></section>;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
