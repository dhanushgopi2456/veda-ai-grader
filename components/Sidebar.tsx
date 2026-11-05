"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FilePlus,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Monitor,
  GraduationCap,
  Sparkles,
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
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "new-evaluation", label: "New Evaluation", icon: FilePlus },
  { key: "history", label: "Evaluation History", icon: History },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
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
  userEmail = "evaluator@institution.edu",
  userName = "Dhanush Gopi",
}: Props) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const modelLabel =
    modelsFor("sk-or-")
      .concat(modelsFor("AIzaSy"))
      .find((m) => m.id === modelName)?.label ||
    modelName ||
    "Gemini 2.5 Flash";

  const currentThemeIcon =
    theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[#e5e5e7] bg-[#ffffff] transition-all duration-200 relative select-none ${
        isCollapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[#f2f2f3]">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-3 overflow-hidden text-left focus-visible:outline-none"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17191c] text-[#ffffff]">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="font-serif text-[17px] font-normal tracking-tight text-[#17191c]">
                VedaAI
              </span>
              <p className="truncate text-[11px] font-sans text-[#777b86]">
                Editorial Grader
              </p>
            </div>
          )}
        </button>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e5e7] text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
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
                className={`flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-[14px] font-sans font-medium transition-colors ${
                  isActive
                    ? "bg-[#17191c] text-[#ffffff]"
                    : "text-[#777b86] hover:bg-[#f2f2f3] hover:text-[#17191c]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>

              {/* Tooltip on collapse */}
              {isCollapsed && hoveredItem === item.key && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 whitespace-nowrap rounded-lg bg-[#17191c] px-2.5 py-1 text-xs font-sans font-medium text-white shadow-md">
                  {item.label}
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
            className="w-full rounded-[16px] border border-[#e5e5e7] bg-[#f2f2f3] p-3.5 text-left transition-colors hover:bg-[#ebebee]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
                Active Engine
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#17191c]" />
            </div>
            <p className="mt-1.5 truncate text-[12px] font-sans font-medium text-[#17191c]">
              {modelLabel}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] font-sans text-[#777b86]">
              <span>{hasKey ? "Key active" : "Using session key"}</span>
              <span className="text-[#17191c] font-medium">Configure →</span>
            </div>
          </button>
        </div>
      )}

      {/* User & Actions Footer */}
      <div className="p-3 border-t border-[#f2f2f3] space-y-2">
        {/* Quick Utilities: Theme Switcher & Logout */}
        <div
          className={`flex items-center gap-1.5 ${
            isCollapsed ? "flex-col justify-center" : "justify-between px-1"
          }`}
        >
          <button
            onClick={onToggleTheme}
            suppressHydrationWarning
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#777b86] hover:bg-[#f2f2f3] hover:text-[#17191c] transition-colors cursor-pointer"
            title={`Current theme: ${theme}. Click to switch.`}
            aria-label="Toggle theme"
          >
            {React.createElement(currentThemeIcon, { className: "h-4 w-4" })}
          </button>

          {!isCollapsed && (
            <span className="text-[12px] font-sans capitalize text-[#777b86]">
              {theme} theme
            </span>
          )}

          <button
            onClick={onLogoutRequest}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#777b86] hover:bg-[#f2f2f3] hover:text-[#17191c] transition-colors"
            title="Sign out / reset workspace"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Card */}
        <button
          onClick={onOpenSettings}
          className={`flex w-full items-center gap-3 rounded-full p-2 text-left transition-colors hover:bg-[#f2f2f3] ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2f2f3] text-[#17191c] font-sans font-medium text-xs border border-[#e5e5e7]">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-sans font-medium text-[#17191c]">
                {userName}
              </p>
              <p className="truncate text-[11px] font-sans text-[#777b86]">
                {userEmail}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
