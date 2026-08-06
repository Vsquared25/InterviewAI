import type { InterviewMode } from "../data/interviewData";

export type AnswerRecord = {
  question: string;
  answer: string;
};

export type SavedSession = {
  id: string;
  completedAt: string;
  mode: InterviewMode;
  role: string;
  company: string;
  answers: AnswerRecord[];
  resumeSkills: string[];
};