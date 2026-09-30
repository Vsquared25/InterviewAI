import { useEffect, useRef, useState } from "react";
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
import { type CareerField } from "./data/careerData";
import { getAiFollowUp } from "./lib/aiFeedback";
import {
  deleteInterviewRecording,
  uploadInterviewRecording,
} from "./lib/sessionRecordings";
import type { InterviewRecording } from "./lib/interviewRecorder";

/*
THESIS: A practice studio, not a report card; the interview screen keeps the candidate focused on one spoken answer.
OWN-WORLD: A calm lavender studio surrounds a deep-slate question stage; violet holds context and pink marks the live practice action.
STORY: A student enters a tailored question, speaks or outlines an answer, and ends with a clear next step instead of a judgment.
FIRST VIEWPORT: Navigation rail at left; the question and recorder dominate the wide column, with small pacing guidance held to the right.
FORM: Operate dashboard extension; the setup panel transitions into a dedicated live-session workspace.
*/






function App() {
  const [careerField, setCareerField] = useState<CareerField>(
  "Technology and Computing",
);
  const [mode, setMode] = useState<InterviewMode>("Behavioral");
  const [role, setRole] = useState("Software Engineering Intern");
  const [company, setCompany] = useState("Any employer");
  const [screen, setScreen] = useState<Screen>("setup");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [completedRecording, setCompletedRecording] = useState<InterviewRecording | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const activeUserIdRef = useRef<string | null>(null);
  const sessionGenerationRef = useRef(0);
  const resumeRequestIdRef = useRef(0);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
const [resumeError, setResumeError] = useState("");

const [resumeText, setResumeText] = useState("");
const [isParsingResume, setIsParsingResume] = useState(false);
const resumeSkills = findResumeSkills(resumeText);

const questions = getQuestionsForSession(
  mode,
  resumeSkills,
  careerField,
  role,
);

const question = followUpQuestion ?? questions[questionIndex];
const [isCheckingAuth, setIsCheckingAuth] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userEmail, setUserEmail] = useState("");
const [sessionSaveError, setSessionSaveError] = useState("");

  const clearPrivateSession = () => {
    sessionGenerationRef.current += 1;
    resumeRequestIdRef.current += 1;
    setScreen("setup");
    setCareerField("Technology and Computing");
    setMode("Behavioral");
    setRole("Software Engineering Intern");
    setCompany("Any employer");
    setIsRecording(false);
    setElapsedSeconds(0);
    setQuestionIndex(0);
    setSessionId(null);
    setFollowUpQuestion(null);
    setAnswer("");
    setAnswers([]);
    setCompletedRecording(null);
    setUploadProgress(null);
    setResumeFile(null);
    setResumeText("");
    setResumeError("");
    setIsParsingResume(false);
    setSessionSaveError("");
  };

  const startSession = () => {
    sessionGenerationRef.current += 1;
    setScreen("interview");
    setIsRecording(false);
    setAnswer("");
    setElapsedSeconds(0);
    setQuestionIndex(0);
    setFollowUpQuestion(null);
    setAnswers([]);
    setSessionSaveError("");
    setCompletedRecording(null);
    setUploadProgress(null);
    setSessionId(crypto.randomUUID());
  };

const finishResponse = async (
  finalTranscript: string,
  finishRecording: () => Promise<InterviewRecording | null>,
) => {
  const sessionGeneration = sessionGenerationRef.current;
  const sessionUserId = activeUserIdRef.current;
  setIsRecording(false);

  const completedAnswer = {
    question,
    answer: finalTranscript.trim(),
  };

  const completedAnswers = [...answers, completedAnswer];
  setAnswers(completedAnswers);

  // Ask one follow-up after a main question, but not after a follow-up.
  if (followUpQuestion === null) {
    try {
      const generatedFollowUp = await getAiFollowUp({
        role,
        company,
        mode,
        question: completedAnswer.question,
        answer: completedAnswer.answer,
      });

      if (sessionGeneration !== sessionGenerationRef.current) return;

      if (generatedFollowUp.trim()) {
        setFollowUpQuestion(generatedFollowUp.trim());
        setAnswer("");
        setElapsedSeconds(0);
        return;
      }
    } catch (error) {
      if (sessionGeneration !== sessionGenerationRef.current) return;
      // Keep the interview moving if the AI service is unavailable.
      console.error("Could not generate an interview follow-up:", error);
    }
  }

  // We've answered a follow-up (or generation failed), so advance normally.
  setFollowUpQuestion(null);

  const isLastQuestion = questionIndex === questions.length - 1;

  if (isLastQuestion) {
    if (!sessionUserId) return;
    const currentSessionId = sessionId ?? crypto.randomUUID();
    let recordingPath: string | null = null;
    let recordingWarning = "";

    try {
      const recording = await finishRecording();
      if (sessionGeneration !== sessionGenerationRef.current) return;

      if (recording) {
        setCompletedRecording(recording);
        setUploadProgress(0);
        recordingPath = await uploadInterviewRecording(
          currentSessionId,
          recording.blob,
          setUploadProgress,
        );
        if (sessionGeneration !== sessionGenerationRef.current) return;
      }
    } catch (error) {
      if (sessionGeneration !== sessionGenerationRef.current) return;
      console.error("Could not save interview recording:", error);
      recordingWarning = error instanceof Error && error.message.includes("45 MB")
        ? "Your responses were saved, but the recording exceeded the 45 MB limit and was not uploaded."
        : "Your responses were saved, but the recording could not be saved.";
    } finally {
      setUploadProgress(null);
    }

    try {
      await saveCloudSession({
        id: currentSessionId,
        completedAt: new Date().toISOString(),
        mode,
        role,
        company,
        answers: completedAnswers,
        resumeSkills,
        recordingPath,
      }, sessionUserId);

      if (sessionGeneration !== sessionGenerationRef.current) return;

      setSessionSaveError(recordingWarning);
    } catch (error) {
      if (sessionGeneration !== sessionGenerationRef.current) return;
      console.error("Could not save interview session:", error);

      if (recordingPath) {
        try {
          await deleteInterviewRecording(recordingPath);
        } catch (cleanupError) {
          console.error("Could not remove orphaned recording:", cleanupError);
        }
      }

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
  const requestId = ++resumeRequestIdRef.current;
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
    if (requestId !== resumeRequestIdRef.current) return;

    if (!extractedText) {
      setResumeError(
        "We could not find readable text in that file. Try a text-based PDF or DOCX resume.",
      );
      return;
    }

    setResumeText(extractedText);
  } catch {
    if (requestId !== resumeRequestIdRef.current) return;
    setResumeFile(null);
    setResumeError(
      "We could not read that resume. Try a different PDF or DOCX file.",
    );
  } finally {
    if (requestId === resumeRequestIdRef.current) setIsParsingResume(false);
  }
};

useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const nextUserId = session?.user.id ?? null;
    if (nextUserId !== activeUserIdRef.current) {
      clearPrivateSession();
      activeUserIdRef.current = nextUserId;
    }
    setIsAuthenticated(Boolean(session));
    setUserEmail(session?.user.email ?? "");
    setIsCheckingAuth(false);
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
  return <AuthScreen />;
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
          <SetupScreen careerField={careerField}
  setCareerField={setCareerField}
  mode={mode} role={role} company={company} question={question} setMode={setMode} setRole={setRole} setCompany={setCompany} onStart={startSession} resumeFile={resumeFile}
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
  uploadProgress={uploadProgress}
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
    recording={completedRecording}
  />
) : (
  <ProgressScreen onBackToPractice={() => setScreen("setup")} />
)}
      </div>
    </main>
  );
}














export default App;
