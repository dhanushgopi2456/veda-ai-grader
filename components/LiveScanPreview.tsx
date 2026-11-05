"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Cpu, Layers, Activity, FileText, CheckCircle, Crosshair } from "lucide-react";

export default function LiveScanPreview() {
  const [activeTab, setActiveTab] = useState<"sheet" | "rubric">("sheet");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-5xl select-none [perspective:1400px]"
    >
      {/* Ambient Multi-Layer Backlight Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-orange-500/25 via-indigo-600/35 to-cyan-500/25 opacity-75 blur-3xl filter animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-b from-orange-500/10 via-transparent to-cyan-500/10 opacity-60 blur-xl" />

      {/* Main Glassmorphic 3D Tilt Shell */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-950/85 p-3.5 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-6"
      >
        {/* Top App Chrome Bar with Live Signal Waves */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-mono text-slate-300 border border-white/5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>veda-multimodal-ocr::v3.8 [active]</span>
            </div>
          </div>

          {/* Equalizer Frequency Bars + Live Status */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 h-3.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 mr-1.5">FPS: 60</span>
              <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
              <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-3.5" />
              <span className="w-1 bg-orange-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_1.3s_ease-in-out_infinite_0.1s] h-3" />
            </div>

            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              Real-time Inference Active
            </span>
          </div>
        </div>

        {/* Content Layout: Paper View + Live Telemetry HUD */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Simulated Handwritten Exam Sheet Container (8 cols) */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c1222]/95 p-4 sm:p-6 lg:col-span-8 shadow-inner">
            {/* Paper Lined Texture Background */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_27px,rgba(255,255,255,0.035)_28px)] bg-[size:100%_28px]" />

            {/* Continuous High-Tech Laser Scanning Beam with Neon Glint */}
            <div className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-cyan-500/0 via-cyan-400/25 to-cyan-400/0 animate-[scanBeam_3.8s_cubic-bezier(0.4,0,0.2,1)_infinite] z-20">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#22d3ee,0_0_35px_#38bdf8]" />
              <div className="absolute right-12 top-0 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
            </div>

            {/* Exam Header */}
            <div className="relative z-10 border-b border-white/10 pb-3 text-left">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  AP PHYSICS & DIFFERENTIAL CALCULUS EVALUATION
                </span>
                <span className="text-orange-400 font-semibold">STUDENT ID: #VEDA-8921</span>
              </div>
              <h4 className="mt-1 text-sm font-semibold text-slate-200">
                Section B: Harmonic Motion, Damping Ratios & Boundary Velocity
              </h4>
            </div>

            {/* Question 1 Block with Handwriting Simulation */}
            <div className="relative z-10 mt-4 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
                <span>[Q1] Derive velocity equation v(t) for damped oscillator:</span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-200 border border-indigo-500/30">
                  5 Marks
                </span>
              </div>

              {/* Simulated Student Handwriting & OCR Bounding Box */}
              <div className="relative mt-2 rounded-lg border border-cyan-500/40 bg-cyan-950/25 p-3.5 transition-all duration-300 shadow-[0_0_25px_rgba(34,211,238,0.12)]">
                {/* OCR Corner Badges */}
                <div className="absolute -top-2.5 left-2.5 flex items-center gap-1 rounded bg-cyan-600 px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow-sm">
                  <Crosshair className="h-3 w-3" />
                  <span>Mapped to Q1 · Confidence: 99.4%</span>
                </div>

                <p className="font-serif italic tracking-wide text-amber-100 text-sm leading-relaxed pt-1">
                  x(t) = A · e^(-γt) · cos(ωt + φ)
                  <br />
                  v(t) = dx/dt = -γ A e^(-γt) cos(ωt + φ) - ω A e^(-γt) sin(ωt + φ)
                  <br />
                  <span className="text-slate-300 text-xs">At t=0, boundary condition matches initial release velocity.</span>
                </p>

                {/* Real-time Inline Mark Overlay */}
                <div className="mt-2.5 flex items-center justify-between border-t border-cyan-500/20 pt-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Criteria Met: Chain Rule Applied (+5.0/5.0)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">Auto-Tagged #P1-A1</span>
                </div>
              </div>
            </div>

            {/* Question 2 Block (Demonstrating Out-of-Order Mapping) */}
            <div className="relative z-10 mt-5 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
                <span>[Q2] Calculate resonance quality factor Q:</span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-200 border border-indigo-500/30">
                  4 Marks
                </span>
              </div>

              {/* Mapped Answer Box with Step-Mark Breakdown */}
              <div className="relative mt-2 rounded-lg border border-orange-500/40 bg-orange-950/25 p-3.5 shadow-[0_0_25px_rgba(244,81,30,0.12)]">
                <div className="absolute -top-2.5 left-2.5 flex items-center gap-1 rounded bg-orange-600 px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow-sm">
                  <Activity className="h-3 w-3" />
                  <span>Out-of-Order Handwriting Mapped · 98.1% OCR</span>
                </div>

                <p className="font-serif italic tracking-wide text-amber-100 text-sm leading-relaxed pt-1">
                  Q = ω₀ / (2γ) = (14.2 rad/s) / (2 × 0.85 s⁻¹) = 8.35
                  <br />
                  <span className="text-rose-300 line-through">Final units: rad/s</span>{" "}
                  <span className="text-emerald-300 font-sans font-medium text-xs">Dimensionless ratio verified.</span>
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
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4 text-left shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overall Score
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  GRADE A+
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">18.5</span>
                <span className="text-sm font-medium text-slate-400">/ 20.0</span>
                <span className="ml-auto text-xs font-bold text-emerald-400">92.5%</span>
              </div>

              {/* Progress Bar with Shimmer */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 w-[92.5%] shadow-[0_0_12px_rgba(244,81,30,0.6)]" />
              </div>
            </div>

            {/* AI Real-time Inspection Pipeline Stream */}
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4 text-left space-y-3 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                Live Pipeline Telemetry
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-2.5 border border-white/5">
                  <span className="text-slate-300">Answer Extraction</span>
                  <span className="font-mono font-semibold text-emerald-400">3/3 Extracted</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-2.5 border border-white/5">
                  <span className="text-slate-300">Out-of-Order Match</span>
                  <span className="font-mono font-semibold text-cyan-400">100% Aligned</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-2.5 border border-white/5">
                  <span className="text-slate-300">Rubric Justification</span>
                  <span className="font-mono font-semibold text-orange-400">Instant AI</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Marking Insight Card */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900/80 p-3.5 text-left shadow-lg">
              <p className="text-[11px] font-mono text-indigo-300 flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "7s" }} />
                AI Grader Commentary:
              </p>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Strong theoretical grounding in Q1. In Q2, student mislabeled units as rad/s instead of dimensionless, correctly flagged by Rubric Rule #4.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
