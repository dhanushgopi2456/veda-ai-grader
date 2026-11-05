"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Cpu, Layers, ArrowRight } from "lucide-react";

export default function LiveScanPreview() {
  const [scanStep, setScanStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"exam" | "rubric">("exam");

  useEffect(() => {
    const timer = setInterval(() => {
      setScanStep((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-4xl select-none [perspective:1200px]">
      {/* Ambient Backlight Glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-orange-500/20 via-indigo-600/30 to-cyan-500/20 opacity-70 blur-2xl filter" />

      {/* Main Glassmorphic 3D Tilt Shell */}
      <motion.div
        initial={{ y: 20, rotateX: 6, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 p-3 shadow-2xl backdrop-blur-2xl sm:p-5"
      >
        {/* Top Browser / App Chrome Bar */}
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-slate-300">
              <Cpu className="h-3 w-3 text-cyan-400" />
              <span>veda-ocr-pipeline::v2.4 [live]</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Real-time Inference Active
            </span>
          </div>
        </div>

        {/* Content Layout: Paper View + Live Telemetry HUD */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Simulated Handwritten Exam Sheet Container (8 cols) */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/95 p-4 sm:p-6 lg:col-span-8">
            {/* Paper Texture Lines */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_27px,rgba(255,255,255,0.03)_28px)] bg-[size:100%_28px]" />

            {/* Continuous Laser Scanning Beam */}
            <div className="pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-cyan-500/0 via-cyan-400/25 to-cyan-400/0 animate-[scanBeam_4s_ease-in-out_infinite] z-20">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />
            </div>

            {/* Exam Header */}
            <div className="relative z-10 border-b border-white/10 pb-3 text-left">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>AP PHYSICS & CALCULUS EVALUATION</span>
                <span>STUDENT ID: #VEDA-8921</span>
              </div>
              <h4 className="mt-1 text-sm font-semibold text-slate-200">
                Section B: Harmonic Motion & Differential Equations
              </h4>
            </div>

            {/* Question 1 Block with Handwriting Simulation */}
            <div className="relative z-10 mt-4 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
                <span>[Q1] Derive velocity equation v(t) for damped oscillator:</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-200">5 Marks</span>
              </div>

              {/* Simulated Student Handwriting & OCR Bounding Box */}
              <div className="relative mt-2 rounded-lg border border-cyan-500/40 bg-cyan-950/20 p-3 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                {/* OCR Corner Badges */}
                <div className="absolute -top-2 left-2 flex items-center gap-1 rounded bg-cyan-600 px-1.5 py-0.2 text-[9px] font-mono text-white">
                  <span>Mapped to Q1 · Confidence: 99.4%</span>
                </div>

                <p className="font-serif italic tracking-wide text-amber-100/90 text-sm leading-relaxed">
                  x(t) = A · e^(-γt) · cos(ωt + φ)
                  <br />
                  v(t) = dx/dt = -γ A e^(-γt) cos(ωt + φ) - ω A e^(-γt) sin(ωt + φ)
                  <br />
                  <span className="text-slate-400">At t=0, v(0) matches boundary condition perfectly.</span>
                </p>

                {/* Real-time Inline Mark Overlay */}
                <div className="mt-2.5 flex items-center justify-between border-t border-cyan-500/20 pt-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Criteria Met: Chain Rule Applied (+5.0/5.0)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">Auto-Tagged #P1-A1</span>
                </div>
              </div>
            </div>

            {/* Question 2 Block (Out-of-Order Mapping Demonstration) */}
            <div className="relative z-10 mt-5 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
                <span>[Q2] Calculate resonance damping factor Q:</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-200">4 Marks</span>
              </div>

              {/* Mapped Answer Box with Step-Mark Breakdown */}
              <div className="relative mt-2 rounded-lg border border-orange-500/40 bg-orange-950/20 p-3 shadow-[0_0_20px_rgba(244,81,30,0.1)]">
                <div className="absolute -top-2 left-2 flex items-center gap-1 rounded bg-orange-600 px-1.5 py-0.2 text-[9px] font-mono text-white">
                  <span>Out-of-order handwriting mapped · 98.1% OCR</span>
                </div>

                <p className="font-serif italic tracking-wide text-amber-100/90 text-sm leading-relaxed">
                  Q = ω₀ / (2γ) = (14.2 rad/s) / (2 × 0.85 s⁻¹) = 8.35
                  <br />
                  <span className="text-rose-300 line-through">Final units: rad/s</span>{" "}
                  <span className="text-emerald-300">Dimensionless ratio.</span>
                </p>

                <div className="mt-2 flex items-center justify-between border-t border-orange-500/20 pt-2 text-xs">
                  <span className="flex items-center gap-1 text-amber-300 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                    Partial Step Mark: Correct formula (+3.0), unit slip (-0.5)
                  </span>
                  <span className="font-mono font-bold text-orange-400">3.5 / 4.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry & AI Grading Breakdown (4 cols) */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-4">
            {/* Overall Score Glass Card */}
            <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Overall Score
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  GRADE A+
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">18.5</span>
                <span className="text-sm font-medium text-slate-400">/ 20.0</span>
                <span className="ml-auto text-xs font-semibold text-emerald-400">92.5%</span>
              </div>

              {/* Mini Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-400 w-[92.5%]" />
              </div>
            </div>

            {/* AI Real-time Inspection Pipeline Stream */}
            <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-left space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                Live Pipeline Telemetry
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="text-slate-300">Answer Extraction</span>
                  <span className="font-mono text-emerald-400">3/3 Found</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="text-slate-300">Out-of-Order Match</span>
                  <span className="font-mono text-cyan-400">100% Solved</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="text-slate-300">Rubric Justification</span>
                  <span className="font-mono text-orange-400">Instant AI</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Marking Insight Card */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-3 text-left">
              <p className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                AI Grader Commentary:
              </p>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Strong theoretical grounding in Q1. In Q2, the student mislabeled units as rad/s instead of dimensionless, correctly flagged by Rubric Rule #4.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

