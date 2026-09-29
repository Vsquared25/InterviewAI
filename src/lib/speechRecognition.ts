type RecognitionResult = {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
};

export type RecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
};

export type RecognitionErrorEvent = {
  error: string;
  message: string;
};

export interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;

  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor =
  new () => BrowserSpeechRecognition;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function createSpeechRecognition() {
  const speechWindow = window as SpeechWindow;

  const Recognition =
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition;

  if (!Recognition) {
    return null;
  }

  const recognition = new Recognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  return recognition;
}

export function readRecognitionResults(
  event: RecognitionResultEvent,
) {
  const finalParts: string[] = [];
  const interimParts: string[] = [];

  for (let index = 0; index < event.results.length; index++) {
    const result = event.results[index];
    const text = result[0].transcript.trim();

    if (!text) continue;

    if (result.isFinal) {
      finalParts.push(text);
    } else {
      interimParts.push(text);
    }
  }

  return {
    finalTranscript: finalParts.join(" "),
    interimTranscript: interimParts.join(" "),
  };
}