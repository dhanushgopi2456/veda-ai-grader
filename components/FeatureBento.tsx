"use client";

import Link from "next/link";
import { ScanLine, Shuffle, CheckCircle, Lock, ArrowRight, Layers, Award } from "lucide-react";

export default function FeatureBento() {
  return (
    <section id="features" className="relative mx-auto w-full max-w-[1200px] px-6 py-20 lg:px-8">
      {/* Section Header */}
      <div className="max-w-2xl text-left">
        <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
          Platform Capabilities
        </span>
        <h2 className="mt-2 font-serif text-[38px] sm:text-[48px] font-normal tracking-[-0.96px] text-[#17191c] leading-[1.25]">
          Architected for unstructured handwriting and strict rubric schemas.
        </h2>
        <p className="mt-4 text-[16px] font-sans text-[#777b86] leading-relaxed">
          Traditional grading software forces students onto rigid bubble sheets. VedaAI ingests handwritten, non-linear student answer sheets and maps them directly to instructor criteria.
        </p>
      </div>

      {/* Editorial Bento Grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Card 1: Handwritten OCR Extraction (7 cols) */}
        <div className="md:col-span-7 rounded-[24px] bg-[#f2f2f3] p-7 sm:p-9 border border-[#e5e5e7] flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-sans font-medium uppercase tracking-wider text-[#979799] block mb-3">
              Extraction Layer
            </span>
            <h3 className="font-serif text-[26px] font-normal tracking-[-0.66px] text-[#17191c]">
              Handwritten OCR & Margin Extraction
            </h3>
            <p className="mt-3 text-[14px] font-sans text-[#777b86] leading-relaxed">
              Trained across varied penmanship, multilingual characters, cross-outs, and mathematical formulas. Segments answer regions with polygon boundaries directly from phone photos or multi-page PDFs.
            </p>
          </div>

          {/* Clean Nested Paper Simulation */}
          <div className="mt-8 rounded-[16px] bg-[#ffffff] p-5 border border-[#e5e5e7]">
            <div className="flex items-center justify-between text-[11px] font-sans text-[#777b86] border-b border-[#f2f2f3] pb-2 mb-3">
              <span>SCAN INGESTION · PAGE 01</span>
              <span className="text-[#17191c] font-medium">99.4% CONFIDENCE</span>
            </div>
            <p className="font-serif italic text-[14px] text-[#17191c] leading-relaxed">
              &ldquo;∫ x · sin(x) dx = -x · cos(x) + ∫ cos(x) dx = -x · cos(x) + sin(x) + C&rdquo;
            </p>
            <div className="mt-3 text-[11px] font-sans text-[#777b86]">
              Integration-by-parts step recognized · Boundary condition logged
            </div>
          </div>
        </div>

        {/* Card 2: Out-of-Order Answer Mapping (5 cols) */}
        <div className="md:col-span-5 rounded-[24px] bg-[#f2f2f3] p-7 sm:p-9 border border-[#e5e5e7] flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-sans font-medium uppercase tracking-wider text-[#979799] block mb-3">
              Spatial Resolution
            </span>
            <h3 className="font-serif text-[26px] font-normal tracking-[-0.66px] text-[#17191c]">
              Out-of-Sequence Mapping
            </h3>
            <p className="mt-3 text-[14px] font-sans text-[#777b86] leading-relaxed">
              Students answer questions out of numerical sequence. VedaAI links scattered answers back to the respective rubric prompt without manual reordering.
            </p>
          </div>

          <div className="mt-8 rounded-[16px] bg-[#ffffff] p-5 border border-[#e5e5e7] space-y-2.5">
            <div className="flex items-center justify-between text-[12px] font-sans">
              <span className="text-[#777b86]">Page 4, Paragraph 2</span>
              <span className="rounded-full bg-[#f2f2f3] px-2 py-0.5 text-[11px] text-[#17191c] font-medium">
                → Mapped to Question 2b
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px] font-sans">
              <span className="text-[#777b86]">Page 2, Header margin</span>
              <span className="rounded-full bg-[#f2f2f3] px-2 py-0.5 text-[11px] text-[#17191c] font-medium">
                → Mapped to Question 1c
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Instant Criteria Grading (6 cols) */}
        <div className="md:col-span-6 rounded-[24px] bg-[#f2f2f3] p-7 sm:p-9 border border-[#e5e5e7] flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-sans font-medium uppercase tracking-wider text-[#979799] block mb-3">
              Scoring Model
            </span>
            <h3 className="font-serif text-[26px] font-normal tracking-[-0.66px] text-[#17191c]">
              Step-by-Step Partial Marks
            </h3>
            <p className="mt-3 text-[14px] font-sans text-[#777b86] leading-relaxed">
              Evaluates method accuracy, formula setup, algebraic simplifications, and final values independently. Awards transparent partial points alongside verifiable explanations.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#e5e5e7] flex items-center justify-between text-[13px] font-sans">
            <span className="text-[#777b86]">Audited Schema Compliance</span>
            <span className="text-[#17191c] font-medium">Deterministic Scoring</span>
          </div>
        </div>

        {/* Card 4: Complete Privacy & Ephemeral Memory (6 cols) */}
        <div className="md:col-span-6 rounded-[24px] bg-[#f2f2f3] p-7 sm:p-9 border border-[#e5e5e7] flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-sans font-medium uppercase tracking-wider text-[#979799] block mb-3">
              Institutional Safety
            </span>
            <h3 className="font-serif text-[26px] font-normal tracking-[-0.66px] text-[#17191c]">
              Zero Server File Retention
            </h3>
            <p className="mt-3 text-[14px] font-sans text-[#777b86] leading-relaxed">
              Files are converted in browser memory via local canvas rasterizers. No student answer sheets or names are permanently archived on intermediate storage servers.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#e5e5e7] flex items-center justify-between text-[13px] font-sans">
            <span className="text-[#777b86]">Client-Side Rasterization</span>
            <span className="text-[#17191c] font-medium">FERPA & GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
