"use client";

import { useState } from "react";
import { defaultModelFor, modelsFor, type Settings } from "@/lib/settings";
import { detectProvider } from "@/lib/ai";
import { AlertIcon, EyeIcon, SparklesIcon, XIcon } from "./Icons";

type Props = {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onSave: (s: Settings) => void;
};

export default function SettingsModal({ open, settings, onClose, onSave }: Props) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  if (!open) return null;

  const provider = apiKey.trim() ? detectProvider(apiKey.trim()) : null;
  const options = apiKey.trim() ? modelsFor(apiKey.trim()) : [];
  const effectiveModel =
    provider && options.some((m) => m.id === model) ? model : provider ? defaultModelFor(apiKey.trim()) : model;

  async function testKey() {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), model: effectiveModel }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setResult({ ok: true, msg: "Key works. You are ready to go." });
      } else {
        setResult({ ok: false, msg: data.error || "Key check failed." });
      }
    } catch {
      setResult({ ok: false, msg: "Network error while checking the key." });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-fade-up relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-neutral-900">Settings</h2>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          VedaAI uses your personal API key from OpenRouter or Google AI Studio. It is stored only
          in this browser.
        </p>

        <label className="mt-5 block text-sm font-medium text-neutral-700">API key</label>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type={show ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-... (OpenRouter) or AIza... (Gemini)"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-neutral-400 hover:text-neutral-700"
              aria-label={show ? "Hide key" : "Show key"}
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={testKey}
            disabled={!apiKey.trim() || testing}
            className="rounded-xl border border-neutral-300 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-40"
          >
            {testing ? "Checking…" : "Test"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-neutral-400">
          {provider === "openrouter" ? (
            <>
              OpenRouter key detected ·{" "}
              <a
                href="https://openrouter.ai/models?max_price=0"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent hover:underline"
              >
                browse free models
              </a>
            </>
          ) : provider === "gemini" ? (
            <>
              Google Gemini key detected ·{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent hover:underline"
              >
                get a free key
              </a>
            </>
          ) : (
            "Works with an OpenRouter key (sk-or-…) or a Google Gemini key (AIza…)"
          )}
        </p>

        {result && (
          <div
            className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-xs ${
              result.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {result.msg}
          </div>
        )}

        {provider && (
          <>
            <label className="mt-4 block text-sm font-medium text-neutral-700">Model</label>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {options.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    effectiveModel === m.id
                      ? "border-accent bg-accent-soft"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-neutral-900">{m.label}</span>
                    <span className="block text-xs text-neutral-500">{m.hint}</span>
                  </span>
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      effectiveModel === m.id ? "border-accent bg-accent" : "border-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ apiKey: apiKey.trim(), model: effectiveModel })}
            disabled={!apiKey.trim()}
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
