"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, CheckCircle, Shield, FileCheck2, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicBackground from "@/components/CinematicBackground";
import LiveScanPreview from "@/components/LiveScanPreview";
import MetricsStrip from "@/components/MetricsStrip";
import FeatureBento from "@/components/FeatureBento";
import HowItWorks from "@/components/HowItWorks";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050711] text-white selection:bg-orange-500 selection:text-white">
      {/* Ambient Moving Canvas Background */}
      <CinematicBackground variant="hero" />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur-md shadow-[0_0_20px_rgba(244,81,30,0.15)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Next-Gen OCR & Multimodal Assessment Architecture</span>
            <span className="h-1 w-1 rounded-full bg-orange-400" />
            <span className="text-slate-300">Powered by Gemini 2.5</span>
          </motion.div>

          {/* Cinematic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Grade Handwritten Exams with{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
              Pixel-Level AI Precision
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
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(244,81,30,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(244,81,30,0.6)] hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Start Grading Now</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="/grader?sample=true"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-xl transition-all duration-200 hover:border-white/30 hover:bg-slate-800 hover:text-white"
            >
              <Zap className="h-5 w-5 text-orange-400" />
              <span>Try Sample Assessment</span>
            </Link>
          </motion.div>

          {/* Quick Credibility Micro-Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
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
          {/* Subtle Corner Light Glow */}
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
