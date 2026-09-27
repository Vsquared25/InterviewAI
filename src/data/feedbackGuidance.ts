import type { InterviewMode } from "./interviewData";

type FeedbackSuggestion = {
  title: string;
  detail: string;
};

export const nextStepByMode: Record<
  InterviewMode,
  FeedbackSuggestion
> = {
  Behavioral: {
    title: "Make your example specific",
    detail:
      "Explain the situation, your responsibility, the actions you took, and the outcome or lesson learned.",
  },
  Technical: {
    title: "Explain your reasoning",
    detail:
      "Define the relevant concept, explain your approach, and discuss assumptions, limitations, or tradeoffs.",
  },
  Situational: {
    title: "Explain what you would do and why",
    detail:
      "Clarify the problem, describe your proposed actions, and explain when you would seek help or escalate the issue.",
  },
  "Case Study": {
    title: "Structure your recommendation",
    detail:
      "Clarify the objective, identify useful information, compare alternatives, and explain how you would measure success.",
  },
  "Portfolio / Project Discussion": {
    title: "Connect your decisions to the outcome",
    detail:
      "Explain the goal, your individual contribution, the decisions you made, and how you evaluated the final work.",
  },
  "Motivation / Career Fit": {
    title: "Connect your interest to evidence",
    detail:
      "Link your interest in the role to a specific experience, show that you understand the work, and explain what you hope to contribute.",
  },
};