"use client";

import React, { useState } from "react";
import { modelsFor, type Settings, type ThemeMode } from "@/lib/settings";
import { detectProvider } from "@/lib/ai";
import { useToast } from "./ToastProvider";
import {
  X,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Palette,
  Bell,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Loader2,
  Trash2,
} from "lucide-react";

type Props = {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onSave: (s: Settings) => void;
  onClearHistory?: () => void;
};

type SettingsSection = "ai" | "account" | "appearance" | "notifications" | "security";

export default function SettingsModal({
  open,
  settings,
  onClose,
  onSave,
  onClearHistory,
}: Props) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<SettingsSection>("ai");

  // Form states
  const [apiKey, setApiKey] = useState(settings.apiKey || "");
  const [model, setModel] = useState(settings.model || "gemini-2.5-flash");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Account states
  const [name, setName] = useState(settings.user?.name || "Dhanush Gopi");
  const [email, setEmail] = useState(settings.user?.email || "gopidhanush615@gmail.com");
  const [role, setRole] = useState(settings.user?.role || "Lead Educator & Evaluator");

  // Appearance states
  const [theme, setTheme] = useState<ThemeMode>(settings.theme || "system");

  // Rubric preferences
  const [strictness, setStrictness] = useState<"lenient" | "balanced" | "strict">(
    settings.defaultStrictness || "balanced"
  );
  const [feedback, setFeedback] = useState<"concise" | "standard" | "comprehensive">(
    settings.defaultFeedback || "standard"
  );
  const [notifications, setNotifications] = useState(
    settings.notificationsEnabled ?? true
  );

  if (!open) return null;

  const provider = apiKey.trim() ? detectProvider(apiKey.trim()) : "gemini";
  const options = apiKey.trim() ? modelsFor(apiKey.trim()) : modelsFor("AIza");
  const effectiveModel =
    options.some((m) => m.id === model) ? model : options[0]?.id || "gemini-2.5-flash";

  async function handleTestKey() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), model: effectiveModel }),
      });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        data = { ok: false, error: `Invalid response from server (${res.status})` };
      }
      if (res.ok && data.ok) {
        setTestResult({ ok: true, msg: "API Key verified and operational! ✓" });
        toast.success("API key verified successfully", "Connected to model provider");
      } else {
        setTestResult({
          ok: false,
          msg: data.error || "Key validation failed. Please check key syntax.",
        });
        toast.error("Key verification failed", data.error || "Invalid API key");
      }
    } catch {
      setTestResult({ ok: false, msg: "Network connection error while testing key." });
      toast.error("Network error testing key");
    } finally {
      setTesting(false);
    }
  }

  function handleSaveAll() {
    const updated: Settings = {
      apiKey: apiKey.trim(),
      model: effectiveModel,
      theme,
      user: {
        name: name.trim() || "Dhanush Gopi",
        email: email.trim() || "gopidhanush615@gmail.com",
        role: role.trim() || "Lead Educator",
      },
      defaultStrictness: strictness,
      defaultFeedback: feedback,
      notificationsEnabled: notifications,
    };
    onSave(updated);
    toast.success("Settings saved successfully ✓", "Preferences and credentials updated");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Settings Modal Dialog */}
      <div className="anim-fade-up relative flex flex-col md:flex-row w-full max-w-3xl max-h-[85vh] rounded-3xl border border-neutral-200/90 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
          aria-label="Close settings"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-950/50 p-4 space-y-1">
          <div className="px-3 py-2 mb-2">
            <span className="text-xs font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Settings
            </span>
          </div>

          {[
            { id: "ai", label: "AI & Models", icon: KeyRound },
            { id: "account", label: "Account Profile", icon: User },
            { id: "appearance", label: "Appearance", icon: Palette },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security & Data", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as SettingsSection)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:bg-neutral-100/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-orange-500" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: AI & MODELS */}
          {activeSection === "ai" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  AI Model &amp; API Credentials
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Configure Google Gemini or OpenRouter vision models for document extraction and handwriting grading.
                </p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Custom AI API Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIza... (Gemini) or sk-or-... (OpenRouter)"
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 pr-10 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                      aria-label={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50"
                  >
                    {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>{testing ? "Testing..." : "Test Key"}</span>
                  </button>
                </div>

                <p className="mt-1.5 text-[11px] text-neutral-400 leading-relaxed">
                  {apiKey.trim() ? (
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      Detected provider: {provider === "openrouter" ? "OpenRouter Vision" : "Google Gemini Vision"}.{" "}
                    </span>
                  ) : null}
                  Keys are stored client-side in your private browser sandbox. If left blank, VedaAI automatically uses the pre-configured server environment key.
                </p>

                {testResult && (
                  <div
                    className={`mt-2.5 flex items-start gap-2 rounded-xl p-3 text-xs ${
                      testResult.ok
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {testResult.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{testResult.msg}</span>
                  </div>
                )}
              </div>

              {/* Model Choice */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Default AI Vision Model
                </label>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setModel(opt.id)}
                      className={`flex w-full items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        effectiveModel === opt.id
                          ? "border-orange-500 bg-orange-50/40 dark:border-orange-500 dark:bg-orange-950/30"
                          : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{opt.hint}</p>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          effectiveModel === opt.id
                            ? "border-orange-500 bg-orange-500"
                            : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        {effectiveModel === opt.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Rubric Strictness */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Default Strictness
                  </label>
                  <select
                    value={strictness}
                    onChange={(e) => setStrictness(e.target.value as typeof strictness)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 p-2 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="lenient">Lenient Rubric</option>
                    <option value="balanced">Balanced Standard</option>
                    <option value="strict">Strict Rubric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Default Feedback Depth
                  </label>
                  <select
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value as typeof feedback)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 p-2 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="concise">Concise</option>
                    <option value="standard">Standard</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ACCOUNT PROFILE */}
          {activeSection === "account" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Account Profile
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Update evaluator identity displayed on generated PDF reports.
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white font-bold text-lg shadow-md">
                  {name[0] || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">{name}</p>
                  <p className="text-xs text-neutral-500">{email}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                    {role}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 outline-none focus:border-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 outline-none focus:border-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 outline-none focus:border-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Appearance &amp; Theme
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Select your interface theme preference.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id as ThemeMode)}
                      className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${
                        active
                          ? "border-orange-500 bg-orange-50/40 text-orange-600 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-400 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      <Icon className="h-6 w-6 mb-2" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Control in-app sound and toast feedback alerts.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white">
                      Evaluation completion alerts
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Show celebration and completion banner when grading finishes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-4 w-4 rounded text-orange-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: SECURITY & DATA */}
          {activeSection === "security" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Security &amp; Local Data
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage stored cache, credentials, and archived evaluation history.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 dark:border-rose-950/60 dark:bg-rose-950/20 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300">
                    Clear Local History &amp; Cache
                  </h4>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-400 mt-0.5">
                    Remove all saved evaluations from your browser&apos;s localStorage. This cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onClearHistory) onClearHistory();
                    toast.success("History cache cleared successfully");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All Evaluation History</span>
                </button>
              </div>
            </div>
          )}

          {/* Save / Close Footer */}
          <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
