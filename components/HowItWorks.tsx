"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Ingest Assessments & Keys",
    desc: "Drop standard question papers alongside raw student answer sheets in multi-page PDF or JPEG/PNG camera scans.",
    icon: Upload,
    accent: "from-orange-500 to-amber-500",
    border: "border-orange-500/30",
  },
  {
    step: "02",
    title: "Multimodal AI OCR & Mapping",
    desc: "Gemini 2.5 vision reads messy handwriting, maps answers to question numbers regardless of order, and extracts step logic.",
    icon: Cpu,
    accent: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/30",
  },
  {
    step: "03",
    title: "Automated Grading & Feedback",
    desc: "Every step is evaluated against your marking scheme with partial points, feedback justifications, and instant aggregate stats.",
    icon: Award,
    accent: "from-purple-500 to-indigo-500",
    border: "border-purple-500/30",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-orange-400">
          Streamlined Evaluation Workflow
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          From 45 Minutes per Paper down to{" "}
          <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            Under 3 Seconds
          </span>
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative overflow-hidden rounded-2xl border ${s.border} bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-white/30">{s.step}</span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <h3 className="mt-6 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Try Banner */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-indigo-950/60 to-slate-900/90 p-8 text-center backdrop-blur-2xl">
        <h3 className="text-2xl font-bold text-white">Experience it with sample assessment papers</h3>
        <p className="mt-2 text-sm text-slate-300">
          No sign-up or preparation needed. We provide pre-scanned Physics and Math papers ready for evaluation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/grader?sample=true"
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/30 transition-all hover:bg-orange-500 hover:scale-105"
          >
            <span>Try Sample Assessment Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/grader"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Open Empty Workspace
          </Link>
        </div>
      </div>
    </section>
  );
}

