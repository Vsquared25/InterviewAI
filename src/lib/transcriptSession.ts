import {
  createSpeechRecognition,
  readRecognitionResults,
} from "./speechRecognition";

type TranscriptCallbacks = {
  onTranscript: (text: string) => void;
  onListeningChange: (listening: boolean) => void;
  onError: (message: string) => void;
};

export function createTranscriptSession(
  initialTranscript: string,
  callbacks: TranscriptCallbacks,
) {
  const recognition = createSpeechRecognition();

  if (!recognition) {
    callbacks.onError(
      "Speech recognition is unavailable in this browser. Try desktop Chrome.",
    );
    return null;
  }

  const prefix = initialTranscript.trim();
  let transcript = prefix;
  let ended = false;
  let started = false;
  let stopTimer: number | undefined;
  let stopPromise: Promise<string> | null = null;
  let resolveStop: ((text: string) => void) | null = null;

  const detachHandlers = () => {
    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
  };

  const finish = () => {
    if (ended) return;

    ended = true;
    window.clearTimeout(stopTimer);
    detachHandlers();
    callbacks.onListeningChange(false);
    resolveStop?.(transcript);
    resolveStop = null;
  };

  recognition.onstart = () => {
    callbacks.onListeningChange(true);
  };

  recognition.onresult = (event) => {
    const { finalTranscript, interimTranscript } =
      readRecognitionResults(event);

    transcript = [prefix, finalTranscript, interimTranscript]
      .filter(Boolean)
      .join(" ");

    callbacks.onTranscript(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", {
  code: event.error,
  message: event.message,
});
    const messages: Record<string, string> = {
      "not-allowed":
        "Microphone access was denied. Allow it in your browser's site settings.",
      "audio-capture":
        "No microphone is available. Check your input device.",
      network:
  "The browser could not connect to its speech-recognition service. Please retry.",
      "no-speech":
        "No speech was detected. Try starting again.",
    };

    callbacks.onError(
      messages[event.error] ??
        `Speech recognition stopped: ${event.error}.`,
    );
  };

  recognition.onend = finish;

  return {
    start() {
      if (started || ended) return;

      started = true;

      try {
        recognition.start();
      } catch {
        callbacks.onError("Could not start microphone transcription.");
        finish();
      }
    },

    stop(): Promise<string> {
      if (ended) return Promise.resolve(transcript);
      if (stopPromise) return stopPromise;

      stopPromise = new Promise<string>((resolve) => {
        resolveStop = resolve;

        stopTimer = window.setTimeout(() => {
          finish();
          recognition.abort();
        }, 3000);

        try {
          recognition.stop();
        } catch {
          finish();
        }
      });

      return stopPromise;
    },

    abort() {
      ended = true;
      window.clearTimeout(stopTimer);
      detachHandlers();
      recognition.abort();
      resolveStop?.(transcript);
      resolveStop = null;
    },
  };
}

export type TranscriptSession = NonNullable<
  ReturnType<typeof createTranscriptSession>
>;