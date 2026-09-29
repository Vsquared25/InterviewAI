type SpeechCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakQuestion(
  question: string,
  callbacks: SpeechCallbacks = {},
) {

  if (!("speechSynthesis" in window)) {
    console.error("Speech playback is unavailable.");
    callbacks.onError?.("unsupported");
    return;
  }

  const synthesis = window.speechSynthesis;

  stopQuestionSpeech();
synthesis.resume();

  const utterance = new SpeechSynthesisUtterance(question);
  const voices = synthesis.getVoices();

  const voice =
    voices.find((item) => item.lang.startsWith("en")) ??
    voices[0];

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }

  utterance.rate = 0.95;
  utterance.volume = 1;

  utterance.onstart = () => {
  if (activeUtterance !== utterance) return;

  callbacks.onStart?.();
};

utterance.onend = () => {
  if (activeUtterance !== utterance) return;

  activeUtterance = null;
  callbacks.onEnd?.();
};

utterance.onerror = (event) => {
  if (activeUtterance !== utterance) return;

  activeUtterance = null;
  callbacks.onError?.(event.error);
};

  activeUtterance = utterance;
  synthesis.speak(utterance);
}

export function stopQuestionSpeech() {
  activeUtterance = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}