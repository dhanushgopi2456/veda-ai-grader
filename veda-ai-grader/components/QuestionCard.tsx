"use client";

import { useState } from "react";
import type { AnswerExtraction, QuestionResult } from "@/lib/types";
import { AlertIcon, ChevronDownIcon, SparklesIcon, TargetIcon } from "./Icons";

const VERDICT_STYLES: Record<string, string> = {
  correct: "bg-green-100 text-green-700",
  partial: "bg-amber-100 text-amber-700",
  incorrect: "bg-red-100 text-red-700",
  unanswered: "bg-neutral-100 text-neutral-500",
};

const VERDICT_LABELS: Record<string, string> = {
  correct: "Correct",
  partial: "Partial",
  incorrect: "Incorrect",
  unanswered: "Not answered",
};

type Props = {
  result: QuestionResult;
  answers: AnswerExtraction[];
  unmatchedAnswers: AnswerExtraction[];
  selected: boolean;
  onSelect: () => void;
  onRemap: (questionId: string, answerId: string | null) => void;
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

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border bg-white p-4 transition-all ${
        selected
          ? "border-accent shadow-md ring-2 ring-accent/15"
          : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex h-7 shrink-0 items-center rounded-lg bg-neutral-900 px-2 text-xs font-bold text-white">
            {question.label}
          </span>
          <p
            className={`text-sm leading-relaxed text-neutral-800 ${expanded ? "" : "line-clamp-2"}`}
          >
            {question.text}
            {question.altText ? (
              <span className="text-neutral-500"> OR {question.altText}</span>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {lowConfidence && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
              <AlertIcon className="h-3 w-3" />
              Check
            </span>
          )}
          {status === "matched" && result.grading ? (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${VERDICT_STYLES[result.grading.verdict]}`}
            >
              {result.grading.marksAwarded}/{result.grading.marksTotal}
            </span>
          ) : (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${VERDICT_STYLES[status === "unanswered" ? "unanswered" : "partial"]}`}
            >
              {status === "unanswered" ? "Not answered" : "—"}
            </span>
          )}
        </div>
      </div>

      {question.text.length > 90 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="mt-1 ml-9 flex items-center gap-0.5 text-[11px] font-medium text-neutral-400 hover:text-accent"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}

      {status === "matched" && result.grading && (
        <div className="mt-3 ml-0 rounded-xl bg-neutral-50 p-3">
          <div className="flex items-center gap-1.5">
            <SparklesIcon className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              AI Feedback
            </span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${VERDICT_STYLES[result.grading.verdict]}`}
            >
              {VERDICT_LABELS[result.grading.verdict]}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
            {result.grading.feedback}
          </p>
        </div>
      )}

      {lowConfidence && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
          <AlertIcon className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span className="text-[11px] text-amber-700">
            This match is uncertain — the answer label on the sheet was unclear.
          </span>
        </div>
      )}

      <div
        className="mt-3 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] text-neutral-400">Linked answer:</span>
        <select
          value={result.answerId ?? ""}
          onChange={(e) => onRemap(question.id, e.target.value || null)}
          className="max-w-[220px] flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700 outline-none focus:border-accent"
        >
          <option value="">— Not answered —</option>
          {result.answerId && answer && (
            <option value={result.answerId}>
              {answer.rawLabel || "(unlabelled)"} — {(answer.transcription || "").slice(0, 40)}…
            </option>
          )}
          {unmatchedAnswers.map((a) => (
            <option key={a.id} value={a.id}>
              {a.rawLabel || "(unlabelled)"} — {(a.transcription || "").slice(0, 40)}…
            </option>
          ))}
        </select>
        {result.answerId && (
          <button
            onClick={onSelect}
            className="flex items-center gap-1 rounded-lg bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent hover:bg-orange-100"
            title="Show on answer sheet"
          >
            <TargetIcon className="h-3 w-3" />
            Locate
          </button>
        )}
      </div>
    </div>
  );
}
