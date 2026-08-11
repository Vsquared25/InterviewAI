import { useEffect, useState } from "react";
import {
  getQuestionsForSession,
  type InterviewMode,
} from "./data/interviewData";

import { extractResumeText } from "./lib/resume";
import { findResumeSkills } from "./lib/resumeProfile";
import { saveCloudSession } from "./lib/supabaseSessions";
import type { Screen } from "./types/app";
import { Sidebar } from "./components/Sidebar";
import { SetupScreen } from "./components/SetupScreen";
import { InterviewScreen } from "./components/InterviewScreen";
import { CompleteScreen } from "./components/CompleteScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import type { AnswerRecord } from "./types/interview";
import { AuthScreen } from "./components/AuthScreen";
import { supabase } from "./lib/supabase";

/*
THESIS: A practice studio, not a report card; the interview screen keeps the candidate focused on one spoken answer.
OWN-WORLD: A calm lavender studio surrounds a deep-slate question stage; violet holds context and pink marks the live practice action.
STORY: A student enters a tailored question, speaks or outlines an answer, and ends with a clear next step instead of a judgment.
FIRST VIEWPORT: Navigation rail at left; the question and recorder dominate the wide column, with small pacing guidance held to the right.
FORM: Operate dashboard extension; the setup panel transitions into a dedicated live-session workspace.
*/






function App() {
  const [mode, setMode] = useState<InterviewMode>("Behavioral");
  const [role, setRole] = useState("Software Engineering Intern");
  const [company, setCompany] = useState("Any company");
  const [screen, setScreen] = useState<Screen>("setup");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
const [resumeError, setResumeError] = useState("");

const [resumeText, setResumeText] = useState("");
const [isParsingResume, setIsParsingResume] = useState(false);
const resumeSkills = findResumeSkills(resumeText);

const questions = getQuestionsForSession(mode, resumeSkills);

const question = questions[questionIndex];
const [isCheckingAuth, setIsCheckingAuth] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userEmail, setUserEmail] = useState("");
const [sessionSaveError, setSessionSaveError] = useState("");

  const startSession = () => {
    setScreen("interview");
    setIsRecording(false);
    setAnswer("");
    setElapsedSeconds(0);
    setQuestionIndex(0);
    setAnswers([]);
    setSessionSaveError("");
  };

const finishResponse = async () => {
  setIsRecording(false);

  const completedAnswer = {
    question,
    answer: answer.trim(),
  };

  const completedAnswers = [...answers, completedAnswer];
  setAnswers(completedAnswers);

  const isLastQuestion = questionIndex === questions.length - 1;

  if (isLastQuestion) {
    setSessionSaveError("");

    try {
      await saveCloudSession({
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
        mode,
        role,
        company,
        answers: completedAnswers,
        resumeSkills,
      });
    } catch {
      setSessionSaveError(
        "Your feedback is ready, but this session could not be saved to your account.",
      );
    }

    setScreen("complete");
    return;
  }

  setQuestionIndex((currentIndex) => currentIndex + 1);
  setElapsedSeconds(0);
  setAnswer("");
};

const handleResumeChange = async (file: File | undefined) => {
  setResumeError("");
  setResumeText("");

  if (!file) {
    setResumeFile(null);
    return;
  }

  const hasSupportedExtension = /\.(pdf|docx)$/i.test(file.name);
  const isTooLarge = file.size > 5 * 1024 * 1024;

  if (!hasSupportedExtension) {
    setResumeFile(null);
    setResumeError("Choose a PDF or DOCX resume.");
    return;
  }

  if (isTooLarge) {
    setResumeFile(null);
    setResumeError("Your resume must be smaller than 5 MB.");
    return;
  }

  setResumeFile(file);
  setIsParsingResume(true);

  try {
    const extractedText = await extractResumeText(file);

    if (!extractedText) {
      setResumeError(
        "We could not find readable text in that file. Try a text-based PDF or DOCX resume.",
      );
      return;
    }

    setResumeText(extractedText);
  } catch {
    setResumeFile(null);
    setResumeError(
      "We could not read that resume. Try a different PDF or DOCX file.",
    );
  } finally {
    setIsParsingResume(false);
  }
};

useEffect(() => {
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setIsAuthenticated(Boolean(session));
    setUserEmail(session?.user.email ?? "");
    setIsCheckingAuth(false);
  };

  void checkSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsAuthenticated(Boolean(session));
    setUserEmail(session?.user.email ?? "");
  });

  return () => subscription.unsubscribe();
}, []);  
const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Could not sign out:", error);
  }
};

useEffect(() => {
  if (!isRecording) return;

  const timer = window.setInterval(() => {
    setElapsedSeconds((currentTime) => currentTime + 1);
  }, 1000);

  return () => window.clearInterval(timer);
}, [isRecording]);

if (isCheckingAuth) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#faf5ff] p-6 text-slate-900">
      <p className="font-[Lexend] font-semibold">Loading InterviewAI…</p>
    </main>
  );
}

if (!isAuthenticated) {
  return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
}

  return (
    <main className="min-h-screen bg-[#faf5ff] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(76,29,149,0.14)] lg:grid-cols-[220px_1fr]">
        <Sidebar
  screen={screen}
  onNavigate={setScreen}
  userEmail={userEmail}
  onSignOut={() => void handleSignOut()}
/>
        {screen === "setup" ? (
          <SetupScreen mode={mode} role={role} company={company} question={question} setMode={setMode} setRole={setRole} setCompany={setCompany} onStart={startSession} resumeFile={resumeFile}
  resumeError={resumeError}
  onResumeChange={handleResumeChange} resumeText={resumeText}
isParsingResume={isParsingResume} resumeSkills={resumeSkills}/>
        ) : screen === "interview" ? (
          <InterviewScreen
  mode={mode}
  role={role}
  company={company}
  question={question}
  answer={answer}
  isRecording={isRecording}
  elapsedSeconds={elapsedSeconds}
  questionNumber={questionIndex + 1}
totalQuestions={questions.length}
  onAnswerChange={setAnswer}
  onRecordingChange={setIsRecording}
  onExit={() => {
  setIsRecording(false);
  setScreen("setup");
}}
  onFinish={finishResponse}
/>
        ) : screen === "complete" ? (
  <CompleteScreen
    role={role}
    company={company}
    mode={mode}
    answer={answer}
    answers={answers}
    onPracticeAgain={startSession}
    onBack={() => setScreen("setup")}
    saveError={sessionSaveError}
  />
) : (
  <ProgressScreen onBackToPractice={() => setScreen("setup")} />
)}
      </div>
    </main>
  );
}














export default App;
