"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnswerExtraction,
  EvaluationConfig,
  EvaluationResult,
  Question,
  QuestionGrading,
  Stage,
  StepKey,
  StepState,
} from "@/lib/types";
import { mapAnswersToQuestions } from "@/lib/labels";
import { preparePages, type PreparedPage } from "@/lib/rasterize";
import { downloadEvaluationReport } from "@/lib/report";
import {
  loadSettings,
  saveSettings,
  loadHistory,
  saveHistory,
  applyTheme,
  type Settings,
  type ThemeMode,
} from "@/lib/settings";
import { ToastProvider, useToast } from "@/components/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardView from "@/components/DashboardView";
import NewEvaluationView from "@/components/NewEvaluationView";
import ProcessingView from "@/components/ProcessingView";
import ResultsView from "@/components/ResultsView";
import HistoryView from "@/components/HistoryView";
import AnalyticsView from "@/components/AnalyticsView";
import SettingsModal from "@/components/SettingsModal";

const STEP_DEFS: { key: StepKey; label: string }[] = [
  { key: "prepare", label: "Converting & rasterizing pages" },
  { key: "questions", label: "Extracting questions & marks" },
  { key: "answers", label: "Reading handwritten answers & coordinates" },
  { key: "mapping", label: "Mapping answers to question labels" },
  { key: "grading", label: "Evaluating responses with AI rubric" },
];

const STEP_BASE: Record<StepKey, number> = {
  prepare: 0,
  questions: 18,
  answers: 45,
  mapping: 74,
  grading: 82,
};

function emptySteps(): Record<StepKey, StepState> {
  return {
    prepare: "pending",
    questions: "pending",
    answers: "pending",
    mapping: "pending",
    grading: "pending",
  };
}

type PreparedCache = { qPages: PreparedPage[]; aPages: PreparedPage[] };

type GradeResponse = {
  grading: QuestionGrading[];
  overall: EvaluationResult["overall"];
};

