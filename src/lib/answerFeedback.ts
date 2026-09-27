import type { AnswerRecord } from "../types/interview";
import type { InterviewMode } from "../data/interviewData";
import { nextStepByMode } from "../data/feedbackGuidance";

const actionWords = [
  "built",
  "created",
  "designed",
  "implemented",
  "organized",
  "improved",
  "led",
  "analyzed",
  "solved",
  "collaborated",
];

const resultWords = [
  "result",
  "improved",
  "increased",
  "reduced",
  "saved",
  "completed",
  "learned",
  "delivered",
  "grew",
  "%",
];

const fillerPatterns = [
  { phrase: "um", pattern: /\bum+\b/gi },
  { phrase: "uh", pattern: /\buh+\b/gi },
  { phrase: "you know", pattern: /\byou know\b/gi },
  { phrase: "kind of", pattern: /\bkind of\b/gi },
  { phrase: "sort of", pattern: /\bsort of\b/gi },
];

export type FillerPhrase = {
  phrase: string;
  count: number;
};

export function findFillerPhrases(
  answers: AnswerRecord[],
): FillerPhrase[] {
  const combinedAnswers = answers
    .map((answerRecord) => answerRecord.answer)
    .join(" ");

  return fillerPatterns
    .map(({ phrase, pattern }) => ({
      phrase,
      count: (combinedAnswers.match(pattern) ?? []).length,
    }))
    .filter((fillerPhrase) => fillerPhrase.count > 0);
}

export function analyzeAnswers(answers: AnswerRecord[], mode: InterviewMode) {
  const combinedAnswers = answers
    .map((answerRecord) => answerRecord.answer)
    .join(" ");

  const normalizedAnswers = combinedAnswers.toLowerCase();

  const hasAction = actionWords.some((word) =>
    normalizedAnswers.includes(word),
  );

  const hasResult = resultWords.some((word) =>
    normalizedAnswers.includes(word),
  );

  const wordCount = combinedAnswers
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

    const fillerPhrases = findFillerPhrases(answers);

  const strengths = [];

if (wordCount >= 80) {
  strengths.push({
    title: "You have material to refine",
    detail:
      `Your responses contain ${wordCount} words. Review them for clarity, relevance, and unnecessary repetition.`,
  });
}

if (
  hasAction &&
  (mode === "Behavioral" ||
    mode === "Portfolio / Project Discussion")
) {
  strengths.push({
    title: "You used action-focused language",
    detail:
      "Check that your examples clearly distinguish your individual contribution from the team's work.",
  });
}

if (strengths.length === 0) {
  strengths.push({
    title: "You reached the reflection stage",
    detail:
      "Use the guidance below to develop your responses and prepare for another practice session.",
  });
}

  const behavioralNextStep = hasResult
    ? {
        title: "Make your actions even more specific",
        detail:
          "Name the decision you made and why you chose that approach. This helps an interviewer understand your thinking.",
      }
    : {
        title: "Make the result more concrete",
        detail:
          "End each story with an outcome, number, or lesson learned so the interviewer understands the impact.",
      };

      const nextStep =
  mode === "Behavioral"
    ? behavioralNextStep
    : nextStepByMode[mode];

  return {
    strengths: strengths.slice(0, 2),
    nextStep,
    fillerPhrases
  };
}