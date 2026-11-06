"use client";

import { useState } from "react";
import { Check, CheckCircle2, Sparkles, Layers, Sliders, Scan, Eye, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LiveScanPreview() {
  const [selectedQuestion, setSelectedQuestion] = useState<"all" | "q1" | "q2">("all");
  const [viewMode, setViewMode] = useState<"scan" | "heatmap" | "rubric">("scan");

  // Dynamic score based on selected question
  const scoreData = {
    all: { score: "8.5", max: "9.0", pct: "94.4%", grade: "Grade A", barWidth: "94.4%" },
    q1: { score: "5.0", max: "5.0", pct: "100%", grade: "Full Marks", barWidth: "100%" },
    q2: { score: "3.5", max: "4.0", pct: "87.5%", grade: "Partial Credit", barWidth: "87.5%" },
  }[selectedQuestion];

  return (
    <div className="relative mx-auto w-full max-w-[1040px] select-none">
      {/* Floating Product Artifact Card - Elevated according to Steep Rules */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-[24px] bg-[var(--canvas)]/95 backdrop-blur-2xl p-5 sm:p-7 shadow-steep-artifact border border-[var(--border)] text-left relative overflow-hidden transition-colors"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl dark:from-cyan-400/15 dark:via-purple-500/15" />

        {/* Top Artifact Chrome Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-[17px] font-normal text-[var(--ink)]">
              Interactive Assessment Inspector
            </span>
            <span className="rounded-full bg-[var(--mist)] px-2.5 py-0.5 text-[11px] font-sans font-medium text-[var(--slate)] border border-[var(--border)]">
              Artifact v2.4
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-[var(--mist)] p-1 border border-[var(--border)] text-[11px] font-sans">
              <button
                onClick={() => setViewMode("scan")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === "scan"
                    ? "bg-[var(--canvas)] text-[var(--ink)] font-medium shadow-xs"
                    : "text-[var(--slate)] hover:text-[var(--ink)]"
                }`}
              >
                <Scan className="h-3 w-3" />
                <span>Live Scan</span>
              </button>
              <button
                onClick={() => setViewMode("heatmap")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === "heatmap"
                    ? "bg-[var(--canvas)] text-[var(--ink)] font-medium shadow-xs"
                    : "text-[var(--slate)] hover:text-[var(--ink)]"
                }`}
              >
                <Eye className="h-3 w-3" />
                <span>OCR Bounding</span>
              </button>
            </div>

            {/* Inference Badge with Living Status Pulse */}
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mist)] px-3 py-1 text-[12px] font-sans text-[var(--ink)] border border-[var(--border)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Inference Ready · Gemini 2.5</span>
            </span>
          </div>
        </div>

        {/* Content Layout: Paper View + Editorial Evaluation Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Simulated Handwritten Exam Sheet Container (7 cols) */}
          <div className="relative rounded-[18px] bg-[var(--mist)] p-5 sm:p-6 lg:col-span-7 border border-[var(--border)] overflow-hidden transition-colors">
            {/* AI Scanning Laser Line */}
            <motion.div
              animate={{
                top: ["0%", "98%", "0%"],
              }}
              transition={{
                duration: 5.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_rgba(6,182,212,0.9)] z-20 opacity-80"
            />

            {/* Exam Header */}
            <div className="border-b border-[var(--border)] pb-3">
              <div className="flex justify-between text-[11px] font-sans text-[var(--slate)]">
                <span>AP PHYSICS & DIFFERENTIAL CALCULUS</span>
                <span className="text-[var(--ink)] font-medium">STUDENT ID: #8921</span>
              </div>
              <h4 className="mt-1 font-serif text-[16px] font-normal text-[var(--ink)] flex items-center justify-between">
                <span>Section B: Harmonic Motion & Boundary Velocity</span>
                <span className="text-[11px] font-sans text-[var(--ash)]">Click item to inspect</span>
              </h4>
            </div>

            {/* Question 1 Block */}
            <motion.div
              onClick={() => setSelectedQuestion((q) => (q === "q1" ? "all" : "q1"))}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`mt-4 rounded-[14px] p-3.5 transition-all cursor-pointer border ${
                selectedQuestion === "q1"
                  ? "bg-[var(--canvas)] border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40"
                  : "bg-[var(--canvas)]/70 hover:bg-[var(--canvas)] border-[var(--border)]"
              }`}
            >
              <div className="flex items-center justify-between text-[12px] font-sans text-[var(--slate)]">
                <span className="text-[var(--ink)] font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  Q1. Derive boundary velocity equation v(t):
                </span>
                <span className="rounded-full bg-[var(--mist)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink)] border border-[var(--border)]">
                  5.0 / 5.0 Marks
                </span>
              </div>

              {/* Mapped Handwriting Area */}
              <div className="mt-2.5 rounded-[12px] bg-[var(--mist)]/80 p-4 border border-[var(--border)] relative overflow-hidden">
                {/* Simulated Heatmap Bounding Box Overlay */}
                {viewMode === "heatmap" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-2 border-2 border-dashed border-emerald-500/60 bg-emerald-500/5 rounded-lg pointer-events-none flex items-start justify-end p-1.5"
                  >
                    <span className="text-[10px] font-mono bg-emerald-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                      IOU: 0.994 [High Confidence]
                    </span>
                  </motion.div>
                )}

                <div className="mb-2 flex items-center justify-between text-[11px] font-sans text-[var(--slate)]">
                  <span className="rounded-full bg-[var(--canvas)] px-2 py-0.5 text-[10px] text-[var(--ink)] font-medium border border-[var(--border)]">
                    Mapped · 99.4% OCR Confidence
                  </span>
                  <span>Handwritten Ingestion</span>
                </div>

                <p className="font-serif italic text-[14px] text-[var(--ink)] leading-relaxed select-text">
                  x(t) = A · e^(-γt) · cos(ωt + φ)
                  <br />
                  v(t) = dx/dt = -γ A e^(-γt) cos(ωt + φ) - ω A e^(-γt) sin(ωt + φ)
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[12px] font-sans text-[var(--ink)] pt-2 border-t border-[var(--border)]">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Full criteria met: chain rule derivative correctly applied.</span>
                </div>
              </div>
            </motion.div>

            {/* Question 2 Block (Out-of-Order Mapping Demonstration) */}
            <motion.div
              onClick={() => setSelectedQuestion((q) => (q === "q2" ? "all" : "q2"))}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`mt-4 rounded-[14px] p-3.5 transition-all cursor-pointer border ${
                selectedQuestion === "q2"
                  ? "bg-[var(--canvas)] border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40"
                  : "bg-[var(--canvas)]/70 hover:bg-[var(--canvas)] border-[var(--border)]"
              }`}
            >
              <div className="flex items-center justify-between text-[12px] font-sans text-[var(--slate)]">
                <span className="text-[var(--ink)] font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Q2. Calculate resonance damping factor Q:
                </span>
                <span className="rounded-full bg-[var(--mist)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink)] border border-[var(--border)]">
                  3.5 / 4.0 Marks
                </span>
              </div>

              <div className="mt-2.5 rounded-[12px] bg-[var(--mist)]/80 p-4 border border-[var(--border)] relative overflow-hidden">
                {/* Simulated Heatmap Bounding Box Overlay */}
                {viewMode === "heatmap" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-2 border-2 border-dashed border-amber-500/60 bg-amber-500/5 rounded-lg pointer-events-none flex items-start justify-end p-1.5"
                  >
                    <span className="text-[10px] font-mono bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                      IOU: 0.988 [Aligned Out-of-Order]
                    </span>
                  </motion.div>
                )}

                <div className="mb-2 flex items-center justify-between text-[11px] font-sans text-[var(--slate)]">
                  <span className="rounded-full bg-[var(--canvas)] px-2 py-0.5 text-[10px] text-[var(--ink)] font-medium border border-[var(--border)]">
                    Out-of-Order Answer Aligned
                  </span>
                  <span>Sequence Resolved</span>
                </div>

                <p className="font-serif italic text-[14px] text-[var(--ink)] leading-relaxed select-text">
                  Q = ω₀ / (2γ) = (14.2 rad/s) / (2 × 0.85 s⁻¹) = 8.35
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[12px] font-sans text-[var(--slate)] pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--ink)] font-medium">Step deduction:</span> Correct formula (+3.0), dimensionless unit omission (-0.5).
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Grade Summary (5 cols) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {/* Score Metric Card */}
            <motion.div
              key={selectedQuestion}
              initial={{ scale: 0.98, opacity: 0.85 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-[18px] bg-[var(--mist)] p-5 sm:p-6 border border-[var(--border)] relative overflow-hidden transition-colors"
            >
              <div className="flex items-center justify-between text-[12px] font-sans text-[var(--slate)]">
                <span className="uppercase tracking-wider text-[11px] font-medium text-[var(--ash)]">
                  {selectedQuestion === "all" ? "TOTAL SCORE" : `SECTION ${selectedQuestion.toUpperCase()} SCORE`}
                </span>
                <span className="rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--canvas)]">
                  {scoreData.grade}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-[46px] font-normal tracking-[-0.66px] text-[var(--ink)]">
                  {scoreData.score}
                </span>
                <span className="text-[15px] font-sans text-[var(--slate)]">/ {scoreData.max} points</span>
                <span className="ml-auto text-[15px] font-sans font-medium text-emerald-500">
                  {scoreData.pct}
                </span>
              </div>

              {/* Dynamic Animated Progress Bar */}
              <div className="mt-3 h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: scoreData.barWidth }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full"
                />
              </div>

              <p className="mt-3 text-[12px] font-sans text-[var(--slate)] leading-normal">
                {selectedQuestion === "all"
                  ? "Scored using institutional standard physics rubric with automated criterion-level breakdown."
                  : selectedQuestion === "q1"
                  ? "Question 1 scored full marks for rigorous analytical differentiation and correct boundary conditions."
                  : "Question 2 penalized -0.5 for omitting dimensionless qualification on final damping quotient."}
              </p>
            </motion.div>

            {/* Pipeline Step Metadata (Audited Verification Trail) */}
            <div className="rounded-[18px] bg-[var(--mist)] p-5 border border-[var(--border)] space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
                  Audited Verification Trail
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2 text-[13px] font-sans">
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`flex items-center justify-between py-1.5 border-b border-[var(--border)] rounded px-1 transition-colors ${
                    selectedQuestion === "q1" ? "bg-[var(--canvas)]" : ""
                  }`}
                >
                  <span className="text-[var(--slate)]">Handwriting OCR</span>
                  <span className="text-[var(--ink)] font-medium">99.4% precision</span>
                </motion.div>

                <motion.div
                  whileHover={{ x: 3 }}
                  className={`flex items-center justify-between py-1.5 border-b border-[var(--border)] rounded px-1 transition-colors ${
                    selectedQuestion === "q2" ? "bg-[var(--canvas)]" : ""
                  }`}
                >
                  <span className="text-[var(--slate)]">Question Alignment</span>
                  <span className="text-[var(--ink)] font-medium">Out-of-order resolved</span>
                </motion.div>

                <motion.div
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between py-1.5 rounded px-1 transition-colors"
                >
                  <span className="text-[var(--slate)]">Rubric Verification</span>
                  <span className="text-[var(--ink)] font-medium">Deterministic criteria</span>
                </motion.div>
              </div>
            </div>

            {/* Editorial Evaluator Commentary */}
            <div className="rounded-[18px] bg-[var(--canvas)] p-4 sm:p-5 border border-[var(--border)] transition-colors">
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--ash)] block mb-1.5">
                Evaluator Feedback Note
              </span>
              <p className="font-serif italic text-[13px] text-[var(--slate)] leading-relaxed select-text">
                &ldquo;Clear mathematical expression. In Question 2, the dimensionless quality factor ratio was correctly derived; unit omission flagged per schema rule 4.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
