"use client";

import { GearIcon, SparklesIcon, UserIcon } from "./Icons";

type Props = {
  crumb: string;
  onOpenSettings: () => void;
};

export default function TopBar({ crumb, onOpenSettings }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 lg:hidden">
          <SparklesIcon className="h-4 w-4 text-orange-400" />
        </div>
        <span className="text-sm font-medium text-neutral-400">Home</span>
        <span className="text-sm text-neutral-300">/</span>
        <span className="text-sm font-medium text-neutral-900">{crumb}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Settings"
        >
          <GearIcon className="h-[18px] w-[18px]" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 py-1 pl-1 pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent">
            <UserIcon className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-medium text-neutral-700 sm:block">Teacher</span>
        </div>
      </div>
    </header>
  );
}
