import {
  ArrowLeft,
  CalendarDays,
  MessageSquareText,
} from "lucide-react";
import { getSavedSessions } from "../lib/sessionStorage";

export function ProgressScreen({
  onBackToPractice,
}: {
  onBackToPractice: () => void;
}) {
  const sessions = getSavedSessions();

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

      {sessions.length === 0 ? (
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
            and feedback on this device.
          </p>
        </section>
      ) : (
        <div className="mt-10 space-y-4">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border border-violet-100 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-[Lexend] text-lg font-semibold tracking-[-0.02em]">
                    {session.role}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {session.mode} practice · {session.company}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                  <CalendarDays size={16} aria-hidden="true" />
                  {new Date(session.completedAt).toLocaleDateString()}
                </div>
              </div>

              <p className="mt-5 border-t border-violet-100 pt-4 text-sm text-slate-600">
                {session.answers.length}{" "}
                {session.answers.length === 1 ? "response" : "responses"}{" "}
                saved locally
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}