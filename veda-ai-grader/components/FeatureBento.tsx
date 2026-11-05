"use client";

import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import {
  FileText,
  Shuffle,
  CheckSquare,
  BarChart3,
  Lock,
  Sparkles,
  Search,
  ScanLine,
} from "lucide-react";

export default function FeatureBento() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          Autonomous Assessment Engine
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Engineered for Real-World,{" "}
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
            Messy Handwritten Exams
          </span>
        </h2>
        <p className="mt-4 text-base text-slate-300 leading-relaxed sm:text-lg">
          Traditional grading software requires rigid bubble sheets. VedaAI digests natural,
          handwritten, unstructured exam scripts and grades them against rigorous rubric criteria.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
        {/* Card 1: Handwritten OCR Extraction (7 cols) */}
        <SpotlightCard
          className="md:col-span-7 flex flex-col justify-between"
          spotlightColor="rgba(244, 81, 30, 0.2)"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">
              Handwritten OCR & Margin Extraction
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Trained on diverse student scripts, multilingual characters, mathematical symbols,
              and cross-outs. Extracts full bounding polygons with pixel-level precision directly from
              scanned photos and PDFs.
            </p>
          </div>

          {/* Interactive Visual Simulation */}
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 p-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/5 pb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Search className="h-3 w-3" /> Polygon Detection
              </span>
              <span>4 Page Regions Tagged</span>
            </div>
            <div className="mt-3 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between rounded bg-white/5 p-2 text-slate-300">
                <span>[Q1_Answer] &quot;F = m(dv/dt) + kv&quot;</span>
                <span className="text-emerald-400 font-semibold">99.8% Match</span>
              </div>
              <div className="flex items-center justify-between rounded bg-white/5 p-2 text-slate-300">
                <span>[Q2_Answer] &quot;Integrating from t=0 to T...&quot;</span>
                <span className="text-emerald-400 font-semibold">98.5% Match</span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Out-of-Order Answer Mapping (5 cols) */}
        <SpotlightCard
          className="md:col-span-5 flex flex-col justify-between"
          spotlightColor="rgba(56, 189, 248, 0.2)"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shuffle className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">
              Non-Linear Answer Mapping
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Students rarely answer in numerical order. VedaAI semantically analyzes question
              labels (e.g. &ldquo;Q3.b&rdquo;, &ldquo;Ans 1 continued&rdquo;) and maps them to the right rubric item even across mixed pages.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/80 p-3 font-mono text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Page 1 (Bottom):</span>
              <span className="text-cyan-400">Mapped to Question #4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Page 3 (Top):</span>
              <span className="text-indigo-400">Mapped to Question #1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Page 4 (Margin):</span>
              <span className="text-amber-400">Mapped to Question #2</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3: Instant Criteria Grading (5 cols) */}
        <SpotlightCard
          className="md:col-span-5 flex flex-col justify-between"
          spotlightColor="rgba(168, 85, 247, 0.2)"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">
              Instant Rubric & Criteria Scoring
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Awards step-by-step partial credit based on educator criteria. Generates clear, constructive feedback so students understand exactly where marks were earned or lost.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-300">Calculation Step 1</span>
              <span className="text-emerald-400 font-bold">+2.0 / 2.0</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-300">Conceptual Justification</span>
              <span className="text-emerald-400 font-bold">+1.5 / 1.5</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-300">Final Precision Units</span>
              <span className="text-rose-400 font-bold">-0.5 (Slip)</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 4: Classroom Analytics & Teacher Insights (7 cols) */}
        <SpotlightCard
          className="md:col-span-7 flex flex-col justify-between"
          spotlightColor="rgba(99, 102, 241, 0.2)"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">
              Classroom Analytics & Gap Diagnostics
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Identify systemic learning gaps instantly. See which specific questions tripped up 60% of students, isolate common conceptual misconceptions, and export grade rosters with one click.
            </p>
          </div>

          {/* Graphical Micro-Distribution */}
          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/80 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Grade Distribution (Cohort N=140)</span>
              <span className="font-mono text-indigo-300">Mean: 84.2%</span>
            </div>
            <div className="mt-3 flex items-end gap-2 h-16 pt-2">
              <div className="flex-1 bg-slate-800 rounded-t h-[20%]" title="F" />
              <div className="flex-1 bg-slate-800 rounded-t h-[35%]" title="D" />
              <div className="flex-1 bg-indigo-700/60 rounded-t h-[65%]" title="C" />
              <div className="flex-1 bg-indigo-500/80 rounded-t h-[95%]" title="B" />
              <div className="flex-1 bg-emerald-500 rounded-t h-[75%]" title="A" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-500">
              <span>&lt; 50%</span>
              <span>60%</span>
              <span>70%</span>
              <span>80%</span>
              <span>90%+</span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}

