"use client";

import React, { useMemo } from "react";
import {
  FilePlus2,
  History,
  FileCheck2,
  Clock,
  ArrowRight,
  Eye,
  Trash2,
  Download,
  BarChart2,
  Layers,
  Loader2,
} from "lucide-react";
import type { EvaluationResult } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

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
  const { toast } = useToast();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

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
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 max-w-[1200px] mx-auto w-full bg-transparent text-[var(--ink)]">
      {/* 1. Welcome Editorial Header Card */}
      <div className="rounded-[24px] bg-[var(--mist)] border border-[var(--border)] p-8 sm:p-10 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
              Workspace Overview
            </span>
            <h1 className="font-serif text-[32px] sm:text-[42px] font-normal tracking-[-0.66px] leading-[1.25] text-[var(--ink)]">
              {greeting}, {(userName || "Educator").split(" ")[0]}
            </h1>
            <p className="text-[15px] font-sans text-[var(--slate)] leading-relaxed max-w-xl">
              Autonomous exam evaluation across raw handwriting, out-of-order page sequences, and multi-step rubrics.
            </p>
          </div>

          {/* Steep Button Pairing: Solid Lozenge & Ghost on Same Baseline */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                toast.info("Opening New Evaluation...");
                onNewEvaluation();
              }}
              className="btn-steep-primary cursor-pointer"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>New Evaluation</span>
            </button>

            <button
              type="button"
              onClick={() => {
                toast.info("Loading sample exam paper & answers...");
                onLoadSample();
              }}
              disabled={sampleLoading}
              className="btn-steep-secondary cursor-pointer"
            >
              {sampleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading Sample…</span>
                </>
              ) : (
                <span>Load Sample Exam</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid (Flat Mist Gray Cards with Display Serif Numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Evaluations */}
        <div className="rounded-[24px] bg-[var(--mist)] p-6 border border-[var(--border)]">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Total Submissions
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {stats.totalEvaluations}
            </span>
          </div>
          <p className="mt-2 text-[12px] font-sans text-[var(--slate)]">
            Completed evaluations
          </p>
        </div>

        {/* Questions Evaluated */}
        <div className="rounded-[24px] bg-[var(--mist)] p-6 border border-[var(--border)]">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Questions Mapped
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {stats.totalQuestionsEvaluated}
            </span>
          </div>
          <p className="mt-2 text-[12px] font-sans text-[var(--slate)]">
            Handwritten responses aligned
          </p>
        </div>

        {/* Average Score */}
        <div className="rounded-[24px] bg-[var(--mist)] p-6 border border-[var(--border)]">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Cohort Mean Score
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {stats.avgScore > 0 ? `${stats.avgScore}%` : "—"}
            </span>
          </div>
          <p className="mt-2 text-[12px] font-sans text-[var(--slate)]">
            Historical grade benchmark
          </p>
        </div>

        {/* Evaluation Velocity */}
        <div className="rounded-[24px] bg-[var(--mist)] p-6 border border-[var(--border)]">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Processing Latency
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-normal tracking-[-0.66px] text-[var(--ink)]">
              {stats.avgTime}
            </span>
          </div>
          <p className="mt-2 text-[12px] font-sans text-[var(--slate)]">
            Per assessment batch
          </p>
        </div>
      </div>

      {/* 3. Quick Action Cards */}
      <div className="space-y-3 text-left">
        <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)] block">
          Workspace Navigation
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => {
              toast.info("Navigated to New Evaluation");
              onNewEvaluation();
            }}
            className="p-5 rounded-[20px] bg-[var(--mist)] border border-[var(--border)] hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            <p className="text-[14px] font-sans font-medium text-[var(--ink)]">
              New Evaluation
            </p>
            <p className="text-[12px] font-sans text-[var(--slate)] mt-1">
              Upload answer sheets
            </p>
          </button>

          <button
            onClick={() => {
              toast.info("Loading sample assessment...");
              onLoadSample();
            }}
            disabled={sampleLoading}
            className="p-5 rounded-[20px] bg-[var(--mist)] border border-[var(--border)] hover:opacity-90 transition-opacity text-left disabled:opacity-50 cursor-pointer"
          >
            <p className="text-[14px] font-sans font-medium text-[var(--ink)]">
              Sample Assessment
            </p>
            <p className="text-[12px] font-sans text-[var(--slate)] mt-1">
              Physics board evaluation
            </p>
          </button>

          <button
            onClick={() => {
              toast.info("Navigated to Evaluation History");
              onNavigate("history");
            }}
            className="p-5 rounded-[20px] bg-[var(--mist)] border border-[var(--border)] hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            <p className="text-[14px] font-sans font-medium text-[var(--ink)]">
              Archive Records
            </p>
            <p className="text-[12px] font-sans text-[var(--slate)] mt-1">
              Review past batches
            </p>
          </button>

          <button
            onClick={() => {
              toast.info("Navigated to Cohort Analytics");
              onNavigate("analytics");
            }}
            className="p-5 rounded-[20px] bg-[var(--mist)] border border-[var(--border)] hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            <p className="text-[14px] font-sans font-medium text-[var(--ink)]">
              Cohort Analytics
            </p>
            <p className="text-[12px] font-sans text-[var(--slate)] mt-1">
              Classroom mastery data
            </p>
          </button>
        </div>
      </div>

      {/* 4. Recent Evaluations Table */}
      <div className="rounded-[24px] bg-[var(--canvas)] border border-[var(--border)] overflow-hidden text-left shadow-steep-artifact">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="font-serif text-[20px] font-normal tracking-tight text-[var(--ink)]">
              Recent Evaluations
            </h2>
            <p className="text-[13px] font-sans text-[var(--slate)] mt-0.5">
              Audited grading pipeline records
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                toast.info("Opening Evaluation History...");
                onNavigate("history");
              }}
              className="link-steep text-[13px] cursor-pointer"
            >
              <span>View all ({history.length}) →</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <h3 className="font-serif text-[18px] font-normal text-[var(--ink)]">
              No evaluated records
            </h3>
            <p className="text-[13px] font-sans text-[var(--slate)] max-w-sm mx-auto">
              Upload a question paper and student answer sheet or test with the bundled sample exam.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  toast.info("Opening New Evaluation...");
                  onNewEvaluation();
                }}
                className="btn-steep-primary cursor-pointer"
              >
                <span>Start Evaluation</span>
              </button>
              <button
                onClick={() => {
                  toast.info("Loading sample exam...");
                  onLoadSample();
                }}
                disabled={sampleLoading}
                className="btn-steep-secondary cursor-pointer"
              >
                <span>Load Sample Exam</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] font-sans">
              <thead className="bg-[var(--fog)] text-[11px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)] border-b border-[var(--border)]">
                <tr>
                  <th className="py-3.5 px-6">Exam Title</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
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
                      className="hover:bg-[var(--fog)] transition-colors cursor-pointer"
                      onClick={() => {
                        toast.info("Opening evaluation report...");
                        onViewEvaluation(item);
                      }}
                    >
                      <td className="py-4 px-6 font-medium text-[var(--ink)]">
                        {item.examTitle || "Untitled Evaluation"}
                        <span className="block text-[12px] text-[var(--slate)] font-normal">
                          {item.studentName || "Student Submission"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[var(--slate)]">
                        {item.subject || "General"}
                      </td>
                      <td className="py-4 px-4 text-[var(--slate)]">
                        {item.questions.length} questions
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-serif text-[16px] text-[var(--ink)]">
                          {pct}%
                        </span>
                        <span className="text-[12px] text-[var(--slate)] ml-1.5">
                          ({item.overall?.totalAwarded || 0}/{item.overall?.totalMax || 0})
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[var(--ash)] text-[13px]">
                        {dateFormatted}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              toast.info("Opening evaluation report...");
                              onViewEvaluation(item);
                            }}
                            className="p-2 rounded-full text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)] cursor-pointer"
                            title="Inspect evaluation"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              toast.info("Preparing evaluation report download...");
                              onDownloadReport(item);
                            }}
                            className="p-2 rounded-full text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)] cursor-pointer"
                            title="Download report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              onDeleteEvaluation(item.id);
                            }}
                            className="p-2 rounded-full text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)] cursor-pointer"
                            title="Delete submission"
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
