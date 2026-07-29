import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  CirclePause,
  Clock3,
  Lightbulb,
  MessageSquareMore,
  Mic2,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

/*
THESIS: A practice studio, not a report card; the interview screen keeps the candidate focused on one spoken answer.
OWN-WORLD: A calm lavender studio surrounds a deep-slate question stage; violet holds context and pink marks the live practice action.
STORY: A student enters a tailored question, speaks or outlines an answer, and ends with a clear next step instead of a judgment.
FIRST VIEWPORT: Navigation rail at left; the question and recorder dominate the wide column, with small pacing guidance held to the right.
FORM: Operate dashboard extension; the setup panel transitions into a dedicated live-session workspace.
*/

const modes = ["Behavioral", "Technical"] as const;

const behavioralQuestions = [
  "Tell me about a time you had to learn something difficult quickly.",
  "Describe a time you worked through a disagreement with a teammate.",
  "Tell me about a project that did not go as planned.",
  "Give an example of when you took initiative without being asked.",
  "Tell me about a time you had to prioritize competing deadlines.",
];

const technicalQuestions = [
  "How would you design a task scheduler that handles urgent and recurring jobs?",
  "What happens when you type a URL into a browser and press Enter?",
  "How would you find the most frequent item in a large list of values?",
  "Explain the difference between a stack and a queue, and when you would use each.",
  "How would you investigate a page that becomes slow as more users arrive?",
];

const sampleFeedback = {
  summary:
    "You completed the practice session. Your response shows a solid starting point—now focus on making your impact easier to understand.",
  strengths: [
    {
      title: "You gave context",
      detail:
        "You started with enough background for an interviewer to understand the situation.",
    },
    {
      title: "You focused on your contribution",
      detail:
        "You kept the answer centered on what you did, rather than only describing the team.",
    },
  ],
  nextStep: {
    title: "Make the result more concrete",
    detail:
      "End your answer with a specific outcome, number, or lesson learned so the interviewer understands the impact.",
  },
};

type Screen = "setup" | "interview" | "complete";

function App() {
  const [mode, setMode] = useState<(typeof modes)[number]>("Behavioral");
  const [role, setRole] = useState("Software Engineering Intern");
  const [company, setCompany] = useState("Any company");
  const [screen, setScreen] = useState<Screen>("setup");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const questions = mode === "Behavioral"
  ? behavioralQuestions
  : technicalQuestions;

const question = questions[questionIndex];

  const startSession = () => {
    setScreen("interview");
    setIsRecording(false);
    setAnswer("");
    setElapsedSeconds(0);
    setQuestionIndex(0);
  };

  const finishResponse = () => {
  setIsRecording(false);

  const isLastQuestion = questionIndex === questions.length - 1;

  if (isLastQuestion) {
    setScreen("complete");
    return;
  }

  setQuestionIndex((currentIndex) => currentIndex + 1);
  setElapsedSeconds(0);
  setAnswer("");
};

  useEffect(() => {
  if (!isRecording) return;

  const timer = window.setInterval(() => {
    setElapsedSeconds((currentTime) => currentTime + 1);
  }, 1000);

  return () => window.clearInterval(timer);
}, [isRecording]);

  return (
    <main className="min-h-screen bg-[#faf5ff] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(76,29,149,0.14)] lg:grid-cols-[220px_1fr]">
        <Sidebar screen={screen} />
        {screen === "setup" ? (
          <SetupScreen mode={mode} role={role} company={company} question={question} setMode={setMode} setRole={setRole} setCompany={setCompany} onStart={startSession} />
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
        ) : (
          <CompleteScreen role={role} mode={mode} answer={answer} onPracticeAgain={startSession} onBack={() => setScreen("setup")} />
        )}
      </div>
    </main>
  );
}

