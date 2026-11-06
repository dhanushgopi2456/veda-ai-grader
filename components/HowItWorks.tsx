"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    label: "Ingestion",
    title: "Upload Papers & Key",
    desc: "Submit your question paper and teacher marking scheme alongside multi-page handwritten student scans in PDF, PNG, or JPEG formats.",
  },
  {
    step: "02",
    label: "Processing",
    title: "OCR & Non-Linear Mapping",
    desc: "Gemini 2.5 multimodal vision recognizes varied handwriting, maps answers to question prompts regardless of order, and identifies formulas.",
  },
  {
    step: "03",
    label: "Evaluation",
    title: "Criteria-Based Scoring",
    desc: "Generates point breakdowns, step-level feedback, and classroom mastery distributions with transparent rubric citations.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[var(--fog)]/70 backdrop-blur-md py-20 border-y border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="max-w-2xl text-left">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
            Workflow Architecture
          </span>
          <h2 className="mt-2 font-serif text-[38px] sm:text-[48px] font-normal tracking-[-0.96px] text-[#17191c]">
            From forty minutes per exam script to seconds.
          </h2>
          <p className="mt-4 text-[16px] font-sans text-[#777b86] leading-relaxed">
            A three-stage evaluation cycle designed to preserve instructor oversight while eliminating repetitive handwriting transcription.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="rounded-[24px] bg-[var(--mist)]/90 backdrop-blur-sm p-8 border border-[var(--border)] flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="font-serif text-[42px] font-normal tracking-[-0.66px] text-[#17191c] block">
                  {s.step}
                </span>
                <span className="text-[11px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799] mt-2 block">
                  {s.label}
                </span>
                <h3 className="mt-4 font-serif text-[22px] font-normal tracking-tight text-[#17191c]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14px] font-sans text-[#777b86] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#e5e5e7]">
                <span className="text-[12px] font-sans text-[#777b86]">
                  Stage {s.step} Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
