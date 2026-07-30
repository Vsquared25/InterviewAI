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
  };
}