function Sidebar({ screen }: { screen: Screen }) {
  return <aside className="flex flex-col border-b border-violet-100 bg-[#f7f3fd] p-5 lg:border-r lg:border-b-0">
    <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200"><Mic2 size={20} aria-hidden="true" /></div><div><p className="font-[Lexend] text-lg font-semibold tracking-[-0.03em]">InterviewAI</p><p className="text-sm text-slate-600">Practice studio</p></div></div>
    <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Primary navigation"><NavItem icon={<MessageSquareMore size={18} />} label="Practice" active /><NavItem icon={<BarChart3 size={18} />} label="Progress" /><NavItem icon={<BookOpen size={18} />} label="Question bank" /></nav>
    <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm lg:mt-auto"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-violet-100 font-[Lexend] text-sm font-semibold text-violet-700">V</div><div><p className="text-sm font-semibold">{screen === "interview" ? "In a practice session" : "Your practice"}</p><p className="text-xs text-violet-700">Build it one answer at a time.</p></div></div></div>
  </aside>;
}

function SetupScreen({ mode, role, company, question, setMode, setRole, setCompany, onStart }: { mode: (typeof modes)[number]; role: string; company: string; question: string; setMode: (value: (typeof modes)[number]) => void; setRole: (value: string) => void; setCompany: (value: string) => void; onStart: () => void }) {
  return <section className="p-5 sm:p-8 lg:p-10"><header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-violet-700">Today's practice plan</p><h1 className="mt-1 font-[Lexend] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Make your next answer count.</h1></div><button type="button" className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50"><BriefcaseBusiness size={17} aria-hidden="true" /> Target profile <ChevronDown size={16} aria-hidden="true" /></button></header>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]"><div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300 sm:p-8"><div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-100"><Sparkles size={16} aria-hidden="true" /> Practice queue</span><span className="flex items-center gap-2 text-sm text-violet-100"><Clock3 size={16} aria-hidden="true" /> 8–12 min</span></div><h2 className="mt-8 max-w-xl font-[Lexend] text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">One focused mock interview is enough to improve today.</h2><p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Choose your target below. InterviewAI will tailor the first practice question to your goal.</p><button type="button" onClick={onStart} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-400">Set up a session <ArrowRight size={18} aria-hidden="true" /></button></div><div className="rounded-3xl bg-violet-50 p-6"><p className="font-[Lexend] text-lg font-semibold tracking-[-0.02em]">Practice momentum</p><div className="mt-6 space-y-5"><Metric value="0" label="Sessions completed" /><Metric value="—" label="Feedback score" /><Metric value="1" label="Question ready" /></div><p className="mt-6 border-t border-violet-200 pt-4 text-sm leading-6 text-violet-900">Representative data while your personal session history is being built.</p></div></section>
    <section className="mt-8 rounded-3xl border border-violet-100 p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-violet-700">Session setup</p><h2 className="mt-1 font-[Lexend] text-2xl font-semibold tracking-[-0.03em]">Practice for the interview you want.</h2></div><span className="inline-flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={17} className="text-violet-600" aria-hidden="true" /> Local sample session</span></div><div className="mt-6 grid gap-5 md:grid-cols-3"><Field label="Interview type"><select value={mode} onChange={(event) => setMode(event.target.value as (typeof modes)[number])} className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 font-normal text-slate-900 transition hover:border-violet-300">{modes.map((option) => <option key={option}>{option}</option>)}</select></Field><Field label="Role"><select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 font-normal text-slate-900 transition hover:border-violet-300"><option>Software Engineering Intern</option><option>Data Science Intern</option><option>Product Management Intern</option></select></Field><Field label="Company focus"><select value={company} onChange={(event) => setCompany(event.target.value)} className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 font-normal text-slate-900 transition hover:border-violet-300"><option>Any company</option><option>Startup</option><option>Large technology company</option><option>Healthcare technology</option></select></Field></div><p className="mt-5 text-sm text-slate-600">Preparing for <span className="font-semibold text-slate-800">{role}</span> · <span className="font-semibold text-slate-800">{company}</span> · <span className="font-semibold text-slate-800">{mode}</span></p><p className="mt-4 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-950"><span className="font-semibold">First question:</span> {question}</p></section></section>;
}

