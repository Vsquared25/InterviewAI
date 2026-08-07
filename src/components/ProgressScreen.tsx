import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  MessageSquareText,
} from "lucide-react";
import { getCloudSessions } from "../lib/supabaseSessions";
import type { SavedSession } from "../types/interview";
import { SessionDetails } from "./SessionDetails";

export function ProgressScreen({
  onBackToPractice,
}: {
  onBackToPractice: () => void;
}) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<SavedSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadSessions = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const cloudSessions = await getCloudSessions();
      setSessions(cloudSessions);
    } catch (error) {
  console.error("Could not load saved sessions:", error);

  setLoadError(
      "Could not load your saved sessions. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    void loadSessions();
  }, []);

  if (selectedSession) {
    return (
      <SessionDetails
        session={selectedSession}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  return (
    <section className="animate-in p-5 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBackToPractice}
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-950"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to practice
      </button>

      <div className="mt-10">
        <p className="text-sm font-semibold text-violet-700">
          Your history
        </p>

        <h1 className="mt-2 font-[Lexend] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          Progress is built one response at a time.
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Review completed practice sessions and notice the habits you want to
          carry into your next interview.
        </p>
      </div>

      {isLoading ? (
        <section className="mt-10 rounded-3xl bg-violet-50 p-6 sm:p-8">
          <p className="font-[Lexend] text-lg font-semibold">
            Loading your saved sessions…
          </p>
        </section>
      ) : loadError ? (
        <section className="mt-10 rounded-3xl bg-pink-50 p-6 sm:p-8">
          <p role="alert" className="font-semibold text-pink-700">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => void loadSessions()}
            className="mt-4 rounded-xl bg-white px-4 py-2 font-semibold text-pink-700"
          >
            Try again
          </button>
        </section>
      ) : sessions.length === 0 ? (
        <section className="mt-10 rounded-3xl bg-violet-50 p-6 sm:p-8">
          <MessageSquareText
            size={26}
            className="text-violet-700"
            aria-hidden="true"
          />

          <h2 className="mt-5 font-[Lexend] text-xl font-semibold tracking-[-0.02em]">
            Your first session will appear here.
          </h2>

          <p className="mt-2 max-w-xl leading-7 text-violet-950">
            Complete a mock interview to save its role, question responses,
            and feedback to your account.
          </p>
        </section>
      ) : (
        <div className="mt-10 space-y-4">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border border-violet-100 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <button
                type="button"
                onClick={() => setSelectedSession(session)}
                className="flex w-full flex-wrap items-start justify-between gap-4 p-5 text-left sm:p-6"
              >
                <div>
                  <p className="font-[Lexend] text-lg font-semibold tracking-[-0.02em]">
                    {session.role}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {session.mode} practice · {session.company}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-violet-800">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} aria-hidden="true" />
                    {new Date(session.completedAt).toLocaleDateString()}
                  </span>

                  <ChevronRight size={18} aria-hidden="true" />
                </div>
              </button>

              <p className="border-t border-violet-100 px-5 py-4 text-sm text-slate-600 sm:px-6">
                {session.answers.length}{" "}
                {session.answers.length === 1 ? "response" : "responses"}{" "}
                saved to your account
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}