"use client";

import React, { useMemo, useState } from "react";
import type { EvaluationResult } from "@/lib/types";
import {
  Search,
  FileCheck2,
  Eye,
  Download,
  Trash2,
  FilePlus2,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

type Props = {
  history: EvaluationResult[];
  onViewEvaluation: (result: EvaluationResult) => void;
  onDeleteEvaluation: (id: string) => void;
  onDownloadReport: (result: EvaluationResult) => void;
  onNewEvaluation: () => void;
  onLoadSample: () => void;
  sampleLoading: boolean;
};

type ScoreFilter = "all" | "top" | "passing" | "needs-review";

export default function HistoryView({
  history,
  onViewEvaluation,
  onDeleteEvaluation,
  onDownloadReport,
  onNewEvaluation,
  onLoadSample,
  sampleLoading,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        if (q) {
          const title = (item.examTitle || "").toLowerCase();
          const student = (item.studentName || "").toLowerCase();
          const subject = (item.subject || "").toLowerCase();
          if (!title.includes(q) && !student.includes(q) && !subject.includes(q)) {
            return false;
          }
        }

        // Score filter
        const pct =
          item.overall && item.overall.totalMax > 0
            ? (item.overall.totalAwarded / item.overall.totalMax) * 100
            : 0;

        if (scoreFilter === "top" && pct < 80) return false;
        if (scoreFilter === "passing" && (pct < 50 || pct >= 80)) return false;
        if (scoreFilter === "needs-review" && pct >= 50) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.createdAt - a.createdAt;
        if (sortBy === "oldest") return a.createdAt - b.createdAt;
        const pctA =
          a.overall && a.overall.totalMax > 0
            ? (a.overall.totalAwarded / a.overall.totalMax) * 100
            : 0;
        const pctB =
          b.overall && b.overall.totalMax > 0
            ? (b.overall.totalAwarded / b.overall.totalMax) * 100
            : 0;
        if (sortBy === "highest") return pctB - pctA;
        if (sortBy === "lowest") return pctA - pctB;
        return 0;
      });
  }, [history, searchQuery, scoreFilter, sortBy]);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Evaluation History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Search, filter, and review all previous AI evaluation batches and student reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewEvaluation}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            <FilePlus2 className="h-4 w-4" />
            <span>New Evaluation</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-neutral-200/90 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, student, or subject..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 pl-9 pr-3.5 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
          />
        </div>

        {/* Filters and Sorters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Segmented Filter */}
          <div className="flex items-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 text-xs">
            {(
              [
                { id: "all", label: "All" },
                { id: "top", label: "Top (≥80%)" },
                { id: "passing", label: "Passing" },
                { id: "needs-review", label: "Needs Review" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setScoreFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  scoreFilter === tab.id
                    ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest score</option>
              <option value="lowest">Lowest score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/90 bg-white py-16 px-6 text-center space-y-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/60">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {searchQuery ? "No matching evaluations found" : "No evaluations recorded yet"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {searchQuery
                ? "Try searching with a different term or clear the active score filter."
                : "Your completed AI answer sheet evaluations and student scorecards will be archived here."}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setScoreFilter("all");
                }}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Clear Filters
              </button>
            ) : (
              <>
                <button
                  onClick={onNewEvaluation}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
                >
                  <FilePlus2 className="h-4 w-4" />
                  <span>Start First Evaluation</span>
                </button>
                <button
                  onClick={onLoadSample}
                  disabled={sampleLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span>Load Sample Exam</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
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
                {filteredHistory.map((item) => {
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
                      year: "numeric",
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
                          {item.studentName || "Candidate Submission"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-600 dark:text-neutral-300">
                        {item.subject || "General Science"}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {item.questions.length} questions
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
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                              item.overall.gradeLetter.startsWith("A")
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : item.overall.gradeLetter === "B"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                  : item.overall.gradeLetter === "C"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            }`}
                          >
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
        </div>
      )}
    </div>
  );
}
