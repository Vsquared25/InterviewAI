import type { SavedSession } from "../types/interview";

const storageKey = "interviewai-sessions";

export function getSavedSessions(): SavedSession[] {
  try {
    const storedSessions = window.localStorage.getItem(storageKey);

    if (!storedSessions) {
      return [];
    }

    const sessions = JSON.parse(storedSessions);

    return Array.isArray(sessions) ? sessions : [];
  } catch {
    return [];
  }
}

export function saveSession(session: SavedSession) {
  const existingSessions = getSavedSessions();

  window.localStorage.setItem(
    storageKey,
    JSON.stringify([session, ...existingSessions]),
  );
}