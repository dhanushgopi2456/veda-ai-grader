"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastMessage = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextType = {
  toast: {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
  };
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, description, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const toast = {
    success: (title: string, description?: string, duration?: number) =>
      addToast("success", title, description, duration),
    error: (title: string, description?: string, duration?: number) =>
      addToast("error", title, description, duration),
    info: (title: string, description?: string, duration?: number) =>
      addToast("info", title, description, duration),
    warning: (title: string, description?: string, duration?: number) =>
      addToast("warning", title, description, duration),
  };

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      {/* Toast viewport */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2.5 sm:bottom-6 sm:right-6"
      >
        {toasts.map((t) => {
          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 anim-fade-up ${
                t.type === "success"
                  ? "border-emerald-200 bg-white/95 text-neutral-900 shadow-emerald-500/5 dark:border-emerald-800/60 dark:bg-neutral-900/95 dark:text-neutral-100"
                  : t.type === "error"
                    ? "border-rose-200 bg-white/95 text-neutral-900 shadow-rose-500/5 dark:border-rose-800/60 dark:bg-neutral-900/95 dark:text-neutral-100"
                    : t.type === "warning"
                      ? "border-amber-200 bg-white/95 text-neutral-900 shadow-amber-500/5 dark:border-amber-800/60 dark:bg-neutral-900/95 dark:text-neutral-100"
                      : "border-neutral-200 bg-white/95 text-neutral-900 shadow-neutral-500/5 dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-100"
              }`}
            >
              <span className="mt-0.5 shrink-0">
                {t.type === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                )}
                {t.type === "error" && (
                  <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                )}
                {t.type === "warning" && (
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
                {t.type === "info" && (
                  <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-tight">{t.title}</p>
                {t.description && (
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="shrink-0 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
