import type { InterviewMode } from "../data/interviewData";
import type { AnswerRecord } from "../types/interview";
import { supabase } from "./supabase";

type AiFeedbackInput = {
  role: string;
  company: string;
  mode: InterviewMode;
  answers: AnswerRecord[];
};

export async function getAiFeedback({
  role,
  company,
  mode,
  answers,
}: AiFeedbackInput) {
  const { data, error } = await supabase.functions.invoke(
    "generate-feedback",
    {
      body: {
        role,
        company,
        mode,
        answers,
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