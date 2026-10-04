"use client";

import React, { useState } from "react";
import {
  FilePlus2,
  Bell,
  Settings,
  Menu,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Stage } from "@/lib/types";
import type { ThemeMode } from "@/lib/settings";

type Props = {
  stage: Stage;
  crumb: string;
  onOpenSettings: () => void;
  onNewEvaluation: () => void;
  onToggleMobileNav: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  userName?: string;
  notificationCount?: number;
};

export default function TopBar({
  stage,
  crumb,
  onOpenSettings,
  onNewEvaluation,
  onToggleMobileNav,
  theme,
  onToggleTheme,
  userName = "Dhanush Gopi",
  notificationCount = 2,
}: Props) {
  const [showNotifications, setShowNotifications] = useState(false);

  const themeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/95 lg:px-6 relative z-30">
      {/* Zone 1: Mobile Hamburger + Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileNav}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 md:hidden dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
          aria-label="Open mobile menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 overflow-hidden">
          <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400 font-semibold">
            VedaAI
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">/</span>
          <span className="capitalize text-neutral-500 dark:text-neutral-400">
            {stage === "upload" || stage === "new-evaluation"
              ? "New Evaluation"
              : stage === "dashboard"
                ? "Overview"
                : stage}
          </span>
          {crumb && (
            <>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="truncate font-semibold text-neutral-900 dark:text-white max-w-[200px] md:max-w-xs">
                {crumb}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Zone 3: Actions Cluster */}
      <div className="flex items-center gap-2">
        {/* Quick New Evaluation CTA */}
        {stage !== "new-evaluation" && stage !== "upload" && stage !== "processing" && (
          <button
            onClick={onNewEvaluation}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-98 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span>New Evaluation</span>
          </button>
        )}

        {/* Theme switcher */}
        <button
          onClick={onToggleTheme}
          suppressHydrationWarning
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
          title={`Theme: ${theme}`}
          aria-label="Toggle theme"
        >
          {React.createElement(themeIcon, { className: "h-4 w-4" })}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-neutral-950" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="anim-fade-up absolute right-0 top-full mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Notifications
                  </span>
                  <span className="rounded-full bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                    2 New
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        AI Engine Ready
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Multimodal OCR & reasoning models active.
                      </p>
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> Just now
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        Sample Exam Pack Bundled
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Test evaluation workflow instantly with one click.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* User Pill / Avatar */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-neutral-50/80 py-1 pl-1 pr-3 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          aria-label="User profile settings"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-xs shadow-sm">
            {userName[0] || "U"}
          </div>
          <span className="hidden text-xs font-medium text-neutral-800 dark:text-neutral-200 md:inline">
            {userName.split(" ")[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
