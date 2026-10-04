"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  LogOut,
  GraduationCap,
} from "lucide-react";
import type { Stage } from "@/lib/types";
import { modelsFor, type ThemeMode } from "@/lib/settings";

type Props = {
  stage: Stage;
  onNavigate: (stage: Stage) => void;
  onOpenSettings: () => void;
  modelName: string;
  hasKey: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogoutRequest: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userEmail?: string;
  userName?: string;
};

const NAV_ITEMS: {
  key: Stage;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & metrics",
  },
  {
    key: "new-evaluation",
    label: "New Evaluation",
    icon: FilePlus2,
    description: "Upload & grade paper",
  },
  {
    key: "history",
    label: "Evaluation History",
    icon: History,
    description: "Saved student results",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Score trends & stats",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    description: "API keys & preferences",
  },
];

export default function Sidebar({
  stage,
  onNavigate,
  onOpenSettings,
  modelName,
  hasKey,
  theme,
  onToggleTheme,
  onLogoutRequest,
  isCollapsed,
  onToggleCollapse,
  userEmail = "gopidhanush615@gmail.com",
  userName = "Dhanush Gopi",
}: Props) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const modelLabel =
    modelsFor("sk-or-")
      .concat(modelsFor("AIza"))
      .find((m) => m.id === modelName)?.label ?? modelName;

  const currentThemeIcon =
    theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-950 transition-all duration-300 ease-in-out relative select-none ${
        isCollapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-neutral-100 dark:border-neutral-900">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-3 overflow-hidden text-left focus-visible:outline-none"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-md shadow-neutral-950/10 dark:from-neutral-800 dark:to-neutral-900 dark:border dark:border-neutral-700/60">
            <GraduationCap className="h-5 w-5 text-orange-500" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                  VedaAI
                </span>
                <span className="rounded-md bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                  SaaS
                </span>
              </div>
              <p className="truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                AI Answer Sheet Evaluator
              </p>
            </div>
          )}
        </button>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-neutral-700 dark:hover:text-neutral-300 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            stage === item.key ||
            (item.key === "new-evaluation" &&
              (stage === "upload" || stage === "processing"));

          return (
            <div key={item.key} className="relative group">
              <button
                onClick={() => {
                  if (item.key === "settings") {
                    onOpenSettings();
                  } else {
                    onNavigate(item.key);
                  }
                }}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-transform ${
                    isActive ? "scale-105" : "group-hover:scale-105"
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>

              {/* Tooltip on collapse */}
              {isCollapsed && hoveredItem === item.key && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white shadow-xl dark:bg-neutral-800">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-neutral-900 dark:border-r-neutral-800" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Model & API Status Pill */}
      {!isCollapsed && (
        <div className="px-3 py-2">
          <button
            onClick={onOpenSettings}
            className="w-full rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-3.5 text-left transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Engine Model
                </span>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  hasKey ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
            </div>
            <p className="mt-1.5 truncate text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
              {modelLabel}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
              <span>{hasKey ? "Key verified" : "Setup key"}</span>
              <span className="text-orange-500 font-medium">Configure →</span>
            </div>
          </button>
        </div>
      )}

      {/* User & Actions Footer */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-900 space-y-2">
        {/* Quick Utilities: Theme Switcher & Logout */}
        <div
          className={`flex items-center gap-1.5 ${
            isCollapsed ? "flex-col justify-center" : "justify-between px-1"
          }`}
        >
          <button
            onClick={onToggleTheme}
            suppressHydrationWarning
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title={`Current theme: ${theme}. Click to switch.`}
            aria-label="Toggle theme"
          >
            {React.createElement(currentThemeIcon, { className: "h-4 w-4" })}
          </button>

          {!isCollapsed && (
            <span className="text-xs capitalize text-neutral-400 dark:text-neutral-500">
              {theme} mode
            </span>
          )}

          <button
            onClick={onLogoutRequest}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
            title="Sign out / reset workspace"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Card */}
        <button
          onClick={onOpenSettings}
          className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 font-bold text-xs dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-neutral-900 dark:text-white">
                {userName}
              </p>
              <p className="truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                {userEmail}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
