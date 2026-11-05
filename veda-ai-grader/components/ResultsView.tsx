"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { AnswerExtraction, EvaluationResult } from "@/lib/types";
import { downloadEvaluationReport } from "@/lib/report";
import QuestionCard from "./QuestionCard";
import SheetViewer from "./SheetViewer";
import { useToast } from "./ToastProvider";
import confetti from "canvas-confetti";
import {
  Download,
  Share2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCheck2,
  Printer,
  TrendingUp,
  Target,
  FileSpreadsheet,
  FileJson,
  ChevronDown,
} from "lucide-react";

type Props = {
  result: EvaluationResult;
  onNewEvaluation: () => void;
  onBackToDashboard: () => void;
  onRemap: (questionId: string, answerId: string | null) => void;
  onAssignUnmatched: (answerId: string, questionId: string | null) => void;
  regrouping: boolean;
  notice?: string | null;
};

function gradeColor(letter: string): string {
  if (letter.startsWith("A")) return "bg-emerald-500 text-white shadow-emerald-500/25";
  if (letter === "B") return "bg-blue-500 text-white shadow-blue-500/25";
  if (letter === "C") return "bg-amber-500 text-white shadow-amber-500/25";
  if (letter === "D") return "bg-orange-500 text-white shadow-orange-500/25";
  return "bg-rose-500 text-white shadow-rose-500/25";
}

