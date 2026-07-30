import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  sampleFeedback,
  type InterviewMode,
} from "../data/interviewData";

export function CompleteScreen({
  role,
  mode,
  answer,
  onPracticeAgain,
  onBack,
}: {
  role: string;
  mode: InterviewMode;
  answer: string;
  onPracticeAgain: () => void;
  onBack: () => void;
}) {
  const hasNotes = answer.trim().length > 0;

  return (
    <section className="animate-in p-5 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-950"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to practice setup
      </button>

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="grid size-14 place-items-center rounded-2xl bg-pink-100 text-pink-600">
          <CheckCircle2 size={28} aria-hidden="true" />
        </div>

        <p className="mt-7 text-sm font-semibold text-violet-700">
          Practice feedback
        </p>

        <h1 className="mt-2 font-[Lexend] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          A useful reflection, not a score.
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Here is representative feedback for your {mode.toLowerCase()}{" "}
          practice response for a {role} interview.
        </p>

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300 sm:p-8">
          <div className="flex items-center gap-2 text-violet-200">
            <Sparkles size={18} aria-hidden="true" />
            <p className="font-semibold">Your reflection</p>
          </div>

          <p className="mt-5 max-w-2xl font-[Lexend] text-xl font-semibold leading-8 tracking-[-0.02em]">
            {sampleFeedback.summary}
          </p>
        </section>

        <section className="mt-8">
          <p className="text-sm font-semibold text-violet-700">
            What is already working
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {sampleFeedback.strengths.map((strength) => (
              <article
                key={strength.title}
                className="rounded-2xl border border-violet-100 p-5"
              >
                <CheckCircle2
                  size={20}
                  className="text-violet-600"
                  aria-hidden="true"
                />

                <h2 className="mt-4 font-[Lexend] text-lg font-semibold tracking-[-0.02em]">
                  {strength.title}
                </h2>

                <p className="mt-2 leading-7 text-slate-600">
                  {strength.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-violet-50 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-violet-800">
            <Lightbulb size={20} aria-hidden="true" />
            <p className="font-[Lexend] text-lg font-semibold">
              Your next useful step
            </p>
          </div>

          <h2 className="mt-5 font-[Lexend] text-2xl font-semibold tracking-[-0.03em] text-violet-950">
            {sampleFeedback.nextStep.title}
          </h2>

          <p className="mt-2 max-w-2xl leading-7 text-violet-950">
            {sampleFeedback.nextStep.detail}
          </p>
        </section>

        {hasNotes && (
          <section className="mt-6 rounded-2xl border border-violet-100 p-5">
            <p className="font-semibold text-slate-900">Your response notes</p>

            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-600">
              {answer}
            </p>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPracticeAgain}
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-400"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Practice again
          </button>

          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50"
          >
            Adjust session setup
          </button>
        </div>
      </div>
    </section>
  );
}