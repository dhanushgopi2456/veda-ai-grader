"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle,
  Shield,
  FileCheck2,
  Cpu,
  Crosshair,
  Layers,
  Activity,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicBackground from "@/components/CinematicBackground";
import LiveScanPreview from "@/components/LiveScanPreview";
import MetricsStrip from "@/components/MetricsStrip";
import FeatureBento from "@/components/FeatureBento";
import HowItWorks from "@/components/HowItWorks";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#04060e] text-white selection:bg-orange-500 selection:text-white overflow-hidden">
      {/* Ambient Moving Canvas Background */}
      <CinematicBackground variant="hero" />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Floating Holographic Telemetry Badge - Top Left */}
          <div className="hidden xl:flex absolute -left-6 top-16 z-20 items-center gap-3 rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-3 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-xl anim-float-slow select-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Cpu className="h-5 w-5 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                OCR Vision Engine
              </div>
              <div className="text-xs font-bold text-slate-100">99.4% Accuracy</div>
              <div className="text-[10px] text-slate-400 font-mono">Multi-Stroke Ingestion</div>
            </div>
          </div>

          {/* Floating Holographic Telemetry Badge - Top Right */}
          <div className="hidden xl:flex absolute -right-6 top-16 z-20 items-center gap-3 rounded-2xl border border-amber-500/30 bg-slate-950/70 p-3 shadow-[0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-xl anim-float-reverse select-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <Crosshair className="h-5 w-5 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Spatial Alignment
              </div>
              <div className="text-xs font-bold text-slate-100">100% Sequence Solved</div>
              <div className="text-[10px] text-slate-400 font-mono">Out-of-Order Mapping</div>
            </div>
          </div>

          {/* Floating Holographic Badge - Bottom Left */}
          <div className="hidden xl:flex absolute -left-12 bottom-32 z-20 items-center gap-2.5 rounded-2xl border border-emerald-500/25 bg-slate-950/70 p-2.5 shadow-[0_0_25px_rgba(16,185,129,0.12)] backdrop-blur-xl anim-float select-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/60 text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
            <div className="text-left text-xs font-medium text-slate-300">
              <span className="font-mono text-[10px] text-emerald-400 block">FERPA & GDPR</span>
              Zero Data Retention
            </div>
          </div>

          {/* Floating Holographic Badge - Bottom Right */}
          <div className="hidden xl:flex absolute -right-12 bottom-32 z-20 items-center gap-2.5 rounded-2xl border border-purple-500/25 bg-slate-950/70 p-2.5 shadow-[0_0_25px_rgba(168,85,247,0.12)] backdrop-blur-xl anim-float-slow select-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-950/60 text-purple-400">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-left text-xs font-medium text-slate-300">
              <span className="font-mono text-[10px] text-purple-400 block">Sub-1.8s Latency</span>
              Gemini 2.5 Flash Engine
            </div>
          </div>

          {/* Eyebrow Pill with Animated Shimmer Glow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 px-4 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur-md shadow-[0_0_25px_rgba(244,81,30,0.25)] anim-pulse-glow"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400 animate-spin" style={{ animationDuration: "5s" }} />
            <span>Next-Gen OCR & Multimodal Assessment Architecture</span>
            <span className="h-1 w-1 rounded-full bg-orange-400" />
            <span className="text-slate-300">Powered by Gemini 2.5</span>
          </motion.div>

          {/* Cinematic Headline with Moving Text Shimmer */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Grade Handwritten Exams with{" "}
            <span className="relative inline-block">
              {/* Radial text bloom glow behind the highlight words */}
              <span className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-r from-orange-500/35 via-amber-400/25 to-indigo-500/35 blur-2xl opacity-80 animate-pulse" />
              <span className="relative bg-gradient-to-r from-orange-400 via-amber-300 via-50% to-indigo-400 bg-clip-text text-transparent anim-text-shimmer font-black">
                Pixel-Level AI Precision
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 sm:text-xl leading-relaxed"
          >
            VedaAI scans chaotic student handwriting, aligns answers mapped out of sequence,
            and awards step-by-step partial marks with instant rubric justifications.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/grader"
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(244,81,30,0.5)] transition-all duration-300 hover:shadow-[0_0_55px_rgba(244,81,30,0.75)] hover:scale-[1.03] active:scale-[0.98] ring-2 ring-orange-400/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Grading Now
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 transition-transform bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </Link>

            <Link
              href="/grader?sample=true"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/20 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-xl transition-all duration-200 hover:border-cyan-400/50 hover:bg-slate-800/90 hover:text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
            >
              <Zap className="h-5 w-5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Try Sample Assessment</span>
            </Link>
          </motion.div>

          {/* Live AI Telemetry HUD Strip with Equalizer Frequency Bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-6 mx-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 py-1.5 backdrop-blur-md shadow-inner"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                System Active
              </span>
            </div>

            <div className="h-3 w-px bg-white/15" />

            {/* Mini Equalizer Audio Frequency Bars */}
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_1.0s_ease-in-out_infinite_0.1s] h-3" />
              <span className="w-1 bg-orange-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.3s] h-2.5" />
              <span className="w-1 bg-amber-400 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-3" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-1.5" />
            </div>

            <div className="h-3 w-px bg-white/15" />

            <span className="text-[11px] font-mono text-slate-400">
              Gemini 2.5 Multimodal · 60 FPS Accelerated Engine
            </span>
          </motion.div>

          {/* Quick Credibility Micro-Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> No student data retention
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Free with your Gemini API key
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Instant PDF & JPEG rasterization
            </span>
          </motion.div>

          {/* Interactive Live Scan Preview Card */}
          <div className="mt-14 sm:mt-20">
            <LiveScanPreview />
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip */}
      <section id="metrics" className="relative z-10 border-y border-white/5 bg-slate-950/40">
        <MetricsStrip />
      </section>

      {/* Bento Grid Capabilities */}
      <section id="features" className="relative z-10">
        <FeatureBento />
      </section>

      {/* How it works 3-step pipeline */}
      <section className="relative z-10">
        <HowItWorks />
      </section>

      {/* Interactive Assessment Callout Banner */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-slate-900/90 to-indigo-950/40 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-[0_0_50px_rgba(244,81,30,0.15)]">
          {/* Corner Light Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <h2 className="relative z-10 text-3xl font-black text-white sm:text-5xl tracking-tight">
            Ready to reclaim 85% of your grading time?
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Join hundreds of educators and teaching assistants who trust VedaAI for fast, consistent, and transparent assessment evaluations.
          </p>

          <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/grader"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/30 transition-transform duration-200 hover:scale-105"
            >
              <span>Launch Grader Workspace</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              <span>Sign In to Educator Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
