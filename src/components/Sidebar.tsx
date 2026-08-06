import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  MessageSquareMore,
  Mic2,
} from "lucide-react";
import type { Screen } from "../types/app";

export function Sidebar({
  screen,
  onNavigate,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <aside className="flex flex-col border-b border-violet-100 bg-[#f7f3fd] p-5 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
          <Mic2 size={20} aria-hidden="true" />
        </div>

        <div>
          <p className="font-[Lexend] text-lg font-semibold tracking-[-0.03em]">
            InterviewAI
          </p>
          <p className="text-sm text-slate-600">Practice studio</p>
        </div>
      </div>

      <nav
        className="mt-8 flex gap-2 overflow-x-auto lg:flex-col"
        aria-label="Primary navigation"
      >
        <NavItem
          icon={<MessageSquareMore size={18} />}
          label="Practice"
          active={screen !== "progress"}
          onClick={() => onNavigate("setup")}
        />

        <NavItem
          icon={<BarChart3 size={18} />}
          label="Progress"
          active={screen === "progress"}
          onClick={() => onNavigate("progress")}
        />

        <NavItem
          icon={<BookOpen size={18} />}
          label="Question bank"
          disabled
        />
      </nav>

      <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm lg:mt-auto">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-violet-100 font-[Lexend] text-sm font-semibold text-violet-700">
            V
          </div>

          <div>
            <p className="text-sm font-semibold">
              {screen === "interview"
                ? "In a practice session"
                : "Your practice"}
            </p>
            <p className="text-xs text-violet-700">
              Build it one answer at a time.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-200"
          : "text-violet-950 hover:bg-white"
      } ${disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}