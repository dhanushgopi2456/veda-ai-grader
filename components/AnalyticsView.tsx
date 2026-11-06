"use client";

import React, { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type { EvaluationResult } from "@/lib/types";

interface Props {
  history: EvaluationResult[];
  onNewEvaluation: () => void;
  onLoadSample: () => void;
  sampleLoading?: boolean;
}

export default function AnalyticsView({
  history,
  onNewEvaluation,
  onLoadSample,
  sampleLoading = false,
}: Props) {
  const analytics = useMemo(() => {
    if (history.length === 0) return null;

    const total = history.length;
    const scores = history.map((h) =>
      h.overall && h.overall.totalMax > 0
        ? Math.round((h.overall.totalAwarded / h.overall.totalMax) * 100)
        : 0
    );
    const avgScore = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    // Distribution brackets
    const distribution = {
      "90-100%": 0,
      "80-89%": 0,
      "70-79%": 0,
      "60-69%": 0,
      "<60%": 0,
    };

    scores.forEach((s) => {
      if (s >= 90) distribution["90-100%"]++;
      else if (s >= 80) distribution["80-89%"]++;
      else if (s >= 70) distribution["70-79%"]++;
      else if (s >= 60) distribution["60-69%"]++;
      else distribution["<60%"]++;
    });

    // Aggregate questions & status
    let totalQuestions = 0;
    let correctCount = 0;
    let partialCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    history.forEach((h) => {
      h.results.forEach((r) => {
        totalQuestions++;
        const g = r.grading;
        if (!g || r.status === "unanswered" || r.status === "unmatched") {
          unansweredCount++;
        } else {
          const pct = g.marksTotal > 0 ? (g.marksAwarded / g.marksTotal) * 100 : 0;
          if (pct >= 85 || g.verdict === "correct") correctCount++;
          else if (pct > 0 || g.verdict === "partial") partialCount++;
          else incorrectCount++;
        }
      });
    });

    const correctPct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const partialPct = totalQuestions > 0 ? Math.round((partialCount / totalQuestions) * 100) : 0;
    const incorrectPct = totalQuestions > 0 ? Math.round((incorrectCount / totalQuestions) * 100) : 0;
    const unansweredPct = totalQuestions > 0 ? Math.round((unansweredCount / totalQuestions) * 100) : 0;

    // Subject breakdown
    const subjectMap: Record<string, { count: number; totalScore: number }> = {};
    history.forEach((h) => {
      const subj = h.subject || h.evalConfig?.subject || "General";
      const score =
        h.overall && h.overall.totalMax > 0
          ? Math.round((h.overall.totalAwarded / h.overall.totalMax) * 100)
          : 0;
      if (!subjectMap[subj]) subjectMap[subj] = { count: 0, totalScore: 0 };
      subjectMap[subj].count++;
      subjectMap[subj].totalScore += score;
    });

    const subjectStats = Object.entries(subjectMap).map(([name, data]) => ({
      name,
      count: data.count,
      avg: Math.round(data.totalScore / data.count),
    }));

    return {
      total,
      avgScore,
      highestScore,
      lowestScore,
      distribution,
      totalQuestions,
      correctCount,
      correctPct,
      partialCount,
      partialPct,
      incorrectCount,
      incorrectPct,
      unansweredCount,
      unansweredPct,
      subjectStats,
    };
  }, [history]);

  if (!analytics) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex items-center justify-center max-w-4xl mx-auto w-full bg-transparent text-[var(--ink)]">
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md py-16 px-8 text-center space-y-4 w-full">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-[24px] font-normal tracking-tight text-[var(--ink)]">
              No Evaluation Records Yet
            </h3>
            <p className="text-[14px] font-sans text-[var(--slate)] leading-relaxed">
              Run your first student assessment or load our bundled Physics exam pack to generate live classroom analytics and mastery distributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNewEvaluation}
              className="btn-steep-primary cursor-pointer"
            >
              <span>Create Evaluation</span>
            </button>
            <button
              onClick={onLoadSample}
              disabled={sampleLoading}
              className="btn-steep-secondary cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{sampleLoading ? "Loading Sample…" : "Load Sample Pack"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 max-w-[1200px] mx-auto w-full bg-transparent text-[var(--ink)] text-left">
      {/* Title */}
      <div>
        <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
          Cohort Metrics
        </span>
        <h1 className="mt-1 font-serif text-[32px] sm:text-[40px] font-normal tracking-[-0.66px] text-[var(--ink)]">
          Performance &amp; Accuracy Distributions
        </h1>
        <p className="text-[14px] font-sans text-[var(--slate)] mt-1">
          Aggregated across {analytics.total} evaluated student examination papers.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Score */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Mean Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {analytics.avgScore}%
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[var(--slate)]">
            Grade {analytics.avgScore >= 75 ? "A" : "B"} average
          </p>
        </div>

        {/* Highest Score */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Peak Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {analytics.highestScore}%
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[var(--slate)]">
            Lowest: {analytics.lowestScore}%
          </p>
        </div>

        {/* Question Accuracy */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Full Mastery
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {analytics.correctPct}%
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[var(--slate)]">
            {analytics.correctCount} responses correct
          </p>
        </div>

        {/* Latency */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Mean Latency
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              ~18s
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[var(--slate)]">
            Per examination script
          </p>
        </div>
      </div>

      {/* Grid: Score Distribution & Question Accuracy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Distribution Chart */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-7 space-y-5">
          <div>
            <h3 className="font-serif text-[20px] font-normal text-[var(--ink)]">
              Score Distribution
            </h3>
            <p className="text-[13px] font-sans text-[var(--slate)] mt-0.5">
              Percentage of submissions per grade bracket
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {Object.entries(analytics.distribution).map(([bracket, count]) => {
              const share = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
              return (
                <div key={bracket} className="space-y-1.5">
                  <div className="flex justify-between text-[13px] font-sans">
                    <span className="font-medium text-[var(--ink)]">
                      {bracket}
                    </span>
                    <span className="text-[var(--slate)]">
                      {count} papers ({share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--canvas)]/80 overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-[var(--ink)] transition-all duration-300"
                      style={{ width: `${Math.max(4, share)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Quality Distribution */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-7 space-y-5">
          <div>
            <h3 className="font-serif text-[20px] font-normal text-[var(--ink)]">
              Response Alignment Quality
            </h3>
            <p className="text-[13px] font-sans text-[var(--slate)] mt-0.5">
              Aggregated across all questions evaluated
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[var(--ink)]">
                  Correct (≥85% score)
                </span>
                <span className="text-[var(--slate)]">
                  {analytics.correctCount} ({analytics.correctPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--canvas)]/80 overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                  style={{ width: `${analytics.correctPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[var(--ink)]">
                  Partial Credit
                </span>
                <span className="text-[var(--slate)]">
                  {analytics.partialCount} ({analytics.partialPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--canvas)]/80 overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${analytics.partialPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[var(--ink)]">
                  Incorrect Attempt
                </span>
                <span className="text-[var(--slate)]">
                  {analytics.incorrectCount} ({analytics.incorrectPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--canvas)]/80 overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${analytics.incorrectPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[var(--ink)]">
                  Unanswered / Blank
                </span>
                <span className="text-[var(--slate)]">
                  {analytics.unansweredCount} ({analytics.unansweredPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--canvas)]/80 overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full rounded-full bg-[var(--ash)]"
                  style={{ width: `${analytics.unansweredPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Stats */}
      {analytics.subjectStats.length > 0 && (
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/85 backdrop-blur-md p-7">
          <h3 className="font-serif text-[20px] font-normal text-[var(--ink)] mb-1">
            Subject Cohort Averages
          </h3>
          <p className="text-[13px] font-sans text-[var(--slate)] mb-5">
            Performance grouped by curriculum topic
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.subjectStats.map((s) => (
              <div
                key={s.name}
                className="p-4 rounded-[16px] bg-[var(--canvas)]/80 backdrop-blur-md border border-[var(--border)]"
              >
                <div className="flex items-center justify-between text-[12px] font-sans text-[var(--slate)]">
                  <span className="font-medium text-[var(--ink)]">{s.name}</span>
                  <span>{s.count} paper{s.count > 1 ? "s" : ""}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-[28px] font-normal text-[var(--ink)]">
                    {s.avg}%
                  </span>
                  <span className="text-[12px] font-sans text-[var(--slate)]">
                    Grade {s.avg >= 75 ? "A" : s.avg >= 60 ? "B" : "C"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
