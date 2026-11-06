"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveScanPreview from "@/components/LiveScanPreview";
import Marquee from "@/components/Marquee";
import MetricsStrip from "@/components/MetricsStrip";
import FeatureBento from "@/components/FeatureBento";
import HowItWorks from "@/components/HowItWorks";
import { useToast } from "@/components/ToastProvider";
import AmbientGlareShader from "@/components/ui/ambient-glare-shader";

export default function LandingPage() {
  const { toast } = useToast();

  return (
    <div className="relative min-h-screen bg-transparent text-[var(--ink)] overflow-x-clip selection:bg-[var(--mist)] selection:text-[var(--ink)]">
      {/* Transparent Editorial Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 text-center">
          {/* Subtle Category Tag */}
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
              Multimodal Assessment Architecture
            </span>
          </div>

          {/* Steep Editorial Display Headline (Strictly Weight 400 Regular Serif) */}
          <h1 className="mx-auto max-w-4xl font-serif text-[48px] sm:text-[68px] lg:text-[84px] font-normal leading-[1.18] tracking-[-2.25px] text-[var(--ink)]">
            Grade handwritten exams with quiet, disciplined precision.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[18px] font-sans text-[var(--slate)] leading-relaxed">
            VedaAI ingests chaotic student handwriting, aligns answers mapped out of sequence, and awards step-by-step partial marks with instant rubric justifications.
          </p>

          {/* Steep Button Pairing: Primary and Secondary on the Same Baseline */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              onClick={() => toast.info("Navigating to Educator Portal...")}
              className="btn-steep-primary group"
            >
              <AmbientGlareShader radius={9999} intensity={1.2} duration={2.2} pause={1.8} />
              <span className="relative z-10">Start Grading Now</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/grader?sample=true"
              onClick={() => toast.info("Loading sample assessment...")}
              className="btn-steep-secondary group"
            >
              <AmbientGlareShader radius={9999} intensity={0.9} duration={2.5} pause={2.0} />
              <span className="relative z-10">Try Sample Assessment</span>
            </Link>
          </div>

          {/* Editorial Trust Proofline */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] font-sans text-[var(--slate)]">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--ink)]" /> Zero student data retention
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--ink)]" /> Works with your Gemini key
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--ink)]" /> In-browser rasterization
            </span>
          </div>

          {/* Floating Product UI Artifact */}
          <div className="mt-16 sm:mt-20">
            <LiveScanPreview />
          </div>
        </div>
      </section>

      {/* Infinite Loop Marquee Banner */}
      <Marquee speed={30} />

      {/* Metrics Counter Section (Fog White Alternating Band) */}
      <section id="metrics">
        <MetricsStrip />
      </section>

      {/* Bento Grid Platform Capabilities */}
      <section id="features">
        <FeatureBento />
      </section>

      {/* 3-Step Methodology (Fog White Alternating Band) */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Single Featured Accent Callout Card in Blush Peach (#fbe1d1) */}
      <section className="relative mx-auto w-full max-w-[1200px] px-6 py-20 lg:px-8">
        <div className="rounded-[24px] bg-[var(--peach)] p-8 sm:p-14 border border-[var(--sienna)]/20 text-[var(--sienna)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--sienna)]/80">
              Institutional Evaluation Report
            </span>
            <h2 className="font-serif text-[32px] sm:text-[42px] font-normal tracking-[-0.66px] leading-[1.25] text-[var(--sienna)]">
              &ldquo;VedaAI resolved our evaluation backlog across 1,400 handwritten physics finals without a single transcription dispute.&rdquo;
            </h2>
            <p className="text-[14px] font-sans text-[var(--sienna)]/80 pt-2">
              Dr. Marcus Vance · Department of Physical Sciences, Apex Academic Council
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/login"
              onClick={() => toast.info("Navigating to Educator Portal...")}
              className="relative overflow-hidden inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[var(--sienna)] px-6 text-[15px] font-sans font-medium text-[var(--canvas)] transition-opacity hover:opacity-95 shadow-sm group"
            >
              <AmbientGlareShader radius={9999} intensity={1.3} duration={2.2} pause={1.8} />
              <span className="relative z-10">Launch Workspace</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/grader?sample=true"
              onClick={() => toast.info("Opening sample report...")}
              className="link-steep text-[var(--sienna)] hover:text-[var(--sienna)]"
            >
              <span>View sample report →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
