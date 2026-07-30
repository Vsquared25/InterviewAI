import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Sparkles,
} from "lucide-react";
import { modes, type InterviewMode } from "../data/interviewData";
import { Field, Metric } from "./SetupHelpers";

export function SetupScreen({ mode, role, company, question, setMode, setRole, setCompany, onStart, resumeFile, resumeError, onResumeChange, resumeText,
isParsingResume, resumeSkills}: { mode: InterviewMode; role: string; company: string; question: string; setMode: (value: InterviewMode) => void; setRole: (value: string) => void; setCompany: (value: string) => void; onStart: () => void; resumeFile: File | null; resumeError: string; onResumeChange: (file: File | undefined) => void; resumeText: string; isParsingResume: boolean; resumeSkills: string[];}) {
  return <section className="p-5 sm:p-8 lg:p-10"><header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-violet-700">Today's practice plan</p><h1 className="mt-1 font-[Lexend] text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Make your next answer count.</h1></div><button type="button" className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50"><BriefcaseBusiness size={17} aria-hidden="true" /> Target profile <ChevronDown size={16} aria-hidden="true" /></button></header>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]"><div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300 sm:p-8"><div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-100"><Sparkles size={16} aria-hidden="true" /> Practice queue</span><span className="flex items-center gap-2 text-sm text-violet-100"><Clock3 size={16} aria-hidden="true" /> 8–12 min</span></div><h2 className="mt-8 max-w-xl font-[Lexend] text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">One focused mock interview is enough to improve today.</h2><p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Choose your target below. InterviewAI will tailor the first practice question to your goal.</p><button type="button" onClick={onStart} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-400">Set up a session <ArrowRight size={18} aria-hidden="true" /></button></div><div className="rounded-3xl bg-violet-50 p-6"><p className="font-[Lexend] text-lg font-semibold tracking-[-0.02em]">Practice momentum</p><div className="mt-6 space-y-5"><Metric value="0" label="Sessions completed" /><Metric value="—" label="Feedback score" /><Metric value="1" label="Question ready" /></div><p className="mt-6 border-t border-violet-200 pt-4 text-sm leading-6 text-violet-900">Representative data while your personal session history is being built.</p></div></section>
    <section className="mt-8 rounded-3xl border border-violet-100 p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-violet-700">Session setup</p><h2 className="mt-1 font-[Lexend] text-2xl font-semibold tracking-[-0.03em]">Practice for the interview you want.</h2></div><span className="inline-flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={17} className="text-violet-600" aria-hidden="true" /> Local sample session</span></div><div className="mt-6 grid gap-5 md:grid-cols-3"><Field label="Interview type"><select value={mode} onChange={(event) => setMode(event.target.value as InterviewMode)} className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 font-normal text-slate-900 transition hover:border-violet-300">{modes.map((option) => <option key={option}>{option}</option>)}</select></Field><Field label="Role"><select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 font-normal text-slate-900 transition hover:border-violet-300"><option>Software Engineering Intern</option><option>Data Science Intern</option><option>Product Management Intern</option></select></Field><Field label="Company focus"><select value={company} onChange={(event) => setCompany(event.target.value)} className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 font-normal text-slate-900 transition hover:border-violet-300"><option>Any company</option><option>Startup</option><option>Large technology company</option><option>Healthcare technology</option></select></Field></div><p className="mt-5 text-sm text-slate-600">Preparing for <span className="font-semibold text-slate-800">{role}</span> · <span className="font-semibold text-slate-800">{company}</span> · <span className="font-semibold text-slate-800">{mode}</span></p><p className="mt-4 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-950"><span className="font-semibold">First question:</span> {question}</p><section className="mt-8 border-t border-violet-100 pt-6">
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <p className="text-sm font-semibold text-violet-700">
        Resume context
      </p>

      <h3 className="mt-1 font-[Lexend] text-xl font-semibold tracking-[-0.02em]">
        Tailor practice to your experience.
      </h3>
    </div>

    <span className="text-sm text-slate-600">Optional</span>
  </div>

  <p className="mt-2 max-w-2xl leading-7 text-slate-600">
    Add a resume to help InterviewAI choose more relevant practice questions.
    Your file stays local while we build this feature.
  </p>

  <label
    htmlFor="resume-upload"
    className="mt-5 flex cursor-pointer flex-wrap items-center justify-between gap-4 rounded-2xl bg-violet-50 p-5 transition hover:bg-violet-100"
  >
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-white text-violet-700">
        <FileText size={20} aria-hidden="true" />
      </div>

      <div>
        <p className="font-semibold text-violet-950">
          {resumeFile ? resumeFile.name : "Upload your resume"}
        </p>

        <p className="mt-1 text-sm text-violet-800">
          {resumeFile
            ? `${(resumeFile.size / 1024 / 1024).toFixed(1)} MB · Ready for parsing next`
            : "PDF or DOCX · Maximum 5 MB"}
        </p>
      </div>
    </div>

    <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-800">
      {resumeFile ? "Change file" : "Choose file"}
    </span>

    <input
      id="resume-upload"
      type="file"
      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      className="sr-only"
      onChange={(event) => onResumeChange(event.target.files?.[0])}
    />
  </label>

  {resumeError && (
    <p role="alert" className="mt-3 text-sm font-semibold text-pink-700">
      {resumeError}
    </p>
  )}
  {isParsingResume && (
  <p role="status" className="mt-3 text-sm font-semibold text-violet-700">
    Reading your resume locally…
  </p>
)}

{resumeText && !isParsingResume && (
  <section className="mt-4 rounded-2xl border border-violet-100 p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="font-semibold text-slate-900">Resume text is ready</p>

      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
        Local preview
      </span>
    </div>

    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
      {resumeText.slice(0, 420)}
      {resumeText.length > 420 ? "…" : ""}
    </p>
    {resumeSkills.length > 0 && (
  <div className="mt-4 border-t border-violet-100 pt-4">
    <p className="text-sm font-semibold text-violet-900">
      Skills detected from your resume
    </p>

    <div className="mt-3 flex flex-wrap gap-2">
      {resumeSkills.map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-800"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}
  </section>
)}
</section></section></section>;
}