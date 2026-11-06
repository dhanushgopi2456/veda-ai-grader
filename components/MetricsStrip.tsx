"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import InteractiveMetricsCharts from "@/components/InteractiveMetricsCharts";

interface CounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ value, decimals = 0, suffix = "", prefix = "", duration = 1.6 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * value;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-serif text-[44px] lg:text-[54px] font-normal tracking-[-0.96px] text-[var(--ink)]">
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const METRICS = [
  {
    label: "OCR Accuracy",
    value: 98.4,
    decimals: 1,
    suffix: "%",
    detail: "Trained across handwritten student scripts and mathematical notation.",
  },
  {
    label: "Evaluation Speed",
    value: 1.8,
    decimals: 1,
    suffix: "s",
    detail: "Average turnaround time per submission page using Gemini multimodal vision.",
  },
  {
    label: "Out-of-Order Mapping",
    value: 100,
    decimals: 0,
    suffix: "%",
    detail: "Non-linear answer tracking that correctly anchors split answers to question rubrics.",
  },
  {
    label: "Data Retention",
    value: 0,
    decimals: 0,
    suffix: "%",
    detail: "Ephemeral browser rasterization with complete FERPA and institutional privacy.",
  },
];

export default function MetricsStrip() {
  return (
    <div className="w-full bg-[var(--fog)]/70 backdrop-blur-md py-20 border-y border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mb-10 text-left">
          <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
            Empirical Benchmarks
          </span>
          <h2 className="mt-2 font-serif text-[32px] sm:text-[40px] font-normal tracking-[-0.66px] text-[var(--ink)]">
            Measured performance on messy student scripts.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-[24px] bg-[var(--mist)]/90 backdrop-blur-sm p-7 border border-[var(--border)] flex flex-col justify-between shadow-xs transition-colors"
            >
              <div>
                <span className="text-[13px] font-sans font-medium text-[var(--slate)]">
                  {m.label}
                </span>
                <div className="mt-3 flex items-baseline">
                  <AnimatedCounter
                    value={m.value}
                    decimals={m.decimals}
                    suffix={m.suffix}
                  />
                </div>
              </div>
              <p className="mt-4 text-[13px] font-sans text-[var(--slate)] leading-relaxed border-t border-[var(--border)] pt-4">
                {m.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Animated Donut Chart & Silky Line Graph Section */}
        <div className="mt-14 pt-14 border-t border-[var(--border)]">
          <InteractiveMetricsCharts
            title="Real-Time Mastery Dynamics"
            subtitle="Explore response categorization and score trajectories across multimodal evaluation benchmarks."
          />
        </div>
      </div>
    </div>
  );
}
