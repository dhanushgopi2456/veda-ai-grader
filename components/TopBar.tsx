"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  FilePlus2,
  Menu,
  Moon,
  Sun,
  Monitor,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { Stage } from "@/lib/types";
import type { ThemeMode } from "@/lib/settings";
import { useToast } from "@/components/ToastProvider";

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
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);

  const themeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--canvas)]/80 backdrop-blur-xl px-4 lg:px-6 relative z-30 transition-colors">
      {/* Zone 1: Mobile Hamburger + Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileNav}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--mist)] md:hidden cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-2 text-[13px] font-sans text-[var(--slate)] overflow-hidden">
          <Link
            href="/"
            onClick={() => toast.info("Navigating to Homepage...")}
            className="hidden sm:inline font-serif font-normal text-[var(--ink)] hover:opacity-80 transition-opacity cursor-pointer"
            title="Go to Homepage"
          >
            VedaAI
          </Link>
          <span className="hidden sm:inline text-[var(--border)]">/</span>
          <span className="capitalize text-[var(--slate)]">
            {stage === "upload" || stage === "new-evaluation"
              ? "New Evaluation"
              : stage === "dashboard"
                ? "Overview"
                : stage}
          </span>
          {crumb && (
            <>
              <span className="text-[var(--border)]">/</span>
              <span className="truncate font-medium text-[var(--ink)] max-w-[200px] md:max-w-xs">
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
            onClick={() => {
              onNewEvaluation();
              toast.info("Navigated to New Evaluation");
            }}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-[13px] font-sans font-medium text-[var(--canvas)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span>New Evaluation</span>
          </button>
        )}

        {/* Theme switcher */}
        <button
          onClick={onToggleTheme}
          suppressHydrationWarning
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--slate)] transition-colors hover:bg-[var(--mist)] hover:text-[var(--ink)] cursor-pointer"
          title={`Theme: ${theme}. Click to switch.`}
          aria-label="Toggle theme"
        >
          {React.createElement(themeIcon, { className: "h-4 w-4" })}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--slate)] transition-colors hover:bg-[var(--mist)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="anim-steep-fade absolute right-0 top-full mt-2 w-80 rounded-[16px] border border-[var(--border)] bg-[var(--canvas)] p-4 shadow-steep-artifact z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <span className="text-[12px] font-sans font-medium uppercase tracking-wider text-[var(--ash)]">
                    Notifications
                  </span>
                  <span className="rounded-full bg-[var(--mist)] px-2 py-0.5 text-[11px] font-sans font-medium text-[var(--ink)]">
                    2 Updates
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-left">
                  <div className="rounded-[12px] p-2.5 hover:bg-[var(--mist)] transition-colors">
                    <p className="text-[13px] font-sans font-medium text-[var(--ink)]">
                      AI Engine Ready
                    </p>
                    <p className="text-[12px] font-sans text-[var(--slate)] leading-relaxed">
                      Multimodal OCR & reasoning models active.
                    </p>
                    <span className="text-[11px] text-[var(--ash)] mt-1 block">
                      Just now
                    </span>
                  </div>

                  <div className="rounded-[12px] p-2.5 hover:bg-[var(--mist)] transition-colors">
                    <p className="text-[13px] font-sans font-medium text-[var(--ink)]">
                      Sample Exam Pack Bundled
                    </p>
                    <p className="text-[12px] font-sans text-[var(--slate)] leading-relaxed">
                      Test evaluation workflow instantly with one click.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={() => {
            onOpenSettings();
            toast.info("Opened Settings");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--slate)] transition-colors hover:bg-[var(--mist)] hover:text-[var(--ink)] cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* User Pill / Avatar */}
        <button
          onClick={() => {
            onOpenSettings();
            toast.info("Opened Profile Settings");
          }}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--mist)] py-1 pl-1 pr-3 transition-colors hover:opacity-90 cursor-pointer"
          aria-label="User profile settings"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--canvas)] font-sans font-medium text-xs">
            {userName[0] || "U"}
          </div>
          <span className="hidden text-[13px] font-sans font-medium text-[var(--ink)] md:inline">
            {userName.split(" ")[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