function VedaApp() {
  const { toast } = useToast();

  // App Navigation & Modal State
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<Stage>("dashboard");
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    model: "dots-studio/dots-3-note-preview:free",
    theme: "system",
    user: {
      name: "Dhanush Gopi",
      email: "gopidhanush615@gmail.com",
      role: "Lead Educator",
    },
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Files & Evaluation State
  const [qFiles, setQFiles] = useState<File[]>([]);
  const [aFiles, setAFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Record<StepKey, StepState>>(emptySteps());
  const [stepDetail, setStepDetail] = useState("");
  const [progress, setProgress] = useState(0);
  const [processError, setProcessError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [regrouping, setRegrouping] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const preparedRef = useRef<PreparedCache | null>(null);
  const runIdRef = useRef(0);

  // Client hydration initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const loadedSettings = loadSettings();
      setSettings(loadedSettings);
      if (loadedSettings.theme) applyTheme(loadedSettings.theme);
      const loadedHist = loadHistory();
      setHistory(loadedHist);
    }, 0);

    // Verify if backend server provides pre-configured AI key
    fetch("/api/test-key")
      .then(async (r) => {
        if (!r.ok) return null;
        try {
          return (await r.json()) as { hasServerKey?: boolean };
        } catch {
          return null;
        }
      })
      .then((d) => {
        if (d?.hasServerKey) setHasServerKey(true);
      })
      .catch(() => {});

    return () => clearTimeout(timer);
  }, []);

  // Save history on changes (only after client mounted)
  useEffect(() => {
    if (mounted && history.length > 0) {
      saveHistory(history);
    }
  }, [history, mounted]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const saveSettingsAndClose = useCallback(
    (s: Settings) => {
      setSettings(s);
      saveSettings(s);
      if (s.theme) applyTheme(s.theme);
      setSettingsOpen(false);
      setUploadError(null);
    },
    []
  );

  // Toggle Theme helper
  const handleToggleTheme = useCallback(() => {
    const nextTheme: ThemeMode =
      settings.theme === "light"
        ? "dark"
        : settings.theme === "dark"
          ? "system"
          : "light";
    const updated = { ...settings, theme: nextTheme };
    setSettings(updated);
    saveSettings(updated);
    applyTheme(nextTheme);
    toast.info(`Theme changed to ${nextTheme} mode`);
  }, [settings, toast]);

  const setStep = useCallback((key: StepKey, state: StepState, detail?: string) => {
    setSteps((prev) => ({ ...prev, [key]: state }));
    if (detail !== undefined) setStepDetail(detail);
    setProgress(() => {
      const idx = STEP_DEFS.findIndex((s) => s.key === key);
      const base = STEP_BASE[key];
      const span = (STEP_DEFS[idx + 1] ? STEP_BASE[STEP_DEFS[idx + 1].key] : 100) - base;
      return state === "done" ? base + span : base + span * 0.3;
    });
  }, []);

  async function callApi(url: string, body: FormData | string): Promise<unknown> {
    const res = await fetch(url, {
      method: "POST",
      ...(typeof body === "string"
        ? { headers: { "Content-Type": "application/json" }, body }
        : { body }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  function pagesToForm(pages: PreparedPage[], apiKey: string, model: string): FormData {
    const form = new FormData();
    form.set("apiKey", apiKey);
    form.set("model", model);
    for (const p of pages) {
      form.append("pages", p.blob, "page.jpg");
    }
    return form;
  }

  // Main evaluation execution
  const runEvaluation = useCallback(
    async (evalConfig?: EvaluationConfig) => {
      const s = loadSettings();
      setSettings(s);

      if (!s.apiKey && !hasServerKey) {
        setUploadError(
          "Add your Gemini or OpenRouter API key in Settings (or use server key) to run an evaluation."
        );
        toast.warning(
          "API Key Required",
          "Please configure your Gemini or OpenRouter key in Settings"
        );
        openSettings();
        return;
      }

      setUploadError(null);
      setProcessError(null);
      setNotice(null);
      setSteps(emptySteps());
      setProgress(0);
      setStage("processing");
      toast.info("AI evaluation started", "Converting files and running models...");

      const runId = ++runIdRef.current;

      try {
        let qPages = preparedRef.current?.qPages;
        let aPages = preparedRef.current?.aPages;

        if (!qPages || !aPages) {
          setStep("prepare", "active", "Converting your files into optimized page scans");
          let done = 0;
          const total = qFiles.length + aFiles.length;
          qPages = await preparePages(qFiles, (d) => {
            done = d;
            setStepDetail(`Rasterizing question paper — page ${Math.min(d, total)} of ${total}`);
          });
          const qDone = done;
          aPages = await preparePages(aFiles, (d) => {
            setStepDetail(`Rasterizing answer sheet — page ${d} of ${total - qDone}`);
          });
          preparedRef.current = { qPages, aPages };
          if (runId !== runIdRef.current) return;
        }
        setStep("prepare", "done", `${qPages.length + aPages.length} pages ready`);

        setStep("questions", "active", "Reading question paper & extracting items");
        const qData = (await callApi(
          "/api/extract-questions",
          pagesToForm(qPages, s.apiKey, s.model)
        )) as { examTitle: string; questions: Question[] };
        if (runId !== runIdRef.current) return;
        setStep("questions", "done", `Found ${qData.questions.length} questions`);

        setStep("answers", "active", "Locating handwritten responses on answer sheet");
        const aData = (await callApi(
          "/api/extract-answers",
          pagesToForm(aPages, s.apiKey, s.model)
        )) as { answers: AnswerExtraction[] };
        if (runId !== runIdRef.current) return;
        setStep("answers", "done", `Found ${aData.answers.length} handwritten answers`);

        setStep("mapping", "active", "Matching answer blocks to questions");
        await new Promise((r) => setTimeout(r, 300));
        const { results, unmatched } = mapAnswersToQuestions(qData.questions, aData.answers);
        const answered = results.filter((r) => r.answerId).length;
        setStep("mapping", "done", `${answered} matched, ${results.length - answered} unanswered`);

        setStep("grading", "active", "Evaluating answers against rubric & assigning marks");
        const pairs = results
          .filter((r) => r.answerId)
          .map((r) => {
            const a = aData.answers.find((x) => x.id === r.answerId);
            return {
              questionId: r.question.id,
              label: r.question.label,
              transcription: a?.transcription ?? "",
            };
          });

        const gData = (await callApi(
          "/api/grade",
          JSON.stringify({
            apiKey: s.apiKey,
            model: s.model,
            questions: qData.questions,
            answers: pairs,
          })
        )) as GradeResponse;

        if (runId !== runIdRef.current) return;
        const gradingById = new Map(gData.grading.map((g) => [g.questionId, g]));
        const finalResults = results.map((r) => ({
          ...r,
          grading: gradingById.get(r.question.id) ?? r.grading,
        }));
        setStep("grading", "done", "Done");

        const evaluation: EvaluationResult = {
          id: `eval-${Date.now()}`,
          createdAt: Date.now(),
          examTitle: qData.examTitle || "Answer Paper Evaluation",
          questionPages: qPages.map((p) => ({
            url: p.url,
            width: p.width,
            height: p.height,
            name: p.name,
          })),
          answerPages: aPages.map((p) => ({
            url: p.url,
            width: p.width,
            height: p.height,
            name: p.name,
          })),
          questions: qData.questions,
          answers: aData.answers,
          results: finalResults,
          unmatched,
          overall: gData.overall,
          studentName: evalConfig?.studentName || "Arjun Sharma",
          subject: evalConfig?.subject || "Physics",
          evalConfig,
        };

        setResult(evaluation);
        setHistory((h) => {
          const next = [evaluation, ...h.filter((x) => x.id !== evaluation.id)];
          saveHistory(next);
          return next;
        });
        setStage("results");
        toast.success(
          "Evaluation completed successfully 🎉",
          `Score: ${evaluation.overall?.totalAwarded}/${evaluation.overall?.totalMax} (Grade ${evaluation.overall?.gradeLetter})`
        );
      } catch (err) {
        if (runId !== runIdRef.current) return;
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setProcessError(msg);
        toast.error("Evaluation Failed", msg);
        setSteps((prev) => {
          const next = { ...prev };
          const firstActive = STEP_DEFS.find((st) => next[st.key] === "active");
          if (firstActive) next[firstActive.key] = "error";
          return next;
        });
      }
    },
    [qFiles, aFiles, openSettings, setStep, hasServerKey, toast]
  );

  function backToUpload() {
    runIdRef.current++;
    preparedRef.current = null;
    setProcessError(null);
    setStage("new-evaluation");
  }

  // Load sample bundled papers
  async function loadSample() {
    setSampleLoading(true);
    setUploadError(null);
    toast.info("Loading bundled sample papers...", "Preparing sample question paper and answer sheet");

    try {
      let manifest: { questions: string[]; answers: string[] } = {
        questions: ["question-paper-1.jpg", "question-paper-2.jpg"],
        answers: ["answer-sheet-1.jpg", "answer-sheet-2.jpg", "answer-sheet-3.jpg"],
      };

      try {
        const res = await fetch("/samples/manifest.json");
        if (res.ok) {
          const parsed = (await res.json()) as { questions?: string[]; answers?: string[] };
          if (Array.isArray(parsed.questions) && Array.isArray(parsed.answers)) {
            manifest = { questions: parsed.questions, answers: parsed.answers };
          }
        }
      } catch {
        // Use default fallback manifest
      }

      async function toFiles(names: string[], prefix: string): Promise<File[]> {
        const files: File[] = [];
        let i = 1;
        for (const n of names) {
          try {
            const r = await fetch(`/samples/${n}`);
            if (r.ok) {
              const blob = await r.blob();
              files.push(new File([blob], `${prefix}-page-${i++}.jpg`, { type: "image/jpeg" }));
            }
          } catch (e) {
            console.warn(`Could not load sample file ${n}:`, e);
          }
        }
        return files;
      }

      const qs = await toFiles(manifest.questions, "question-paper");
      const as = await toFiles(manifest.answers, "answer-sheet");

      if (qs.length === 0 || as.length === 0) {
        throw new Error("Could not retrieve sample image files. Please check network.");
      }

      preparedRef.current = null;
      setQFiles(qs);
      setAFiles(as);
      setStage("new-evaluation");
      toast.success("Sample exam files loaded ✓", `${qs.length} question pages & ${as.length} answer sheets ready`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not load sample data.";
      setUploadError(msg);
      toast.error("Failed to load sample", msg);
    } finally {
      setSampleLoading(false);
    }
  }

  // Automatic Regrading when answer mapping changes
  async function regrade(updated: EvaluationResult) {
    const s = settings;
    if ((!s.apiKey && !hasServerKey) || !updated.overall) return;
    setRegrouping(true);
    setNotice(null);
    try {
      const pairs = updated.results
        .filter((r) => r.answerId)
        .map((r) => {
          const a = updated.answers.find((x) => x.id === r.answerId);
          return {
            questionId: r.question.id,
            label: r.question.label,
            transcription: a?.transcription ?? "",
          };
        });
      const gData = (await callApi(
        "/api/grade",
        JSON.stringify({
          apiKey: s.apiKey,
          model: s.model,
          questions: updated.questions,
          answers: pairs,
        })
      )) as GradeResponse;
      const gradingById = new Map(gData.grading.map((g) => [g.questionId, g]));
      const finalResults = updated.results.map((r) => ({
        ...r,
        grading: gradingById.get(r.question.id) ?? r.grading,
      }));
      const next = { ...updated, results: finalResults, overall: gData.overall };
      setResult(next);
      setHistory((h) => {
        const list = h.map((x) => (x.id === next.id ? next : x));
        saveHistory(list);
        return list;
      });
      toast.success("Answer remapped & regraded ✓");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Regrading failed.";
      setNotice(msg);
      toast.error("Regrading failed", msg);
    } finally {
      setRegrouping(false);
    }
  }

  function applyMapping(base: EvaluationResult, results: EvaluationResult["results"]) {
    const assigned = new Set(results.map((r) => r.answerId).filter((x): x is string => !!x));
    const unmatched = base.answers.filter((a) => !assigned.has(a.id));
    return { ...base, results, unmatched };
  }

  function handleRemap(questionId: string, answerId: string | null) {
    if (!result) return;
    const results = result.results.map((r) => {
      if (r.question.id === questionId) {
        return {
          ...r,
          answerId,
          status: answerId ? ("matched" as const) : ("unanswered" as const),
          lowConfidence: false,
        };
      }
      if (answerId && r.answerId === answerId) {
        return { ...r, answerId: null, status: "unanswered" as const, lowConfidence: false };
      }
      return r;
    });
    const next = applyMapping(result, results);
    setResult(next);
    setHistory((h) => {
      const list = h.map((x) => (x.id === next.id ? next : x));
      saveHistory(list);
      return list;
    });
    void regrade(next);
  }

  function handleAssignUnmatched(answerId: string, questionId: string | null) {
    if (!result || !questionId) return;
    const results = result.results.map((r) => {
      if (r.question.id === questionId) {
        return { ...r, answerId, status: "matched" as const, lowConfidence: false };
      }
      if (r.answerId === answerId) {
        return { ...r, answerId: null, status: "unanswered" as const, lowConfidence: false };
      }
      return r;
    });
    const next = applyMapping(result, results);
    setResult(next);
    setHistory((h) => {
      const list = h.map((x) => (x.id === next.id ? next : x));
      saveHistory(list);
      return list;
    });
    void regrade(next);
  }

  // Delete evaluation with confirmation modal
  function requestDeleteEvaluation(id: string) {
    setConfirmDialog({
      open: true,
      title: "Delete Evaluation?",
      description:
        "This evaluation and its associated grading results will be permanently removed from your history.",
      confirmLabel: "Delete Evaluation",
      isDanger: true,
      onConfirm: () => {
        setHistory((h) => {
          const next = h.filter((x) => x.id !== id);
          saveHistory(next);
          return next;
        });
        if (result?.id === id) {
          setResult(null);
          setStage("dashboard");
        }
        setConfirmDialog((c) => ({ ...c, open: false }));
        toast.success("Evaluation deleted successfully ✓");
      },
    });
  }

  // Clear all history
  function handleClearAllHistory() {
    setHistory([]);
    saveHistory([]);
    setResult(null);
  }

  // Logout request
  function handleLogoutRequest() {
    setConfirmDialog({
      open: true,
      title: "Sign Out & Reset Session?",
      description:
        "Your saved preferences and cached evaluations will remain stored in this browser's local sandbox.",
      confirmLabel: "Sign Out",
      isDanger: false,
      onConfirm: () => {
        setConfirmDialog((c) => ({ ...c, open: false }));
        toast.info("Signed out successfully");
      },
    });
  }

  // Breadcrumb generation
  const crumb =
    stage === "results"
      ? result?.examTitle || "Evaluation Results"
      : stage === "processing"
        ? "AI Processing"
        : stage === "history"
          ? "Archive"
          : stage === "analytics"
            ? "Metrics"
            : stage === "new-evaluation" || stage === "upload"
              ? "New Run"
              : "Overview";

  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Sidebar Navigation */}
      <Sidebar
        stage={stage}
        onNavigate={(s) => {
          setStage(s);
          setMobileNavOpen(false);
        }}
        onOpenSettings={openSettings}
        modelName={settings.model}
        hasKey={!!settings.apiKey || hasServerKey}
        theme={settings.theme || "system"}
        onToggleTheme={handleToggleTheme}
        onLogoutRequest={handleLogoutRequest}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        userName={settings.user?.name}
        userEmail={settings.user?.email}
      />

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-neutral-950 shadow-2xl flex flex-col z-10">
            <Sidebar
              stage={stage}
              onNavigate={(s) => {
                setStage(s);
                setMobileNavOpen(false);
              }}
              onOpenSettings={() => {
                setMobileNavOpen(false);
                openSettings();
              }}
              modelName={settings.model}
              hasKey={!!settings.apiKey || hasServerKey}
              theme={settings.theme || "system"}
              onToggleTheme={handleToggleTheme}
              onLogoutRequest={() => {
                setMobileNavOpen(false);
                handleLogoutRequest();
              }}
              isCollapsed={false}
              onToggleCollapse={() => setMobileNavOpen(false)}
              userName={settings.user?.name}
              userEmail={settings.user?.email}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          stage={stage}
          crumb={crumb}
          onOpenSettings={openSettings}
          onNewEvaluation={() => setStage("new-evaluation")}
          onToggleMobileNav={() => setMobileNavOpen(true)}
          theme={settings.theme || "system"}
          onToggleTheme={handleToggleTheme}
          userName={settings.user?.name}
        />

        <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
          {/* 1. Dashboard View */}
          {stage === "dashboard" && (
            <DashboardView
              history={history}
              onNewEvaluation={() => setStage("new-evaluation")}
              onViewEvaluation={(item) => {
                setResult(item);
                setStage("results");
              }}
              onDeleteEvaluation={requestDeleteEvaluation}
              onLoadSample={loadSample}
              onNavigate={(dest) => setStage(dest)}
              onDownloadReport={(item) => {
                downloadEvaluationReport(item);
                toast.success("Evaluation Report downloaded ✓", "Ready to print or save as PDF");
              }}
              userName={settings.user?.name}
              sampleLoading={sampleLoading}
            />
          )}

          {/* 2. New Evaluation View */}
          {(stage === "new-evaluation" || stage === "upload") && (
            <NewEvaluationView
              qFiles={qFiles}
              aFiles={aFiles}
              onQFiles={setQFiles}
              onAFiles={setAFiles}
              onProcess={runEvaluation}
              onLoadSample={loadSample}
              error={uploadError}
              busy={sampleLoading}
              sampleLoading={sampleLoading}
              activeModel={settings.model}
              onModelChange={(m) => {
                const updated = { ...settings, model: m };
                setSettings(updated);
                saveSettings(updated);
              }}
              hasKey={!!settings.apiKey || hasServerKey}
            />
          )}

          {/* 3. Processing View */}
          {stage === "processing" && (
            <ProcessingView
              steps={STEP_DEFS}
              states={steps}
              detail={stepDetail}
              progress={progress}
              error={processError}
              onBack={backToUpload}
              onRetry={() => runEvaluation()}
            />
          )}

          {/* 4. Results View */}
          {stage === "results" && result && (
            <ResultsView
              result={result}
              onNewEvaluation={backToUpload}
              onBackToDashboard={() => setStage("dashboard")}
              onRemap={handleRemap}
              onAssignUnmatched={handleAssignUnmatched}
              regrouping={regrouping}
              notice={notice}
            />
          )}

          {/* 5. History View */}
          {stage === "history" && (
            <HistoryView
              history={history}
              onViewEvaluation={(item) => {
                setResult(item);
                setStage("results");
              }}
              onDeleteEvaluation={requestDeleteEvaluation}
              onDownloadReport={(item) => {
                downloadEvaluationReport(item);
                toast.success("Evaluation Report downloaded ✓", "Ready to print or save as PDF");
              }}
              onNewEvaluation={() => setStage("new-evaluation")}
              onLoadSample={loadSample}
              sampleLoading={sampleLoading}
            />
          )}

          {/* 6. Analytics View */}
          {stage === "analytics" && (
            <AnalyticsView
              history={history}
              onNewEvaluation={() => setStage("new-evaluation")}
              onLoadSample={loadSample}
              sampleLoading={sampleLoading}
            />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        key={`settings-${settingsOpen}-${settings.apiKey}-${settings.model}-${settings.theme}`}
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={saveSettingsAndClose}
        onClearHistory={handleClearAllHistory}
      />

      {/* Destructive Action Confirm Modal */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((c) => ({ ...c, open: false }))}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <VedaApp />
    </ToastProvider>
  );
}
