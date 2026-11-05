"use client";

import React, { useEffect, useState } from "react";
import type { StepKey, StepState } from "@/lib/types";
import {
  Check,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Bot,
  BrainCircuit,
  FileSearch,
  ScanText,
  FileCheck2,
} from "lucide-react";

type Props = {
  steps: { key: StepKey; label: string }[];
  states: Record<StepKey, StepState>;
  detail: string;
  progress: number;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
};

const STEP_ICONS: Record<StepKey, React.ElementType> = {
  prepare: ScanText,
  questions: FileSearch,
  answers: BrainCircuit,
  mapping: Bot,
  grading: FileCheck2,
};

export default function ProcessingView({
  steps,
  states,
  detail,
  progress,
  error,
  onBack,
  onRetry,
}: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [error]);

  const activeStep = steps.find((s) => states[s.key] === "active");

  return (
    <div className="flex-1 flex items-center justify-center overflow-y-auto p-4 lg:p-8">
      <div className="w-full max-w-xl text-center space-y-6">
        {/* Animated AI Radar Orb */}
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <span
            className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
              error ? "bg-rose-500" : "bg-orange-500"
            }`}
          />
          <span
            className={`absolute inset-2 rounded-full animate-pulse opacity-40 ${
              error ? "bg-rose-400" : "bg-orange-400"
            }`}
          />
          <div
            className={`relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-xl backdrop-blur-md transition-colors ${
              error
                ? "bg-rose-500 text-white shadow-rose-500/30"
                : "bg-gradient-to-br from-neutral-900 to-neutral-800 text-orange-400 shadow-neutral-950/20 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-700/60"
            }`}
          >
            {error ? (
              <AlertCircle className="h-10 w-10 text-white animate-bounce" />
            ) : (
              <Sparkles className="h-10 w-10 text-orange-400 anim-float" />
            )}
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {error
              ? "Evaluation Stopped"
              : activeStep
                ? `${activeStep.label}...`
                : "Processing Evaluation..."}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            {error
              ? error
              : detail || "VedaAI is inspecting scans, identifying questions, and matching handwriting."}
          </p>

          {!error && (
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-mono text-neutral-600 dark:text-neutral-300 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
              <span>Elapsed: {seconds}s</span>
            </div>
          )}
        </div>

        {/* Overall Progress Bar */}
        {!error && (
          <div className="space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>Overall Progress</span>
              <span className="tabular-nums font-bold text-neutral-900 dark:text-white">
                {Math.min(100, Math.round(progress))}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.max(8, progress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Step-by-Step Progress Card List */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 text-left space-y-2.5 max-w-md mx-auto">
          {steps.map((step) => {
            const state = states[step.key];
            const StepIcon = STEP_ICONS[step.key] || ScanText;

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-200 ${
                  state === "error"
                    ? "border-rose-200 bg-rose-50/80 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                    : state === "done"
                      ? "border-emerald-200/70 bg-emerald-50/50 text-neutral-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-neutral-200"
                      : state === "active"
                        ? "border-orange-200 bg-orange-50/70 text-neutral-900 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-white shadow-xs"
                        : "border-transparent bg-transparent text-neutral-400 dark:text-neutral-600"
                }`}
              >
                {/* State Badge */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    state === "done"
                      ? "bg-emerald-500 text-white"
                      : state === "active"
                        ? "bg-orange-500 text-white shadow-sm"
                        : state === "error"
                          ? "bg-rose-500 text-white"
                          : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600"
                  }`}
                >
                  {state === "done" ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : state === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : state === "active" ? (
                    <StepIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <StepIcon className="h-3.5 w-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{step.label}</p>
                  {state === "active" && (
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 truncate">
                      {detail || "Executing model request..."}
                    </p>
                  )}
                </div>

                {state === "active" && (
                  <div className="flex gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:300ms]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons if Error */}
        {error ? (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Upload</span>
            </button>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-orange-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Evaluation</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Multi-page handwritten evaluations typically take 15–30 seconds. Please keep this tab open.
          </p>
        )}
      </div>
    </div>
  );
}
