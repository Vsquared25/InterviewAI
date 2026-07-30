import type { ReactNode } from "react";

export function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-[Lexend] text-2xl font-semibold text-slate-950">
        {value}
      </span>
      <span className="text-right text-sm text-violet-900">{label}</span>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}