export default function ResultsView({
  result,
  onNewEvaluation,
  onBackToDashboard,
  onRemap,
  onAssignUnmatched,
  regrouping,
  notice,
}: Props) {
  const { toast } = useToast();
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "insights">("questions");
  const [mobileView, setMobileView] = useState<"questions" | "sheet">("questions");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Celebrate on mount with confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  }, []);

  const stats = useMemo(() => {
    const matched = result.results.filter((r) => r.status === "matched").length;
    const unanswered = result.results.filter((r) => r.status === "unanswered").length;
    const correct = result.results.filter((r) => r.grading?.verdict === "correct").length;
    const partial = result.results.filter((r) => r.grading?.verdict === "partial").length;
    const incorrect = result.results.filter((r) => r.grading?.verdict === "incorrect").length;
    return { matched, unanswered, correct, partial, incorrect };
  }, [result.results]);

  const pct =
    result.overall && result.overall.totalMax > 0
      ? Math.round((result.overall.totalAwarded / result.overall.totalMax) * 100)
      : 0;

  function selectAnswer(answerId: string | null) {
    setSelectedAnswerId(answerId);
    if (answerId) setMobileView("sheet");
  }

  function selectQuestion(questionId: string) {
    const r = result.results.find((x) => x.question.id === questionId);
    selectAnswer(r?.answerId ?? null);
  }

  // Action: Export directly to CSV spreadsheet format
  function handleExportCsv() {
    try {
      const studentName = result.studentName || "Student";
      const subject = result.subject || "Subject";
      const totalAwarded = result.overall ? result.overall.totalAwarded : 0;
      const totalMax = result.overall ? result.overall.totalMax : 0;
      const gradeLetter = result.overall ? result.overall.gradeLetter : "—";
      const dateStr = new Date(result.createdAt).toISOString().split("T")[0];

      const rows: string[][] = [
        ["# VedaAI Evaluation Report"],
        ["Exam Title", result.examTitle || "Answer Paper Evaluation"],
        ["Student Name", studentName],
        ["Subject", subject],
        ["Evaluation Date", dateStr],
        ["Total Marks Awarded", String(totalAwarded)],
        ["Maximum Marks", String(totalMax)],
        ["Percentage Score", `${pct}%`],
        ["Letter Grade", gradeLetter],
        ["Summary Feedback", result.overall?.summary || ""],
        [],
        [
          "Question Label",
          "Question Number",
          "Question Text",
          "Max Marks",
          "Awarded Marks",
          "Verdict",
          "Handwritten Answer Transcription",
          "OCR Confidence",
          "Examiner Rubric Feedback",
        ],
      ];

      result.results.forEach((r) => {
        const answer = r.answerId ? result.answers.find((a) => a.id === r.answerId) : null;
        rows.push([
          r.question.label,
          r.question.number,
          r.question.text,
          String(r.question.marks ?? r.grading?.marksTotal ?? 5),
          String(r.grading?.marksAwarded ?? 0),
          r.grading?.verdict || r.status,
          answer?.transcription || (r.status === "unanswered" ? "[Unanswered]" : "[No handwriting detected]"),
          answer ? `${Math.round(answer.confidence * 100)}%` : "N/A",
          r.grading?.feedback || "",
        ]);
      });

      if (result.overall?.strengths?.length) {
        rows.push([]);
        rows.push(["Key Strengths"]);
        result.overall.strengths.forEach((s) => rows.push(["", s]));
      }

      if (result.overall?.improvements?.length) {
        rows.push([]);
        rows.push(["Areas for Improvement"]);
        result.overall.improvements.forEach((i) => rows.push(["", i]));
      }

      const csvString = rows
        .map((row) =>
          row
            .map((val) => {
              const cleaned = String(val ?? "").replace(/"/g, '""');
              return `"${cleaned}"`;
            })
            .join(",")
        )
        .join("\r\n");

      // UTF-8 BOM ensures Excel & Sheets open correctly with accents and symbols
      const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const cleanFileName = `veda-ai-${studentName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${subject.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${dateStr}.csv`;
      anchor.setAttribute("download", cleanFileName);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setExportMenuOpen(false);
      toast.success("Results exported successfully as CSV ✓", "Spreadsheet ready for Excel & Google Sheets");
    } catch {
      toast.error("Failed to export results as CSV");
    }
  }

  // Action: Export directly to JSON data format
  function handleExportJson() {
    try {
      const studentName = result.studentName || "Student";
      const subject = result.subject || "Subject";
      const dateStr = new Date(result.createdAt).toISOString().split("T")[0];

      const exportPayload = {
        meta: {
          app: "VedaAI",
          version: "1.0",
          exportedAt: new Date().toISOString(),
          evaluationId: result.id,
          examTitle: result.examTitle,
          studentName,
          subject,
          createdAt: result.createdAt,
          score: {
            awarded: result.overall?.totalAwarded ?? 0,
            max: result.overall?.totalMax ?? 0,
            percentage: pct,
            gradeLetter: result.overall?.gradeLetter ?? "—",
          },
        },
        summary: result.overall,
        questions: result.results.map((r) => {
          const ans = r.answerId ? result.answers.find((a) => a.id === r.answerId) : null;
          return {
            id: r.question.id,
            label: r.question.label,
            number: r.question.number,
            questionText: r.question.text,
            maxMarks: r.question.marks ?? r.grading?.marksTotal ?? 5,
            awardedMarks: r.grading?.marksAwarded ?? 0,
            verdict: r.grading?.verdict ?? r.status,
            lowConfidence: r.lowConfidence,
            handwrittenAnswer: ans
              ? {
                  id: ans.id,
                  detectedLabel: ans.rawLabel,
                  transcription: ans.transcription,
                  ocrConfidence: ans.confidence,
                  regions: ans.regions,
                }
              : null,
            grading: r.grading,
          };
        }),
        unmatchedAnswers: result.unmatched,
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `veda-ai-${studentName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${subject.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${dateStr}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExportMenuOpen(false);
      toast.success("Results exported successfully as JSON ✓", "Structured JSON data downloaded");
    } catch {
      toast.error("Failed to export results as JSON.");
    }
  }

  // Action: Download / Print PDF Report
  function handlePrintReport() {
    toast.info("Preparing evaluation report...", "Downloading print-ready document");
    downloadEvaluationReport(result);
    setExportMenuOpen(false);
  }

  // Action: Share Evaluation
  async function handleShare() {
    const summaryText = `VedaAI Evaluation: ${result.examTitle || "Exam Paper"}\nScore: ${
      result.overall?.totalAwarded
    }/${result.overall?.totalMax} (${pct}% - Grade ${
      result.overall?.gradeLetter || "A"
    })\nEvaluated with VedaAI.`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
        toast.success("Evaluation summary copied to clipboard ✓", "Ready to paste and share");
        return;
      }
    } catch {}

    // Fallback clipboard copying
    try {
      const el = document.createElement("textarea");
      el.value = summaryText;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast.success("Evaluation summary copied to clipboard ✓", "Ready to paste and share");
    } catch {
      toast.info("Evaluation Summary", `Score: ${result.overall?.totalAwarded}/${result.overall?.totalMax}`);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Top Header Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-200/90 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToDashboard}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Back to Dashboard"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Evaluation Complete
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {result.subject || "General Subject"}
              </span>
            </div>
            <h1 className="truncate text-base font-bold text-neutral-900 dark:text-white mt-0.5">
              {result.examTitle || "Answer Paper Evaluation"}
            </h1>
          </div>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          {regrouping && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-950/80 dark:text-orange-400 animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Regrading changes...</span>
            </span>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            title="Share or copy summary"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Direct CSV Export Button */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-emerald-400 transition-colors"
            title="Export evaluation results directly to CSV format (Excel & Google Sheets)"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline font-semibold">Export CSV</span>
            <span className="sm:hidden font-semibold">CSV</span>
          </button>

          {/* Direct JSON Export Button */}
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-blue-400 transition-colors"
            title="Export evaluation results directly to JSON format"
          >
            <FileJson className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline font-semibold">Export JSON</span>
            <span className="sm:hidden font-semibold">JSON</span>
          </button>

          {/* Consolidated Export Dropdown */}
          <div className="relative z-50">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExportMenuOpen((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
              title="See all export options"
              aria-label="See export options"
            >
              <Download className="h-3.5 w-3.5 text-orange-500" />
              <span>See Options</span>
              <ChevronDown
                className={`h-3 w-3 text-neutral-400 transition-transform duration-200 ${
                  exportMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="anim-fade-up absolute right-0 top-full mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50 space-y-1">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Direct File Exports
                  </div>

                  <button
                    onClick={handleExportCsv}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-neutral-700 hover:bg-emerald-50/80 hover:text-emerald-900 dark:text-neutral-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors text-left"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <FileSpreadsheet className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-white">Export to CSV</p>
                      <p className="text-[10px] text-neutral-400">Excel, Sheets &amp; gradebook</p>
                    </div>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-neutral-700 hover:bg-blue-50/80 hover:text-blue-900 dark:text-neutral-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 transition-colors text-left"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100/70 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                      <FileJson className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-white">Export to JSON</p>
                      <p className="text-[10px] text-neutral-400">Raw transcriptions &amp; scores</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      handlePrintReport();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors text-left"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <Printer className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-white">Download PDF</p>
                      <p className="text-[10px] text-neutral-400">Printable evaluation report</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handlePrintReport}
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={onNewEvaluation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            <span>New Evaluation</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="anim-fade-up border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          {notice}
        </div>
      )}

      {/* Main Split Body */}
      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(420px,46%)_1fr]">
        {/* Left Column: Summary Card, Tabs, Question List */}
        <div
          className={`min-h-0 overflow-y-auto border-neutral-200 p-4 lg:p-6 space-y-4 lg:block lg:border-r dark:border-neutral-800 ${
            mobileView === "questions" ? "block" : "hidden"
          }`}
        >
          {/* Executive Score Card */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Performance Score
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {result.overall ? result.overall.totalAwarded : 0}
                  </span>
                  <span className="text-base font-semibold text-neutral-400">
                    /{result.overall ? result.overall.totalMax : 0}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                    ({pct}%)
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Candidate:{" "}
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {result.studentName || "Student Submission"}
                  </span>
                </p>
              </div>

              {result.overall?.gradeLetter && (
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-extrabold shadow-lg ${gradeColor(
                      result.overall.gradeLetter
                    )}`}
                  >
                    {result.overall.gradeLetter}
                  </div>
                  <span className="mt-1 text-[11px] font-semibold text-neutral-400">
                    Grade
                  </span>
                </div>
              )}
            </div>

            {/* Score Progress Bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(5, pct)}%` }}
              />
            </div>

            {/* Metric Chips */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-2 dark:border-emerald-950 dark:bg-emerald-950/30">
                <span className="block text-base font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                  {stats.correct}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Correct
                </span>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-2 dark:border-amber-950 dark:bg-amber-950/30">
                <span className="block text-base font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                  {stats.partial}
                </span>
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  Partial
                </span>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-2 dark:border-rose-950 dark:bg-rose-950/30">
                <span className="block text-base font-bold text-rose-700 dark:text-rose-300 tabular-nums">
                  {stats.incorrect}
                </span>
                <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                  Incorrect
                </span>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50">
                <span className="block text-base font-bold text-neutral-700 dark:text-neutral-300 tabular-nums">
                  {stats.unanswered}
                </span>
                <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                  Unattempted
                </span>
              </div>
            </div>
          </div>

          {/* Quick Direct Export Bar */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-white">Export Results</p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Download formatted marks &amp; AI feedback directly</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
                title="Export results directly to CSV format"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 transition-colors"
                title="Export results directly to JSON format"
              >
                <FileJson className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Segmented Switcher: Questions vs AI Insights */}
          <div className="flex items-center rounded-xl bg-neutral-200/70 dark:bg-neutral-800/80 p-1">
            <button
              onClick={() => setActiveTab("questions")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "questions"
                  ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Question-wise ({result.results.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "insights"
                  ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span>AI Insights &amp; Rubric</span>
            </button>
          </div>

          {/* TAB 1: Question Cards */}
          {activeTab === "questions" && (
            <div className="space-y-3">
              {result.results.map((r) => (
                <QuestionCard
                  key={r.question.id}
                  result={r}
                  answers={result.answers}
                  unmatchedAnswers={result.unmatched}
                  selected={!!r.answerId && r.answerId === selectedAnswerId}
                  onSelect={() => selectQuestion(r.question.id)}
                  onRemap={onRemap}
                />
              ))}

              {/* Unmatched Answers Section */}
              {result.unmatched.length > 0 && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        Unmatched Handwritten Blocks ({result.unmatched.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400">
                      Detected on sheet without question label
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {result.unmatched.map((a: AnswerExtraction) => (
                      <div
                        key={a.id}
                        className="rounded-xl border border-amber-200/80 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                            {a.rawLabel || "Unlabeled response"}
                          </span>
                          <button
                            type="button"
                            onClick={() => selectAnswer(selectedAnswerId === a.id ? null : a.id)}
                            className="text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
                          >
                            {selectedAnswerId === a.id ? "Hide on sheet" : "Locate on sheet →"}
                          </button>
                        </div>
                        <p className="mt-2 text-xs font-mono text-neutral-600 dark:text-neutral-300 line-clamp-2">
                          {a.transcription || "[No text transcribed]"}
                        </p>
                        <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <span className="text-[11px] text-neutral-400">Link to question:</span>
                          <select
                            value=""
                            onChange={(e) => onAssignUnmatched(a.id, e.target.value || null)}
                            className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                          >
                            <option value="">— Select a question —</option>
                            {result.results.map((r) => (
                              <option key={r.question.id} value={r.question.id}>
                                {r.question.label}: {r.question.text.slice(0, 36)}…
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI Insights */}
          {activeTab === "insights" && result.overall && (
            <div className="space-y-4 anim-fade-up">
              {/* Executive Summary */}
              {result.overall.summary && (
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Executive Summary</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {result.overall.summary}
                  </p>
                </div>
              )}

              {/* Strengths */}
              {result.overall.strengths.length > 0 && (
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Observed Strengths &amp; Mastery</span>
                  </div>
                  <ul className="space-y-2">
                    {result.overall.strengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="leading-relaxed">{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Improvements */}
              {result.overall.improvements.length > 0 && (
                <div className="rounded-2xl border border-orange-200/80 bg-orange-50/50 p-5 dark:border-orange-900/60 dark:bg-orange-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300">
                    <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span>Areas for Academic Improvement</span>
                  </div>
                  <ul className="space-y-2">
                    {result.overall.improvements.map((imp, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct Export Card in Insights */}
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Export Full Evaluation Dataset
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Save this complete assessment, questions, student answer transcriptions, and grading rubric.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Download CSV (Spreadsheet)</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 transition-colors"
                  >
                    <FileJson className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Download JSON (Raw Data)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Sheet Viewer */}
        <div
          className={`min-h-0 ${
            mobileView === "sheet" ? "block" : "hidden"
          } lg:block`}
        >
          <SheetViewer
            result={result}
            selectedAnswerId={selectedAnswerId}
            onSelectAnswer={(id) => {
              setSelectedAnswerId(id);
              if (id) setMobileView("questions");
            }}
          />
        </div>
      </div>

      {/* Mobile Bottom Toggle Bar */}
      <div className="flex h-14 shrink-0 items-stretch border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:hidden">
        <button
          onClick={() => setMobileView("questions")}
          className={`flex flex-1 items-center justify-center gap-2 text-xs font-semibold ${
            mobileView === "questions"
              ? "text-orange-600 dark:text-orange-400 border-t-2 border-orange-500"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Evaluation ({result.results.length})</span>
        </button>

        <button
          onClick={() => setMobileView("sheet")}
          className={`flex flex-1 items-center justify-center gap-2 text-xs font-semibold ${
            mobileView === "sheet"
              ? "text-orange-600 dark:text-orange-400 border-t-2 border-orange-500"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Scanned Sheet ({result.answerPages.length})</span>
        </button>
      </div>
    </div>
  );
}
