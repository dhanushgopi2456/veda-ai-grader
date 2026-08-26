"use client";

import type { StepKey, StepState } from "@/lib/types";
import { AlertIcon, ArrowLeftIcon, CheckIcon, SparklesIcon } from "./Icons";

type Props = {
  steps: { key: StepKey; label: string }[];
  states: Record<StepKey, StepState>;
  detail: string;
  progress: number;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
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
  const activeLabel = steps.find((s) => states[s.key] === "active")?.label;
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-4">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/10" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-accent/15" />
          <SparklesIcon className="relative h-12 w-12 text-accent anim-float" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-neutral-900">
          {error ? "Something went wrong" : "Extracting…"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {error ? "The evaluation stopped early." : detail || "The AI magic is working"}
        </p>

        {!error && (
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${Math.max(6, progress)}%` }}
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 text-left">
          {steps.map((step) => {
            const state = states[step.key];
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  state === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : state === "done"
                      ? "border-neutral-100 bg-neutral-50 text-neutral-500"
                      : state === "active"
                        ? "border-accent/30 bg-accent-soft text-neutral-900"
                        : "border-transparent text-neutral-400"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    state === "done"
                      ? "bg-green-500 text-white"
                      : state === "active"
                        ? "border-2 border-accent"
                        : state === "error"
                          ? "bg-red-500 text-white"
                          : "border-2 border-neutral-200"
                  }`}
                >
                  {state === "done" && <CheckIcon className="h-3 w-3" />}
                  {state === "error" && <AlertIcon className="h-3 w-3" />}
                  {state === "active" && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-accent" />}
                </span>
                <span className="font-medium">{step.label}</span>
                {state === "active" && (
                  <span className="ml-auto flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to upload
            </button>
            <button
              onClick={onRetry}
              className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Try again
            </button>
          </div>
        )}
        {!error && activeLabel && (
          <p className="mt-6 text-xs text-neutral-400">
            Large scans can take up to a minute. Keep this tab open.
          </p>
        )}
      </div>
    </div>
  );
}
