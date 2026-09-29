import type { InterviewMode } from "../data/interviewData";
import type { AnswerRecord } from "../types/interview";
import type { MediaFeedbackSample } from "./videoFeedback";
import { supabase } from "./supabase";

type AiFeedbackInput = {
  role: string;
  company: string;
  mode: InterviewMode;
  answers: AnswerRecord[];
  mediaSample?: MediaFeedbackSample | null;
};

export async function getAiFeedback({
  role,
  company,
  mode,
  answers,
  mediaSample,
}: AiFeedbackInput) {
  const { data, error } = await supabase.functions.invoke(
    "generate-feedback",
    {
      body: {
        role,
        company,
        mode,
        answers,
        mediaSample,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data || typeof data.feedback !== "string") {
    throw new Error("The feedback service returned an invalid response.");
  }

  return data.feedback;
}

type AiFollowUpInput = {
  role: string;
  company: string;
  mode: InterviewMode;
  question: string;
  answer: string;
};

export async function getAiFollowUp({
  role,
  company,
  mode,
  question,
  answer,
}: AiFollowUpInput) {
  const { data, error } = await supabase.functions.invoke(
    "generate-feedback",
    {
      body: {
        task: "follow-up",
        role,
        company,
        mode,
        question,
        answer,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data || typeof data.followUpQuestion !== "string") {
    throw new Error("The follow-up service returned an invalid response.");
  }

  return data.followUpQuestion;
}
