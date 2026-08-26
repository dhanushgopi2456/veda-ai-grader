"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnswerExtraction,
  EvaluationResult,
  Question,
  QuestionGrading,
  Stage,
  StepKey,
  StepState,
} from "@/lib/types";
import { mapAnswersToQuestions } from "@/lib/labels";
import { preparePages, type PreparedPage } from "@/lib/rasterize";
import { loadSettings, saveSettings, type Settings } from "@/lib/settings";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SettingsModal from "@/components/SettingsModal";
import UploadScreen from "@/components/UploadScreen";
import ProcessingView from "@/components/ProcessingView";
import ResultsView from "@/components/ResultsView";
import { HistoryIcon, SparklesIcon, TrashIcon } from "@/components/Icons";

const STEP_DEFS: { key: StepKey; label: string }[] = [
  { key: "prepare", label: "Preparing pages" },
  { key: "questions", label: "Extracting questions" },
  { key: "answers", label: "Extracting answers" },
  { key: "mapping", label: "Mapping answers to questions" },
  { key: "grading", label: "Grading & feedback" },
];

const STEP_BASE: Record<StepKey, number> = {
  prepare: 0,
  questions: 15,
  answers: 42,
  mapping: 72,
  grading: 78,
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

export default function Home() {
  const [stage, setStage] = useState<Stage>("upload");
  const [settings, setSettings] = useState<Settings>({ apiKey: "", model: "gemini-2.5-flash" });
  const [settingsOpen, setSettingsOpen] = useState(false);
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
  const preparedRef = useRef<PreparedCache | null>(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loadSettings());
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const saveSettingsAndClose = useCallback((s: Settings) => {
    setSettings(s);
    saveSettings(s);
    setSettingsOpen(false);
    setUploadError(null);
  }, []);

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

  const runEvaluation = useCallback(async () => {
    const s = loadSettings();
    setSettings(s);
    if (!s.apiKey) {
      setUploadError("Add your free Gemini API key in Settings to run an evaluation.");
      openSettings();
      return;
    }
    setUploadError(null);
    setProcessError(null);
    setNotice(null);
    setSteps(emptySteps());
    setProgress(0);
    setStage("processing");
    const runId = ++runIdRef.current;

    try {
      let qPages = preparedRef.current?.qPages;
      let aPages = preparedRef.current?.aPages;
      if (!qPages || !aPages) {
        setStep("prepare", "active", "Converting your files into page images");
        let done = 0;
        const total = qFiles.length + aFiles.length;
        qPages = await preparePages(qFiles, (d) => {
          done = d;
          setStepDetail(`Question paper — page ${Math.min(d, total)} of ${total}`);
        });
        const qDone = done;
        aPages = await preparePages(aFiles, (d) => {
          setStepDetail(`Answer sheet — page ${d} of ${total - qDone}`);
        });
        preparedRef.current = { qPages, aPages };
        if (runId !== runIdRef.current) return;
      }
      setStep("prepare", "done", `${qPages.length + aPages.length} pages ready`);

      setStep("questions", "active", "Reading the question paper");
      const qData = (await callApi(
        "/api/extract-questions",
        pagesToForm(qPages, s.apiKey, s.model)
      )) as { examTitle: string; questions: Question[] };
      if (runId !== runIdRef.current) return;
      setStep("questions", "done", `Found ${qData.questions.length} questions`);

      setStep("answers", "active", "Reading the handwritten answers");
      const aData = (await callApi(
        "/api/extract-answers",
        pagesToForm(aPages, s.apiKey, s.model)
      )) as { answers: AnswerExtraction[] };
      if (runId !== runIdRef.current) return;
      setStep("answers", "done", `Found ${aData.answers.length} answers`);

      setStep("mapping", "active", "Matching answers to questions");
      await new Promise((r) => setTimeout(r, 400));
      const { results, unmatched } = mapAnswersToQuestions(qData.questions, aData.answers);
      const answered = results.filter((r) => r.answerId).length;
      setStep("mapping", "done", `${answered} matched, ${results.length - answered} unanswered`);

      setStep("grading", "active", "The AI is grading every answer");
      const pairs = results
        .filter((r) => r.answerId)
        .map((r) => {
          const a = aData.answers.find((x) => x.id === r.answerId);
          return { questionId: r.question.id, label: r.question.label, transcription: a?.transcription ?? "" };
        });
      const gData = (await callApi(
        "/api/grade",
        JSON.stringify({ apiKey: s.apiKey, model: s.model, questions: qData.questions, answers: pairs })
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
        examTitle: qData.examTitle,
        questionPages: qPages.map((p) => ({ url: p.url, width: p.width, height: p.height, name: p.name })),
        answerPages: aPages.map((p) => ({ url: p.url, width: p.width, height: p.height, name: p.name })),
        questions: qData.questions,
        answers: aData.answers,
        results: finalResults,
        unmatched,
        overall: gData.overall,
      };
      setResult(evaluation);
      setHistory((h) => [evaluation, ...h]);
      setStage("results");
    } catch (err) {
      if (runId !== runIdRef.current) return;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setProcessError(msg);
      setSteps((prev) => {
        const next = { ...prev };
        const firstActive = STEP_DEFS.find((s) => next[s.key] === "active");
        if (firstActive) next[firstActive.key] = "error";
        return next;
      });
    }
  }, [qFiles, aFiles, openSettings, setStep]);

  function backToUpload() {
    runIdRef.current++;
    preparedRef.current = null;
    setProcessError(null);
    setStage("upload");
  }

  async function loadSample() {
    setSampleLoading(true);
    setUploadError(null);
    try {
      const res = await fetch("/samples/manifest.json");
      if (!res.ok) throw new Error("Sample data not found.");
      const manifest = (await res.json()) as { questions: string[]; answers: string[] };
      async function toFiles(names: string[], prefix: string): Promise<File[]> {
        const files: File[] = [];
        let i = 1;
        for (const n of names) {
          const r = await fetch(`/samples/${n}`);
          const blob = await r.blob();
          files.push(new File([blob], `${prefix}-page-${i++}.jpg`, { type: "image/jpeg" }));
        }
        return files;
      }
      const qs = await toFiles(manifest.questions, "question-paper");
      const as = await toFiles(manifest.answers, "answer-sheet");
      preparedRef.current = null;
      setQFiles(qs);
      setAFiles(as);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not load sample data.");
    } finally {
      setSampleLoading(false);
    }
  }

  async function regrade(updated: EvaluationResult) {
    const s = settings;
    if (!s.apiKey || !updated.overall) return;
    setRegrouping(true);
    setNotice(null);
    try {
      const pairs = updated.results
        .filter((r) => r.answerId)
        .map((r) => {
          const a = updated.answers.find((x) => x.id === r.answerId);
          return { questionId: r.question.id, label: r.question.label, transcription: a?.transcription ?? "" };
        });
      const gData = (await callApi(
        "/api/grade",
        JSON.stringify({ apiKey: s.apiKey, model: s.model, questions: updated.questions, answers: pairs })
      )) as GradeResponse;
      const gradingById = new Map(gData.grading.map((g) => [g.questionId, g]));
      const finalResults = updated.results.map((r) => ({
        ...r,
        grading: gradingById.get(r.question.id) ?? r.grading,
      }));
      const next = { ...updated, results: finalResults, overall: gData.overall };
      setResult(next);
      setHistory((h) => h.map((x) => (x.id === next.id ? next : x)));
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Regrading failed.");
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
        return { ...r, answerId, status: answerId ? ("matched" as const) : ("unanswered" as const), lowConfidence: false };
      }
      if (answerId && r.answerId === answerId) {
        return { ...r, answerId: null, status: "unanswered" as const, lowConfidence: false };
      }
      return r;
    });
    const next = applyMapping(result, results);
    setResult(next);
    setHistory((h) => h.map((x) => (x.id === next.id ? next : x)));
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
    setHistory((h) => h.map((x) => (x.id === next.id ? next : x)));
    void regrade(next);
  }

  const crumb =
    stage === "results" ? "Results" : stage === "processing" ? "Extracting" : stage === "history" ? "History" : "Evaluation";

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-neutral-900">
      <Sidebar
        stage={stage}
        onNavigate={(s) => {
          if (s === "upload" || s === "history") setStage(s);
        }}
        onOpenSettings={openSettings}
        modelName={settings.model}
        hasKey={!!settings.apiKey}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar crumb={crumb} onOpenSettings={openSettings} />
        <div className="min-h-0 flex-1">
          {stage === "upload" && (
            <UploadScreen
              qFiles={qFiles}
              aFiles={aFiles}
              onQFiles={setQFiles}
              onAFiles={setAFiles}
              onProcess={runEvaluation}
              onLoadSample={loadSample}
              error={uploadError}
              busy={sampleLoading}
            />
          )}
          {stage === "processing" && (
            <ProcessingView
              steps={STEP_DEFS}
              states={steps}
              detail={stepDetail}
              progress={progress}
              error={processError}
              onBack={backToUpload}
              onRetry={runEvaluation}
            />
          )}
          {stage === "results" && result && (
            <ResultsView
              result={result}
              onNewEvaluation={backToUpload}
              onRemap={handleRemap}
              onAssignUnmatched={handleAssignUnmatched}
              regrouping={regrouping}
              notice={notice}
            />
          )}
          {stage === "history" && (
            <div className="h-full overflow-y-auto px-4 py-8 lg:px-8">
              <div className="mx-auto max-w-2xl">
                <h1 className="text-xl font-bold text-neutral-900">History</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Evaluations from this session. Files stay in memory only — nothing is uploaded to
                  a server other than Google Gemini.
                </p>
                {history.length === 0 ? (
                  <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
                    <HistoryIcon className="h-8 w-8 text-neutral-300" />
                    <p className="text-sm text-neutral-400">No evaluations yet.</p>
                    <button
                      onClick={() => setStage("upload")}
                      className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Start one now
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                          <SparklesIcon className="h-5 w-5 text-accent" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {h.examTitle || "Answer paper evaluation"}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {new Date(h.createdAt).toLocaleString()} · {h.questions.length} questions
                          </p>
                        </div>
                        {h.overall && (
                          <div className="text-right">
                            <p className="text-sm font-bold text-neutral-900">
                              {h.overall.totalAwarded}/{h.overall.totalMax}
                            </p>
                            <p className="text-[11px] font-semibold text-accent">{h.overall.gradeLetter}</p>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setResult(h);
                            setStage("results");
                          }}
                          className="rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => setHistory((list) => list.filter((x) => x.id !== h.id))}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          aria-label="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <SettingsModal
        key={`settings-${settingsOpen}-${settings.apiKey}-${settings.model}`}
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={saveSettingsAndClose}
      />
    </div>
  );
}
