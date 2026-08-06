import { supabase } from "./supabase";
import type { SavedSession } from "../types/interview";

export async function getCloudSessions(): Promise<SavedSession[]> {
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("id, completed_at, mode, role, company, answers, resume_skills")
    .order("completed_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((session) => ({
    id: session.id,
    completedAt: session.completed_at,
    mode: session.mode,
    role: session.role,
    company: session.company,
    answers: session.answers,
    resumeSkills: session.resume_skills ?? [],
  }));
}

export async function saveCloudSession(session: SavedSession) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Sign in before saving a session.");
  }

  const { error } = await supabase.from("interview_sessions").insert({
    id: session.id,
    user_id: user.id,
    completed_at: session.completedAt,
    mode: session.mode,
    role: session.role,
    company: session.company,
    answers: session.answers,
    resume_skills: session.resumeSkills,
  });

  if (error) {
    throw error;
  }
}