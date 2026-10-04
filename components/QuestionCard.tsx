"use client";

import React, { useState } from "react";
import type { AnswerExtraction, QuestionResult } from "@/lib/types";
import {
  ChevronDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  FileText,
  Link2,
} from "lucide-react";

type Props = {
  result: QuestionResult;
  answers: AnswerExtraction[];
  unmatchedAnswers: AnswerExtraction[];
  selected: boolean;
  onSelect: () => void;
  onRemap: (questionId: string, answerId: string | null) => void;
};

const VERDICT_CONFIG = {
  correct: {
    label: "Correct",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  partial: {
    label: "Partially Correct",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    icon: HelpCircle,
    iconColor: "text-amber-500",
  },
  incorrect: {
    label: "Incorrect",
    badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    icon: XCircle,
    iconColor: "text-rose-500",
  },
  unanswered: {
    label: "Not Attempted",
    badge: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
    icon: AlertTriangle,
    iconColor: "text-neutral-400",
  },
};

export default function QuestionCard({
  result,
  answers,
  unmatchedAnswers,
  selected,
  onSelect,
  onRemap,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { question, status, lowConfidence } = result;
  const answer = result.answerId ? answers.find((a) => a.id === result.answerId) : undefined;

  const verdictKey =
    status === "unanswered"
      ? "unanswered"
      : result.grading?.verdict || "partial";

  const verdictMeta = VERDICT_CONFIG[verdictKey] || VERDICT_CONFIG.partial;
  const VerdictIcon = verdictMeta.icon;

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer p-4.5 bg-white dark:bg-neutral-900 ${
        selected
          ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md dark:border-orange-500"
          : "border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs dark:border-neutral-800 dark:hover:border-neutral-700"
      }`}
    >
      {/* Question Header & Verdict */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="shrink-0 flex h-7 items-center justify-center rounded-lg bg-neutral-900 px-2.5 text-xs font-bold text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
            {question.label}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-xs sm:text-sm font-medium leading-relaxed text-neutral-900 dark:text-neutral-100 ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {question.text}
              {question.altText && (
                <span className="text-neutral-400 italic"> (OR: {question.altText})</span>
              )}
            </p>

            {question.text.length > 100 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
                className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                <span>{expanded ? "Show less" : "Show full question"}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Score & Verdict Badge */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            {result.grading ? (
              <span className="text-sm font-bold tabular-nums text-neutral-900 dark:text-white">
                {result.grading.marksAwarded}
                <span className="text-xs font-normal text-neutral-400">
                  /{result.grading.marksTotal}
                </span>
              </span>
            ) : (
              <span className="text-xs text-neutral-400 tabular-nums">
                —/{question.marks ?? 5}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${verdictMeta.badge}`}
            >
              <VerdictIcon className={`h-3 w-3 ${verdictMeta.iconColor}`} />
              <span>{verdictMeta.label}</span>
            </span>
          </div>

          {lowConfidence && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              Uncertain label
            </span>
          )}
        </div>
      </div>

      {/* Student Handwriting Transcription Block */}
      {answer && (
        <div className="mt-3.5 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800/80 dark:bg-neutral-800/40">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              Handwritten Answer Transcription
            </span>
            <span className="text-[10px] font-normal text-neutral-400">
              Label detected: &quot;{answer.rawLabel}&quot;
            </span>
          </div>
          <p className="text-xs font-mono leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {answer.transcription || "[No handwritten text detected for this region]"}
          </p>
        </div>
      )}

      {/* AI Rubric Feedback Block */}
      {result.grading?.feedback && (
        <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3.5 dark:border-orange-950/60 dark:bg-orange-950/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-900 dark:text-orange-300 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span>Examiner Evaluation &amp; Feedback</span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            {result.grading.feedback}
          </p>
        </div>
      )}

      {/* Manual Remapping Bar */}
      <div
        className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Link2 className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Linked answer:
          </span>
          <select
            value={result.answerId ?? ""}
            onChange={(e) => onRemap(question.id, e.target.value || null)}
            aria-label="See answer options to link"
            title="See answer options to link to this question"
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-800 outline-none transition-colors focus:border-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 max-w-[240px] truncate"
          >
            <option value="">— Not answered / Unlink —</option>
            {answers.map((a) => {
              const isCurrent = a.id === result.answerId;
              const isUnmatched = unmatchedAnswers.some((u) => u.id === a.id);
              const preview = a.transcription
                ? `"${a.transcription.slice(0, 24).trim()}…"`
                : "[No text]";
              return (
                <option key={a.id} value={a.id}>
                  {isCurrent
                    ? `✓ Current: ${a.rawLabel || "Ans"} (${preview})`
                    : isUnmatched
                      ? `+ Unlinked: ${a.rawLabel || "Ans"} (${preview})`
                      : `⇄ Switch to: ${a.rawLabel || "Ans"} (${preview})`}
                </option>
              );
            })}
          </select>
        </div>

        <span className="text-[11px] text-orange-500 font-medium hover:underline">
          {selected ? "Highlighted on sheet →" : "Click to view on sheet →"}
        </span>
      </div>
    </div>
  );
}
