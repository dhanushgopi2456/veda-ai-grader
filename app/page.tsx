"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveScanPreview from "@/components/LiveScanPreview";
import MetricsStrip from "@/components/MetricsStrip";
import FeatureBento from "@/components/FeatureBento";
import HowItWorks from "@/components/HowItWorks";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#17191c] overflow-x-clip selection:bg-[#f2f2f3] selection:text-[#17191c]">
      {/* Transparent Editorial Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 text-center">
          {/* Subtle Category Tag */}
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
              Multimodal Assessment Architecture
            </span>
          </div>

          {/* Steep Editorial Display Headline (Strictly Weight 400 Regular Serif) */}
          <h1 className="mx-auto max-w-4xl font-serif text-[48px] sm:text-[68px] lg:text-[84px] font-normal leading-[1.18] tracking-[-2.25px] text-[#17191c]">
            Grade handwritten exams with quiet, disciplined precision.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[18px] font-sans text-[#777b86] leading-relaxed">
            VedaAI ingests chaotic student handwriting, aligns answers mapped out of sequence, and awards step-by-step partial marks with instant rubric justifications.
          </p>

          {/* Steep Button Pairing: Primary and Secondary on the Same Baseline */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/grader"
              className="btn-steep-primary"
            >
              <span>Start Grading Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/grader?sample=true"
              className="btn-steep-secondary"
            >
              <span>Try Sample Assessment</span>
            </Link>
          </div>

          {/* Editorial Trust Proofline */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] font-sans text-[#777b86]">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#17191c]" /> Zero student data retention
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#17191c]" /> Works with your Gemini key
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#17191c]" /> In-browser rasterization
            </span>
          </div>

          {/* Floating Product UI Artifact */}
          <div className="mt-16 sm:mt-20">
            <LiveScanPreview />
          </div>
        </div>
      </section>

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
        <div className="rounded-[24px] bg-[#fbe1d1] p-8 sm:p-14 border border-[#5d2a1a]/20 text-[#5d2a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#5d2a1a]/80">
              Institutional Evaluation Report
            </span>
            <h2 className="font-serif text-[32px] sm:text-[42px] font-normal tracking-[-0.66px] leading-[1.25] text-[#5d2a1a]">
              &ldquo;VedaAI resolved our evaluation backlog across 1,400 handwritten physics finals without a single transcription dispute.&rdquo;
            </h2>
            <p className="text-[14px] font-sans text-[#5d2a1a]/80 pt-2">
              Dr. Marcus Vance · Department of Physical Sciences, Apex Academic Council
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/grader"
              className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#5d2a1a] px-6 text-[15px] font-sans font-medium text-[#ffffff] transition-opacity hover:opacity-90"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/grader?sample=true"
              className="link-steep text-[#5d2a1a] hover:text-[#5d2a1a]"
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
