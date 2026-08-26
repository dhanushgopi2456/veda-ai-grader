"use client";

import { useMemo, useState } from "react";
import type { AnswerExtraction, EvaluationResult } from "@/lib/types";
import QuestionCard from "./QuestionCard";
import SheetViewer from "./SheetViewer";
import {
  AlertIcon,
  ClipboardIcon,
  SparklesIcon,
  TargetIcon,
} from "./Icons";

type Props = {
  result: EvaluationResult;
  onNewEvaluation: () => void;
  onRemap: (questionId: string, answerId: string | null) => void;
  onAssignUnmatched: (answerId: string, questionId: string | null) => void;
  regrouping: boolean;
  notice?: string | null;
};

function gradeColor(letter: string): string {
  if (letter.startsWith("A")) return "bg-green-100 text-green-700";
  if (letter === "B") return "bg-lime-100 text-lime-700";
  if (letter === "C") return "bg-amber-100 text-amber-700";
  if (letter === "D") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function ResultsView({
  result,
  onNewEvaluation,
  onRemap,
  onAssignUnmatched,
  regrouping,
  notice,
}: Props) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [mobileTab, setMobileTab] = useState<"questions" | "sheet">("questions");

  const stats = useMemo(() => {
    const matched = result.results.filter((r) => r.status === "matched").length;
    const unanswered = result.results.filter((r) => r.status === "unanswered").length;
    const correct = result.results.filter((r) => r.grading?.verdict === "correct").length;
    const partial = result.results.filter((r) => r.grading?.verdict === "partial").length;
    const incorrect = result.results.filter((r) => r.grading?.verdict === "incorrect").length;
    return { matched, unanswered, correct, partial, incorrect };
  }, [result.results]);

  const pct = result.overall && result.overall.totalMax > 0
    ? Math.round((result.overall.totalAwarded / result.overall.totalMax) * 100)
    : 0;

  function selectAnswer(answerId: string | null) {
    setSelectedAnswerId(answerId);
    if (answerId) setMobileTab("sheet");
  }

  function selectQuestion(questionId: string) {
    const r = result.results.find((x) => x.question.id === questionId);
    selectAnswer(r?.answerId ?? null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-neutral-200 bg-white px-4 py-2.5 lg:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold text-neutral-900">
            {result.examTitle || "Answer paper evaluation"}
          </h1>
          <p className="text-[11px] text-neutral-400">
            {result.questions.length} questions · {result.answers.length} answers found ·{" "}
            {stats.unanswered} unanswered · {result.unmatched.length} unmatched
          </p>
        </div>
        {regrouping && (
          <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-medium text-accent">
            <SparklesIcon className="h-3 w-3 animate-spin" />
            Regrading…
          </span>
        )}
        <button
          onClick={() => setShowInsights((v) => !v)}
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
        >
          {showInsights ? "Hide insights" : "AI insights"}
        </button>
        <button
          onClick={onNewEvaluation}
          className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          New evaluation
        </button>
      </div>

      {notice && (
        <div className="anim-fade-up shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 lg:px-6">
          {notice}
        </div>
      )}

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(380px,44%)_1fr]">
        <div
          className={`min-h-0 overflow-y-auto border-neutral-200 p-4 lg:block lg:border-r ${
            mobileTab === "questions" ? "block" : "hidden"
          }`}
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                  <SparklesIcon className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    VedaAI graded this answer paper
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Review the AI feedback for each question below
                  </p>
                </div>
              </div>
              {result.overall && (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                    {result.overall.totalAwarded}
                    <span className="text-sm font-semibold text-neutral-400">
                      /{result.overall.totalMax}
                    </span>
                  </span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold ${gradeColor(result.overall.gradeLetter)}`}
                  >
                    {result.overall.gradeLetter}
                  </span>
                </div>
              )}
            </div>
            {result.overall && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium">
              <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">
                {stats.correct} correct
              </span>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                {stats.partial} partial
              </span>
              <span className="rounded-full bg-red-50 px-2 py-1 text-red-700">
                {stats.incorrect} incorrect
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-500">
                {stats.unanswered} not answered
              </span>
            </div>

            {showInsights && result.overall && (
              <div className="anim-fade-up mt-4 space-y-3 rounded-xl bg-neutral-50 p-3">
                {result.overall.summary && (
                  <p className="text-xs leading-relaxed text-neutral-600">
                    {result.overall.summary}
                  </p>
                )}
                {result.overall.strengths.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">
                      Strengths
                    </p>
                    <ul className="mt-1 space-y-1">
                      {result.overall.strengths.map((s, i) => (
                        <li key={i} className="flex gap-1.5 text-xs text-neutral-600">
                          <span className="text-green-600">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.overall.improvements.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-accent">
                      Improve
                    </p>
                    <ul className="mt-1 space-y-1">
                      {result.overall.improvements.map((s, i) => (
                        <li key={i} className="flex gap-1.5 text-xs text-neutral-600">
                          <span className="text-accent">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
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
          </div>

          {result.unmatched.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2 px-1">
                <AlertIcon className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Answers without a question
                </h3>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  {result.unmatched.length}
                </span>
              </div>
              <p className="mb-3 px-1 text-[11px] text-neutral-400">
                These blocks on the answer sheet do not match any question. Link them manually or
                ignore them.
              </p>
              <div className="space-y-3">
                {result.unmatched.map((a: AnswerExtraction) => (
                  <div
                    key={a.id}
                    className={`rounded-2xl border bg-white p-4 transition-all ${
                      selectedAnswerId === a.id
                        ? "border-amber-400 ring-2 ring-amber-400/30"
                        : "border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                        {a.rawLabel || "No label"}
                      </span>
                      <button
                        onClick={() => selectAnswer(selectedAnswerId === a.id ? null : a.id)}
                        className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100"
                      >
                        <TargetIcon className="h-3 w-3" />
                        {selectedAnswerId === a.id ? "Hide" : "Locate"}
                      </button>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-600">
                      {a.transcription || "[no text transcribed]"}
                    </p>
                    <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[11px] text-neutral-400">This answers:</span>
                      <select
                        value=""
                        onChange={(e) => onAssignUnmatched(a.id, e.target.value || null)}
                        className="max-w-[220px] flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700 outline-none focus:border-accent"
                      >
                        <option value="">— Pick a question —</option>
                        {result.results.map((r) => (
                          <option key={r.question.id} value={r.question.id}>
                            {r.question.label} — {r.question.text.slice(0, 36)}…
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>

        <div className={`min-h-0 ${mobileTab === "sheet" ? "block" : "hidden"} lg:block`}>
          <SheetViewer
            result={result}
            selectedAnswerId={selectedAnswerId}
            onSelectAnswer={(id) => {
              setSelectedAnswerId(id);
              if (id) setMobileTab("questions");
            }}
          />
        </div>
      </div>

      <div className="flex h-14 shrink-0 items-stretch border-t border-neutral-200 bg-white lg:hidden">
        {(["questions", "sheet"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-medium ${
              mobileTab === tab ? "text-accent" : "text-neutral-400"
            }`}
          >
            {tab === "questions" ? (
              <ClipboardIcon className="h-4 w-4" />
            ) : (
              <TargetIcon className="h-4 w-4" />
            )}
            {tab === "questions" ? "Questions" : "Answer sheet"}
            {tab === "questions" && selectedAnswerId && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
