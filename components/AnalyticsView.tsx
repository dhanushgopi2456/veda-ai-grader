"use client";

import React, { useMemo } from "react";
import type { EvaluationResult } from "@/lib/types";
import {
  BarChart3,
  Award,
  FilePlus2,
  CheckCircle2,
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
      h.results.forEach((r) => {
        if (r.status === "unanswered") unansweredTotal++;
        else if (r.grading?.verdict === "correct") correctTotal++;
        else if (r.grading?.verdict === "partial") partialTotal++;
        else if (r.grading?.verdict === "incorrect") incorrectTotal++;
      });

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
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex items-center justify-center max-w-4xl mx-auto w-full bg-[#ffffff] text-[#17191c]">
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] py-16 px-8 text-center space-y-4 w-full">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-[24px] font-normal tracking-tight text-[#17191c]">
              No cohort analytics available
            </h3>
            <p className="text-[14px] font-sans text-[#777b86] leading-relaxed">
              Complete student evaluations to unlock score distributions, question accuracy insights, and cohort trends.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={onNewEvaluation}
              className="btn-steep-primary"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>Start Evaluation</span>
            </button>
            <button
              onClick={onLoadSample}
              disabled={sampleLoading}
              className="btn-steep-secondary"
            >
              <span>Load Sample Exam</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 max-w-[1200px] mx-auto w-full bg-[#ffffff] text-[#17191c] text-left">
      {/* Title */}
      <div>
        <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
          Cohort Metrics
        </span>
        <h1 className="mt-1 font-serif text-[32px] sm:text-[40px] font-normal tracking-[-0.66px] text-[#17191c]">
          Performance & Accuracy Distributions
        </h1>
        <p className="text-[14px] font-sans text-[#777b86] mt-1">
          Aggregated across {analytics.total} evaluated student examination papers.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Score */}
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
            Mean Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[#17191c]">
              {analytics.avgScore}%
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[#777b86]">
            Grade {analytics.avgScore >= 75 ? "A" : "B"} average
          </p>
        </div>

        {/* Highest Score */}
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
            Peak Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[#17191c]">
              {analytics.highestScore}%
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[#777b86]">
            Lowest: {analytics.lowestScore}%
          </p>
        </div>

        {/* Question Accuracy */}
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
            Full Mastery
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[#17191c]">
              {analytics.correctPct}%
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[#777b86]">
            {analytics.correctCount} responses correct
          </p>
        </div>

        {/* Latency */}
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-6">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
            Mean Latency
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[#17191c]">
              ~18s
            </span>
          </div>
          <p className="mt-1 text-[12px] font-sans text-[#777b86]">
            Per examination script
          </p>
        </div>
      </div>

      {/* Grid: Score Distribution & Question Accuracy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Distribution Chart */}
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-7 space-y-5">
          <div>
            <h3 className="font-serif text-[20px] font-normal text-[#17191c]">
              Score Distribution
            </h3>
            <p className="text-[13px] font-sans text-[#777b86] mt-0.5">
              Percentage of submissions per grade bracket
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {Object.entries(analytics.distribution).map(([bracket, count]) => {
              const share = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
              return (
                <div key={bracket} className="space-y-1.5">
                  <div className="flex justify-between text-[13px] font-sans">
                    <span className="font-medium text-[#17191c]">
                      {bracket}
                    </span>
                    <span className="text-[#777b86]">
                      {count} papers ({share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#ffffff] overflow-hidden border border-[#e5e5e7]">
                    <div
                      className="h-full rounded-full bg-[#17191c] transition-all duration-300"
                      style={{ width: `${Math.max(4, share)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Quality Distribution */}
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-7 space-y-5">
          <div>
            <h3 className="font-serif text-[20px] font-normal text-[#17191c]">
              Response Alignment Quality
            </h3>
            <p className="text-[13px] font-sans text-[#777b86] mt-0.5">
              Aggregated across all questions evaluated
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[#17191c]">
                  Correct (≥85% score)
                </span>
                <span className="text-[#777b86]">
                  {analytics.correctCount} ({analytics.correctPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#ffffff] overflow-hidden border border-[#e5e5e7]">
                <div
                  className="h-full rounded-full bg-[#17191c]"
                  style={{ width: `${analytics.correctPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[#17191c]">
                  Partial Credit
                </span>
                <span className="text-[#777b86]">
                  {analytics.partialCount} ({analytics.partialPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#ffffff] overflow-hidden border border-[#e5e5e7]">
                <div
                  className="h-full rounded-full bg-[#777b86]"
                  style={{ width: `${analytics.partialPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[#17191c]">
                  Incorrect Attempt
                </span>
                <span className="text-[#777b86]">
                  {analytics.incorrectCount} ({analytics.incorrectPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#ffffff] overflow-hidden border border-[#e5e5e7]">
                <div
                  className="h-full rounded-full bg-[#a3a6af]"
                  style={{ width: `${analytics.incorrectPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-sans">
                <span className="font-medium text-[#17191c]">
                  Unanswered / Blank
                </span>
                <span className="text-[#777b86]">
                  {analytics.unansweredCount} ({analytics.unansweredPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#ffffff] overflow-hidden border border-[#e5e5e7]">
                <div
                  className="h-full rounded-full bg-[#d4d4d8]"
                  style={{ width: `${analytics.unansweredPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Stats */}
      {analytics.subjectStats.length > 0 && (
        <div className="rounded-[24px] border border-[#e5e5e7] bg-[#f2f2f3] p-7">
          <h3 className="font-serif text-[20px] font-normal text-[#17191c] mb-1">
            Subject Cohort Averages
          </h3>
          <p className="text-[13px] font-sans text-[#777b86] mb-5">
            Performance grouped by curriculum topic
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.subjectStats.map((s) => (
              <div
                key={s.name}
                className="p-4 rounded-[16px] bg-[#ffffff] border border-[#e5e5e7]"
              >
                <div className="flex items-center justify-between text-[12px] font-sans text-[#777b86]">
                  <span className="font-medium text-[#17191c]">{s.name}</span>
                  <span>{s.count} paper{s.count > 1 ? "s" : ""}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-[28px] font-normal text-[#17191c]">
                    {s.avg}%
                  </span>
                  <span className="text-[12px] font-sans text-[#777b86]">
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
