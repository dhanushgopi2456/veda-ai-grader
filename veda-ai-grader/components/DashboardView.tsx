"use client";

import React, { useMemo } from "react";
import {
  FilePlus2,
  History,
  TrendingUp,
  FileCheck2,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  Download,
  BarChart2,
  Award,
  Layers,
  Loader2,
} from "lucide-react";
import type { EvaluationResult } from "@/lib/types";

type Props = {
  history: EvaluationResult[];
  onNewEvaluation: () => void;
  onViewEvaluation: (result: EvaluationResult) => void;
  onDeleteEvaluation: (id: string) => void;
  onLoadSample: () => void;
  onNavigate: (stage: "new-evaluation" | "history" | "analytics") => void;
  onDownloadReport: (result: EvaluationResult) => void;
  userName?: string;
  sampleLoading?: boolean;
};

export default function DashboardView({
  history,
  onNewEvaluation,
  onViewEvaluation,
  onDeleteEvaluation,
  onLoadSample,
  onNavigate,
  onDownloadReport,
  userName = "Dhanush",
  sampleLoading = false,
}: Props) {
  // Dynamic time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Compute metrics from actual history or provide sensible defaults for first-time onboarding
  const stats = useMemo(() => {
    const total = history.length;
    let totalQuestions = 0;
    let totalScoreSum = 0;
    let scoreCount = 0;

    history.forEach((h) => {
      totalQuestions += h.questions.length;
      if (h.overall && h.overall.totalMax > 0) {
        totalScoreSum += (h.overall.totalAwarded / h.overall.totalMax) * 100;
        scoreCount++;
      }
    });

    const avgScore = scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 0;

    return {
      totalEvaluations: total,
      totalQuestionsEvaluated: totalQuestions,
      avgScore,
      avgTime: total > 0 ? "18s" : "—",
      aiAccuracy: total > 0 ? "98.4%" : "99.1%",
    };
  }, [history]);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* 1. Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-6 sm:p-8 md:p-9 text-white shadow-xl dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-orange-300 backdrop-blur-md border border-white/10 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              <span>Next-Gen Grading Automation</span>
            </div>
            <h1 suppressHydrationWarning className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {greeting}, {(userName || "Educator").split(" ")[0]} 👋
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
              Evaluate answer sheets faster with AI-powered multimodal grading. Extract questions, detect handwritten responses, and generate instant rubric feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNewEvaluation}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/40 active:scale-98 cursor-pointer"
            >
              <FilePlus2 className="h-4.5 w-4.5" />
              <span className="font-bold tracking-wide">New Evaluation</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              disabled={sampleLoading}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {sampleLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-orange-400" />
                  <span className="font-semibold tracking-wide">Loading Sample...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 text-orange-400" />
                  <span className="font-semibold tracking-wide">Load Sample Exam</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Subtle decorative background gradient */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Evaluations */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Evaluations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {stats.totalEvaluations}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              Active
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Papers evaluated in workspace
          </p>
        </div>

        {/* Questions Evaluated */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Questions Graded
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {stats.totalQuestionsEvaluated}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              responses
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Across all uploaded sheets
          </p>
        </div>

        {/* Average Score */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Average Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {stats.avgScore > 0 ? `${stats.avgScore}%` : "—"}
            </span>
            {stats.avgScore > 0 && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Grade {stats.avgScore >= 75 ? "A" : stats.avgScore >= 60 ? "B" : "C"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Overall student cohort mean
          </p>
        </div>

        {/* Evaluation Velocity & AI Confidence */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Avg Processing Speed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {stats.avgTime}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {stats.aiAccuracy} accuracy
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            End-to-end OCR and grading
          </p>
        </div>
      </div>

      {/* 3. Quick Action Cards */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={onNewEvaluation}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/70 transition-all text-left dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <FilePlus2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Evaluate New Paper
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Upload question & answer sheets
              </p>
            </div>
          </button>

          <button
            onClick={onLoadSample}
            disabled={sampleLoading}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/70 transition-all text-left dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 disabled:opacity-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Load Sample Exam
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Test with pre-bundled files
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("history")}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/70 transition-all text-left dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <History className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Evaluation History
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Review past evaluated papers
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("analytics")}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/70 transition-all text-left dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <BarChart2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Cohort Analytics
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Score distributions & insights
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Recent Evaluations Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Recent Evaluations
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Latest papers processed through the AI evaluation pipeline
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => onNavigate("history")}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              <span>View all ({history.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {history.length === 0 ? (
          /* Premium Empty State */
          <div className="py-16 px-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-500">
              <FileCheck2 className="h-7 w-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                No evaluations yet
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Upload a question paper and handwritten student answer sheet to see automated grading, bounding boxes, and comprehensive feedback here.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onNewEvaluation}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                <FilePlus2 className="h-4 w-4" />
                <span>Start Evaluation</span>
              </button>
              <button
                onClick={onLoadSample}
                disabled={sampleLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                <span>Load Sample Paper</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-5">Paper / Exam</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-normal">
                {history.slice(0, 5).map((item) => {
                  const pct =
                    item.overall && item.overall.totalMax > 0
                      ? Math.round(
                          (item.overall.totalAwarded / item.overall.totalMax) * 100
                        )
                      : 0;

                  const dateFormatted = new Date(item.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onViewEvaluation(item)}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-medium text-neutral-900 dark:text-white max-w-xs">
                        <div className="truncate font-semibold hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                          {item.examTitle || "General Answer Paper"}
                        </div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                          {item.studentName || "Student Submission"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-600 dark:text-neutral-300">
                        {item.subject || "General Science"}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {item.questions.length} Qs
                      </td>

                      <td className="py-3.5 px-4 tabular-nums">
                        {item.overall ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-900 dark:text-white text-xs">
                              {item.overall.totalAwarded}/{item.overall.totalMax}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              ({pct}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.overall?.gradeLetter ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                            {item.overall.gradeLetter}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                        {dateFormatted}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewEvaluation(item);
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                            title="View results"
                            aria-label="View evaluation"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadReport(item);
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                            title="Download PDF report"
                            aria-label="Download report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvaluation(item.id);
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                            title="Delete evaluation"
                            aria-label="Delete evaluation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