function InterviewScreen({ mode, role, company, question, answer, isRecording, onAnswerChange, onRecordingChange, onExit, onFinish, elapsedSeconds, questionNumber, totalQuestions }: { mode: string; role: string; company: string; question: string; answer: string; isRecording: boolean; onAnswerChange: (value: string) => void; onRecordingChange: (value: boolean) => void; onExit: () => void; onFinish: () => void; elapsedSeconds: number; questionNumber: number; totalQuestions: number; }) {
  return <section className="animate-in p-5 sm:p-8 lg:p-10"><header className="flex flex-wrap items-center justify-between gap-4"><div><button type="button" onClick={onExit} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-950"><ArrowLeft size={16} aria-hidden="true" /> Leave session</button><div className="flex items-center gap-3"><p className="font-[Lexend] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Mock interview</p><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">Question {questionNumber} of {totalQuestions}</span></div><p className="mt-2 text-slate-600">{role} · {company} · {mode}</p></div><div className="flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3 text-violet-950"><Clock3 size={20} aria-hidden="true" /><div><p className="text-xs font-semibold text-violet-700">Answer time</p><p className="font-[Lexend] text-lg font-semibold">
  {formatTime(elapsedSeconds)}
</p></div></div></header>
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_270px]"><div className="min-w-0"><section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-100"><Sparkles size={16} aria-hidden="true" /> Your question</span><button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-100 transition hover:text-white"><Volume2 size={17} aria-hidden="true" /> Read aloud</button></div><h1 className="mt-8 max-w-3xl text-balance font-[Lexend] text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">{question}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Answer as if your interviewer is in the room. A clear example and a thoughtful reflection are more useful than a perfect script.</p></section>
      <section className="mt-6 rounded-3xl border border-violet-100 p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-[Lexend] text-xl font-semibold tracking-[-0.02em]">Your response</p><p className="mt-1 text-sm text-slate-600">Speak naturally, or use notes to keep your story on track.</p></div><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${isRecording ? "bg-pink-50 text-pink-700" : "bg-slate-100 text-slate-600"}`}><span className={`size-2 rounded-full ${isRecording ? "bg-pink-500 animate-pulse" : "bg-slate-400"}`} />{isRecording ? "Listening" : "Ready when you are"}</span></div><textarea value={answer} onChange={(event) => onAnswerChange(event.target.value)} className="mt-6 min-h-40 w-full resize-y rounded-2xl bg-violet-50 p-4 text-base leading-7 text-slate-900 placeholder:text-slate-500 focus:bg-white" placeholder="Jot down key points here if it helps. Your notes stay on this device for this sample session." aria-label="Answer notes" /><div className="mt-5 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={() => onRecordingChange(!isRecording)} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition ${isRecording ? "bg-slate-800 hover:bg-slate-700" : "bg-pink-500 hover:bg-pink-400"}`}>{isRecording ? <CirclePause size={18} aria-hidden="true" /> : <Mic2 size={18} aria-hidden="true" />}{isRecording ? "Pause practice" : "Start answering"}</button><button type="button" onClick={onFinish} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50"><Square size={16} aria-hidden="true" /> Finish response</button></div></section></div>
      <aside className="rounded-3xl bg-violet-50 p-6 xl:self-start"><div className="flex items-center gap-2 text-violet-800"><Lightbulb size={19} aria-hidden="true" /><p className="font-[Lexend] font-semibold">A quick structure</p></div><ol className="mt-5 space-y-4 text-sm leading-6 text-violet-950"><li><span className="font-semibold">Situation</span><br />Set the context in one or two sentences.</li><li><span className="font-semibold">Task</span><br />Explain what you were responsible for.</li><li><span className="font-semibold">Action</span><br />Focus on the choices you made.</li><li><span className="font-semibold">Result</span><br />Share what changed and what you learned.</li></ol><p className="mt-6 border-t border-violet-200 pt-4 text-sm leading-6 text-violet-900">You can pause at any time. There is no live scoring while you speak.</p></aside></div></section>;
}

function CompleteScreen({
  role,
  mode,
  answer,
  onPracticeAgain,
  onBack,
}: {
  role: string;
  mode: string;
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

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function NavItem({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) { return <button type="button" className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-violet-950 hover:bg-white"}`}>{icon}{label}</button>; }
function Metric({ value, label }: { value: string; label: string }) { return <div className="flex items-baseline justify-between gap-4"><span className="font-[Lexend] text-2xl font-semibold text-slate-950">{value}</span><span className="text-right text-sm text-violet-900">{label}</span></div>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>; }

export default App;
