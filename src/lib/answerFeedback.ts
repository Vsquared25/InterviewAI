import type { AnswerRecord } from "../types/interview";

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

export function analyzeAnswers(answers: AnswerRecord[]) {
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
      title: "You added useful detail",
      detail:
        "Your responses include enough context for an interviewer to follow your example.",
    });
  }

  if (hasAction) {
    strengths.push({
      title: "You described your contribution",
      detail:
        "Your responses include action-focused language that helps show what you did.",
    });
  }

  if (strengths.length === 0) {
    strengths.push({
      title: "You completed the full practice session",
      detail:
        "You now have a starting point to revisit and make more specific.",
    });
  }

  const nextStep = hasResult
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

  return {
    strengths: strengths.slice(0, 2),
    nextStep,
    fillerPhrases
  };
}