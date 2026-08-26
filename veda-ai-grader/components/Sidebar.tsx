"use client";

import {
  ClipboardIcon,
  GearIcon,
  HistoryIcon,
  SparklesIcon,
} from "./Icons";
import type { Stage } from "@/lib/types";
import { modelsFor } from "@/lib/settings";

type Props = {
  stage: Stage;
  onNavigate: (stage: Stage) => void;
  onOpenSettings: () => void;
  modelName: string;
  hasKey: boolean;
};

const NAV: { key: Stage; label: string; icon: (p: { className?: string }) => React.ReactNode }[] = [
  { key: "upload", label: "Evaluation Upload", icon: (p) => <ClipboardIcon {...p} /> },
  { key: "history", label: "History", icon: (p) => <HistoryIcon {...p} /> },
];

export default function Sidebar({ stage, onNavigate, onOpenSettings, modelName, hasKey }: Props) {
  const modelLabel =
    modelsFor("sk-or-")
      .concat(modelsFor("AIza"))
      .find((m) => m.id === modelName)?.label ?? modelName;
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center gap-2 px-5 pt-5 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
          <SparklesIcon className="h-5 w-5 text-orange-400" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-neutral-900">VedaAI</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = stage === item.key || (item.key === "upload" && stage === "processing");
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {item.icon({ className: "h-[18px] w-[18px]" })}
              {item.label}
            </button>
          );
        })}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <GearIcon className="h-[18px] w-[18px]" />
          Settings
        </button>
      </nav>
      <div className="mt-auto p-4">
        <button
          onClick={onOpenSettings}
          className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-left transition-colors hover:border-neutral-300"
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-neutral-900">Veda AI Model</span>
          </div>
          <p className="mt-1 truncate text-xs text-neutral-500">{modelLabel}</p>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              hasKey ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${hasKey ? "bg-green-500" : "bg-amber-500"}`} />
            {hasKey ? "API key connected" : "API key required"}
          </span>
        </button>
      </div>
    </aside>
  );
}
