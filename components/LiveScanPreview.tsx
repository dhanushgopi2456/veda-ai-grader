"use client";

import { useState } from "react";
import { Check, FileText, CheckCircle2, ChevronRight, Layers, Sliders } from "lucide-react";

export default function LiveScanPreview() {
  const [activeTab, setActiveTab] = useState<"sheet" | "rubric">("sheet");

  return (
    <div className="relative mx-auto w-full max-w-[1040px] select-none">
      {/* Floating Product Artifact Card - Elevated according to Steep Rules */}
      <div className="rounded-[20px] bg-[var(--canvas)]/95 backdrop-blur-xl p-5 sm:p-7 shadow-steep-artifact border border-[var(--border)] text-left">
        {/* Top Artifact Chrome Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#f2f2f3] pb-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-[17px] font-normal text-[#17191c]">
              Interactive Assessment Inspector
            </span>
            <span className="rounded-full bg-[#f2f2f3] px-2.5 py-0.5 text-[11px] font-sans font-medium text-[#777b86]">
              Artifact v2.4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f3] px-3 py-1 text-[12px] font-sans text-[#17191c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#17191c]" />
              Inference Ready · Gemini 2.5
            </span>
          </div>
        </div>

        {/* Content Layout: Paper View + Editorial Evaluation Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Simulated Handwritten Exam Sheet Container (8 cols) */}
          <div className="rounded-[16px] bg-[#f2f2f3] p-5 sm:p-6 lg:col-span-7 border border-[#e5e5e7]">
            {/* Exam Header */}
            <div className="border-b border-[#e5e5e7] pb-3">
              <div className="flex justify-between text-[11px] font-sans text-[#777b86]">
                <span>AP PHYSICS & DIFFERENTIAL CALCULUS</span>
                <span className="text-[#17191c] font-medium">STUDENT ID: #8921</span>
              </div>
              <h4 className="mt-1 font-serif text-[16px] font-normal text-[#17191c]">
                Section B: Harmonic Motion & Boundary Velocity
              </h4>
            </div>

            {/* Question 1 Block */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[12px] font-sans text-[#777b86]">
                <span className="text-[#17191c] font-medium">Q1. Derive boundary velocity equation v(t):</span>
                <span className="rounded-full bg-[#ffffff] px-2 py-0.5 text-[11px] font-medium text-[#17191c] border border-[#e5e5e7]">
                  5.0 / 5.0 Marks
                </span>
              </div>

              {/* Mapped Handwriting Area */}
              <div className="mt-2 rounded-[12px] bg-[#ffffff] p-4 border border-[#e5e5e7]">
                <div className="mb-2 flex items-center justify-between text-[11px] font-sans text-[#777b86]">
                  <span className="rounded-full bg-[#f2f2f3] px-2 py-0.5 text-[10px] text-[#17191c] font-medium">
                    Mapped · 99.4% OCR Confidence
                  </span>
                  <span>Handwritten Ingestion</span>
                </div>

                <p className="font-serif italic text-[14px] text-[#17191c] leading-relaxed">
                  x(t) = A · e^(-γt) · cos(ωt + φ)
                  <br />
                  v(t) = dx/dt = -γ A e^(-γt) cos(ωt + φ) - ω A e^(-γt) sin(ωt + φ)
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[12px] font-sans text-[#17191c] pt-2 border-t border-[#f2f2f3]">
                  <Check className="h-3.5 w-3.5 text-[#17191c]" />
                  <span>Full criteria met: chain rule derivative correctly applied.</span>
                </div>
              </div>
            </div>

            {/* Question 2 Block (Out-of-Order Mapping Demonstration) */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[12px] font-sans text-[#777b86]">
                <span className="text-[#17191c] font-medium">Q2. Calculate resonance damping factor Q:</span>
                <span className="rounded-full bg-[#ffffff] px-2 py-0.5 text-[11px] font-medium text-[#17191c] border border-[#e5e5e7]">
                  3.5 / 4.0 Marks
                </span>
              </div>

              <div className="mt-2 rounded-[12px] bg-[#ffffff] p-4 border border-[#e5e5e7]">
                <div className="mb-2 flex items-center justify-between text-[11px] font-sans text-[#777b86]">
                  <span className="rounded-full bg-[#f2f2f3] px-2 py-0.5 text-[10px] text-[#17191c] font-medium">
                    Out-of-Order Answer Aligned
                  </span>
                  <span>Sequence Resolved</span>
                </div>

                <p className="font-serif italic text-[14px] text-[#17191c] leading-relaxed">
                  Q = ω₀ / (2γ) = (14.2 rad/s) / (2 × 0.85 s⁻¹) = 8.35
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[12px] font-sans text-[#777b86] pt-2 border-t border-[#f2f2f3]">
                  <span className="text-[#17191c]">Step deduction:</span> Correct formula (+3.0), dimensionless unit omission (-0.5).
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Grade Summary (5 cols) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {/* Score Metric Card */}
            <div className="rounded-[16px] bg-[#f2f2f3] p-5 border border-[#e5e5e7]">
              <div className="flex items-center justify-between text-[12px] font-sans text-[#777b86]">
                <span>TOTAL SCORE</span>
                <span className="rounded-full bg-[#17191c] px-2.5 py-0.5 text-[10px] font-medium text-[#ffffff]">
                  Grade A
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-[44px] font-normal tracking-[-0.66px] text-[#17191c]">
                  8.5
                </span>
                <span className="text-[15px] font-sans text-[#777b86]">/ 9.0 points</span>
                <span className="ml-auto text-[14px] font-sans font-medium text-[#17191c]">94.4%</span>
              </div>
              <p className="mt-2 text-[12px] font-sans text-[#777b86] leading-normal">
                Scored using institutional standard physics rubric with automated criterion-level breakdown.
              </p>
            </div>

            {/* Pipeline Step Metadata */}
            <div className="rounded-[16px] bg-[#f2f2f3] p-5 border border-[#e5e5e7] space-y-3">
              <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799] block">
                Audited Verification Trail
              </span>
              <div className="space-y-2 text-[13px] font-sans">
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5e5e7]">
                  <span className="text-[#777b86]">Handwriting OCR</span>
                  <span className="text-[#17191c] font-medium">99.4% precision</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5e5e7]">
                  <span className="text-[#777b86]">Question Alignment</span>
                  <span className="text-[#17191c] font-medium">Out-of-order resolved</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#777b86]">Rubric Verification</span>
                  <span className="text-[#17191c] font-medium">Deterministic criteria</span>
                </div>
              </div>
            </div>

            {/* Editorial Evaluator Commentary */}
            <div className="rounded-[16px] bg-[#fafafb] p-4 border border-[#e5e5e7]">
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#979799] block mb-1">
                Evaluator Feedback Note
              </span>
              <p className="font-serif italic text-[13px] text-[#777b86] leading-relaxed">
                &ldquo;Clear mathematical expression. In Question 2, the dimensionless quality factor ratio was correctly derived; unit omission flagged per schema rule 4.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
