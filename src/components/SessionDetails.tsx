import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { analyzeAnswers } from "../lib/answerFeedback";
import { downloadInterviewRecording } from "../lib/sessionRecordings";
import { deleteCloudSessionRecording } from "../lib/supabaseSessions";
import type { SavedSession } from "../types/interview";

export function SessionDetails({
  session,
  onBack,
  onRecordingDeleted,
}: {
  session: SavedSession;
  onBack: () => void;
  onRecordingDeleted: () => void;
}) {
  const feedback = analyzeAnswers(session.answers, session.mode);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isLoadingRecording, setIsLoadingRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeletingRecording, setIsDeletingRecording] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [recordingRemoved, setRecordingRemoved] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => () => {
    requestIdRef.current += 1;
  }, []);

  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingUrl]);

  useEffect(() => {
    requestIdRef.current += 1;
    setRecordingUrl(null);
    setRecordingError("");
    setIsLoadingRecording(false);
  }, [session.id, session.recordingPath]);

  const loadRecording = async () => {
    if (!session.recordingPath || isLoadingRecording) return;

    setIsLoadingRecording(true);
    setRecordingError("");
    const requestId = ++requestIdRef.current;

    try {
      const url = await downloadInterviewRecording(session.recordingPath);
      if (requestId !== requestIdRef.current) {
        URL.revokeObjectURL(url);
        return;
      }
      setRecordingUrl(url);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Could not load saved recording:", error);
      setRecordingError(
        "This recording could not be loaded. Check your connection and try again.",
      );
    } finally {
      if (requestId === requestIdRef.current) setIsLoadingRecording(false);
    }
  };

  const deleteRecording = async () => {
    if (!session.recordingPath || isDeletingRecording) return;
    setIsDeletingRecording(true);
    setDeleteError("");

    try {
      await deleteCloudSessionRecording(session);
      setRecordingUrl(null);
      setRecordingRemoved(true);
      setIsConfirmingDelete(false);
      onRecordingDeleted();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "The recording could not be deleted. Please try again.");
    } finally {
      setIsDeletingRecording(false);
    }
  };

  return (
    <section className="animate-in p-5 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-950"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to session history
      </button>

      <div className="mt-10">
        <p className="text-sm font-semibold text-violet-700">
          Saved practice session
        </p>

        <h1 className="mt-2 font-[Lexend] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          {session.role}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600">
          <span>{session.mode} practice</span>
          <span>{session.company}</span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={16} aria-hidden="true" />
            {new Date(session.completedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {(session.recordingPath || recordingRemoved) && (
        <section className="mt-8 rounded-3xl border border-violet-100 p-6 sm:p-8">
          <h2 className="font-[Lexend] text-xl font-semibold text-slate-950">
            Your interview recording
          </h2>
          {recordingRemoved ? (
            <p role="status" className="mt-2 text-sm font-semibold text-violet-800">
              Recording deleted. Your response transcripts remain saved.
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This private recording loads only when you choose to play it.
            </p>
          )}
          {session.recordingPath && !recordingUrl && (
            <button
              type="button"
              onClick={() => void loadRecording()}
              disabled={isLoadingRecording}
              className="mt-4 rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800 disabled:opacity-60"
            >
              {isLoadingRecording ? "Loading recording…" : "Load recording"}
            </button>
          )}
          {recordingError && (
            <p role="alert" className="mt-3 text-sm font-semibold text-pink-700">
              {recordingError}
            </p>
          )}
          {session.recordingPath && recordingUrl && (
            <video
              controls
              playsInline
              src={recordingUrl}
              className="mt-5 aspect-video w-full rounded-xl bg-slate-950"
              aria-label="Saved interview recording"
            />
          )}
          {session.recordingPath && !isConfirmingDelete && (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="mt-4 block text-sm font-semibold text-pink-700 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
            >
              Delete recording
            </button>
          )}
          {session.recordingPath && isConfirmingDelete && (
            <div className="mt-4 rounded-xl bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-900">
                Delete this recording permanently? Your response transcripts will stay saved.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void deleteRecording()}
                  disabled={isDeletingRecording}
                  className="rounded-xl bg-pink-700 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-800 disabled:opacity-60"
                >
                  {isDeletingRecording ? "Deleting…" : "Yes, delete recording"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeletingRecording}
                  className="rounded-xl border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-900 hover:bg-white disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {deleteError && <p role="alert" className="mt-3 text-sm font-semibold text-pink-700">{deleteError}</p>}
        </section>
      )}

      <section className="mt-10">
        <p className="text-sm font-semibold text-violet-700">
          Your saved responses
        </p>

        <div className="mt-4 space-y-4">
          {session.answers.map((answerRecord, index) => (
            <article
              key={`${answerRecord.question}-${index}`}
              className="rounded-2xl border border-violet-100 p-5 sm:p-6"
            >
              <p className="text-sm font-semibold text-violet-700">
                Question {index + 1}
              </p>

              <h2 className="mt-2 font-[Lexend] text-lg font-semibold tracking-[-0.02em]">
                {answerRecord.question}
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
                {answerRecord.answer || "No transcript was saved for this response."}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-violet-50 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-violet-800">
          <CheckCircle2 size={20} aria-hidden="true" />
          <p className="font-[Lexend] text-lg font-semibold">
            What was already working
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {feedback.strengths.map((strength) => (
            <div key={strength.title}>
              <h2 className="font-semibold text-violet-950">
                {strength.title}
              </h2>
              <p className="mt-1 leading-7 text-violet-950">
                {strength.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-violet-100 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-violet-800">
          <Lightbulb size={20} aria-hidden="true" />
          <p className="font-[Lexend] text-lg font-semibold">
            Next useful step
          </p>
        </div>

        <h2 className="mt-5 font-[Lexend] text-xl font-semibold tracking-[-0.02em]">
          {feedback.nextStep.title}
        </h2>

        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          {feedback.nextStep.detail}
        </p>
      </section>
    </section>
  );
}
