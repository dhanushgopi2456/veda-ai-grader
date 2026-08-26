import { detectProvider } from "./ai";

export type Settings = { apiKey: string; model: string };

const KEY = "veda.settings.v1";

export type ModelOption = { id: string; label: string; hint: string };

export const MODELS: Record<"openrouter" | "gemini", ModelOption[]> = {
  openrouter: [
    {
      id: "dots-studio/dots-3-note-preview:free",
      label: "Dots Note (free)",
      hint: "Recommended · document & handwriting OCR",
    },
    {
      id: "minimax/minimax-m3:free",
      label: "MiniMax M3 (free)",
      hint: "Free · strong all-round vision",
    },
    {
      id: "google/gemma-4-31b-it:free",
      label: "Gemma 4 31B (free)",
      hint: "Free · Google open model",
    },
    {
      id: "google/gemini-2.5-flash",
      label: "Gemini 2.5 Flash",
      hint: "Paid · needs OpenRouter credits",
    },
  ],
  gemini: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", hint: "Recommended · generous free tier" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", hint: "Most accurate, lower daily limits" },
    { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", hint: "Fallback option" },
  ],
};

export const DEFAULT_MODELS: Record<"openrouter" | "gemini", string> = {
  openrouter: "dots-studio/dots-3-note-preview:free",
  gemini: "gemini-2.5-flash",
};

export function modelsFor(key: string): ModelOption[] {
  return MODELS[detectProvider(key || "x")];
}

export function defaultModelFor(key: string): string {
  return DEFAULT_MODELS[detectProvider(key || "x")];
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return { apiKey: "", model: DEFAULT_MODELS.gemini };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      const apiKey = typeof parsed.apiKey === "string" ? parsed.apiKey : "";
      let model = typeof parsed.model === "string" && parsed.model ? parsed.model : "";
      if (apiKey) {
        const valid = modelsFor(apiKey).some((m) => m.id === model);
        if (!valid) model = defaultModelFor(apiKey);
      }
      return { apiKey, model: model || DEFAULT_MODELS.gemini };
    }
  } catch {}
  return { apiKey: "", model: DEFAULT_MODELS.gemini };
}

export function saveSettings(s: Settings) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}
