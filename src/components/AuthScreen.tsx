import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mic2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export function AuthScreen({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        onAuthenticated();
      } else {
        setMessage(
          "Check your email to confirm your account, then return here to sign in.",
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        onAuthenticated();
      }
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#faf5ff] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(76,29,149,0.14)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between bg-slate-950 p-8 text-white sm:p-12">
          <div>
            <div className="grid size-11 place-items-center rounded-xl bg-violet-500 text-white">
              <Mic2 size={22} aria-hidden="true" />
            </div>

            <p className="mt-10 text-sm font-semibold text-violet-200">
              InterviewAI
            </p>

            <h1 className="mt-3 max-w-md font-[Lexend] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              Practice the answer before it matters.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-slate-300">
              Build calmer interview habits with tailored questions, focused
              practice, and feedback you can use.
            </p>
          </div>

          <div className="mt-12 flex items-center gap-3 text-sm text-violet-100">
            <CheckCircle2 size={18} aria-hidden="true" />
            Your practice history stays connected to your account.
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm font-semibold text-violet-700">
              {isSignUp ? "Create an account" : "Welcome back"}
            </p>

            <h2 className="mt-2 font-[Lexend] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              {isSignUp ? "Start practicing with purpose." : "Continue your practice."}
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {isSignUp
                ? "Use your email to save your practice history across devices."
                : "Sign in to continue where you left off."}
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-violet-200 px-4 py-3 text-slate-900"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-violet-200 px-4 py-3 text-slate-900"
                  placeholder="At least 6 characters"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={6}
                  required
                />
              </label>

              {errorMessage && (
                <p role="alert" className="text-sm font-semibold text-pink-700">
                  {errorMessage}
                </p>
              )}

              {message && (
                <p role="status" className="text-sm font-semibold text-violet-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setIsSignUp((currentValue) => !currentValue);
                setMessage("");
                setErrorMessage("");
              }}
              className="mt-6 text-sm font-semibold text-violet-700 transition hover:text-violet-950"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "New to InterviewAI? Create an account"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}