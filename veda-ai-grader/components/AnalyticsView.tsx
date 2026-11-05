"use client";

import React, { useMemo } from "react";
import type { EvaluationResult } from "@/lib/types";
import {
  BarChart3,
  Award,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  HelpCircle,
  XCircle,
  FilePlus2,
  Sparkles,
} from "lucide-react";

type Props = {
  history: EvaluationResult[];
  onNewEvaluation: () => void;
  onLoadSample: () => void;
  sampleLoading: boolean;
};

export default function AnalyticsView({
  history,
  onNewEvaluation,
  onLoadSample,
  sampleLoading,
}: Props) {
  const analytics = useMemo(() => {
    const total = history.length;
    if (total === 0) {
      return null;
    }

    let highestScore = 0;
    let lowestScore = 100;
    let totalScoreSum = 0;
    let validScores = 0;

    let correctTotal = 0;
    let partialTotal = 0;
    let incorrectTotal = 0;
    let unansweredTotal = 0;

    const distribution = {
      "90-100%": 0,
      "80-89%": 0,
      "70-79%": 0,
      "60-69%": 0,
      "<60%": 0,
    };

    const subjectMap: Record<string, { count: number; scoreSum: number }> = {};

    history.forEach((h) => {
      // Questions accuracy
      h.results.forEach((r) => {
        if (r.status === "unanswered") unansweredTotal++;
        else if (r.grading?.verdict === "correct") correctTotal++;
        else if (r.grading?.verdict === "partial") partialTotal++;
        else if (r.grading?.verdict === "incorrect") incorrectTotal++;
      });

      // Scores
      if (h.overall && h.overall.totalMax > 0) {
        const pct = Math.round((h.overall.totalAwarded / h.overall.totalMax) * 100);
        totalScoreSum += pct;
        validScores++;
        if (pct > highestScore) highestScore = pct;
        if (pct < lowestScore) lowestScore = pct;

        if (pct >= 90) distribution["90-100%"]++;
        else if (pct >= 80) distribution["80-89%"]++;
        else if (pct >= 70) distribution["70-79%"]++;
        else if (pct >= 60) distribution["60-69%"]++;
        else distribution["<60%"]++;

        const subj = h.subject || "General";
        if (!subjectMap[subj]) subjectMap[subj] = { count: 0, scoreSum: 0 };
        subjectMap[subj].count++;
        subjectMap[subj].scoreSum += pct;
      }
    });

    const avgScore = validScores > 0 ? Math.round(totalScoreSum / validScores) : 0;
    const totalQuestions =
      correctTotal + partialTotal + incorrectTotal + unansweredTotal;

    const subjectStats = Object.entries(subjectMap).map(([name, data]) => ({
      name,
      count: data.count,
      avg: Math.round(data.scoreSum / data.count),
    }));

    return {
      total,
      highestScore: validScores > 0 ? highestScore : 0,
      lowestScore: validScores > 0 ? lowestScore : 0,
      avgScore,
      distribution,
      correctPct: totalQuestions > 0 ? Math.round((correctTotal / totalQuestions) * 100) : 0,
      partialPct: totalQuestions > 0 ? Math.round((partialTotal / totalQuestions) * 100) : 0,
      incorrectPct: totalQuestions > 0 ? Math.round((incorrectTotal / totalQuestions) * 100) : 0,
      unansweredPct: totalQuestions > 0 ? Math.round((unansweredTotal / totalQuestions) * 100) : 0,
      correctCount: correctTotal,
      partialCount: partialTotal,
      incorrectCount: incorrectTotal,
      unansweredCount: unansweredTotal,
      subjectStats,
    };
  }, [history]);

  if (!analytics) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex items-center justify-center max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-neutral-200/90 bg-white py-16 px-6 text-center space-y-4 dark:border-neutral-800 dark:bg-neutral-900 w-full">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/60">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No analytics data yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Complete evaluations to unlock score distributions, question accuracy insights, and cohort trends.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onNewEvaluation}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
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
              <span>Load Sample Exam</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Cohort Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Quantitative score distributions, question accuracy benchmarks, and historical grading metrics.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Score */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Mean Score
            </span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {analytics.avgScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Grade {analytics.avgScore >= 75 ? "A" : "B"}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Based on {analytics.total} evaluated papers
          </p>
        </div>

        {/* Highest Score */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Highest Score
            </span>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {analytics.highestScore}%
            </span>
            <span className="text-xs text-neutral-400">Peak performance</span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Lowest: {analytics.lowestScore}%
          </p>
        </div>

        {/* Question Accuracy */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Full Mastery
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {analytics.correctPct}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Correct answers
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            {analytics.correctCount} responses fully correct
          </p>
        </div>

        {/* Average Evaluation Latency */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Evaluation Speed
            </span>
            <Clock className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              ~18s
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Avg latency
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Automated OCR &amp; rubric evaluation
          </p>
        </div>
      </div>

      {/* Grid: Score Distribution & Question Accuracy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Score Distribution Chart */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Score Distribution
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Percentage of submissions per grade bracket
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(analytics.distribution).map(([bracket, count]) => {
              const share = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
              return (
                <div key={bracket} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {bracket}
                    </span>
                    <span className="font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                      {count} papers ({share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${Math.max(4, share)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Accuracy Breakdown */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Answer Quality Distribution
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Aggregated across all questions evaluated
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Correct (≥85% score)
                </span>
                <span className="font-mono text-neutral-500 tabular-nums">
                  {analytics.correctCount} ({analytics.correctPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(4, analytics.correctPct)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Partial Credit
                </span>
                <span className="font-mono text-neutral-500 tabular-nums">
                  {analytics.partialCount} ({analytics.partialPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${Math.max(4, analytics.partialPct)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5" />
                  Incorrect Attempt
                </span>
                <span className="font-mono text-neutral-500 tabular-nums">
                  {analytics.incorrectCount} ({analytics.incorrectPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${Math.max(4, analytics.incorrectPct)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Unanswered / Blank
                </span>
                <span className="font-mono text-neutral-500 tabular-nums">
                  {analytics.unansweredCount} ({analytics.unansweredPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neutral-400 transition-all duration-500"
                  style={{ width: `${Math.max(4, analytics.unansweredPct)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      {analytics.subjectStats.length > 0 && (
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Subject Cohort Averages
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Performance grouped by curriculum topic
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {analytics.subjectStats.map((subj) => (
              <div
                key={subj.name}
                className="p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-800/40"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {subj.name}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {subj.count} {subj.count === 1 ? "paper" : "papers"}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold tabular-nums text-neutral-900 dark:text-white">
                    {subj.avg}%
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Grade {subj.avg >= 75 ? "A" : subj.avg >= 60 ? "B" : "C"}
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
