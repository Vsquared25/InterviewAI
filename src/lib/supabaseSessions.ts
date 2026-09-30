import { supabase } from "./supabase";
import { deleteInterviewRecording } from "./sessionRecordings";
import type { SavedSession } from "../types/interview";

export async function getCloudSessions(): Promise<SavedSession[]> {
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("id, completed_at, mode, role, company, answers, resume_skills, recording_path")
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
    recordingPath: session.recording_path ?? null,
  }));
}

export async function saveCloudSession(session: SavedSession, expectedUserId: string) {
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

  if (user.id !== expectedUserId) {
    throw new Error("The signed-in account changed before this session was saved.");
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
    recording_path: session.recordingPath ?? null,
  });

  if (error) {
    throw error;
  }
}

export async function deleteCloudSessionRecording(session: SavedSession) {
  if (!session.recordingPath) return;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw userError ?? new Error("Sign in before deleting a recording.");
  }

  if (!session.recordingPath.startsWith(`${user.id}/${session.id}/`)) {
    throw new Error("This recording does not belong to the current account.");
  }

  await deleteInterviewRecording(session.recordingPath);

  const { data, error } = await supabase
    .from("interview_sessions")
    .update({ recording_path: null })
    .eq("id", session.id)
    .eq("user_id", user.id)
    .eq("recording_path", session.recordingPath)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new Error(
      "The recording file was deleted, but its session entry could not be updated. Please try again.",
    );
  }
}
