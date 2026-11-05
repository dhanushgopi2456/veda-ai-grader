"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Zap, Shuffle, ShieldCheck } from "lucide-react";

interface CounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ value, decimals = 0, suffix = "", prefix = "", duration = 2 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
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
    <span ref={ref} className="font-mono font-bold">
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const METRICS = [
  {
    label: "Handwritten OCR Precision",
    value: 98.4,
    decimals: 1,
    suffix: "%",
    subtext: "Validated across cursive, math & physics papers",
    icon: Target,
    accent: "text-emerald-400",
    glow: "group-hover:border-emerald-500/30",
  },
  {
    label: "Average Batch Latency",
    value: 2.8,
    decimals: 1,
    prefix: "< ",
    suffix: "s",
    subtext: "From raw upload to fully annotated gradesheet",
    icon: Zap,
    accent: "text-amber-400",
    glow: "group-hover:border-amber-500/30",
  },
  {
    label: "Out-of-Order Mapping",
    value: 100,
    decimals: 0,
    suffix: "%",
    subtext: "Automatic alignment regardless of student sequence",
    icon: Shuffle,
    accent: "text-cyan-400",
    glow: "group-hover:border-cyan-500/30",
  },
  {
    label: "Step Criteria Reliability",
    value: 99.1,
    decimals: 1,
    suffix: "%",
    subtext: "Consistent rubrics without grader fatigue bias",
    icon: ShieldCheck,
    accent: "text-indigo-400",
    glow: "group-hover:border-indigo-500/30",
  },
];

export default function MetricsStrip() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${item.glow} hover:bg-slate-900/80 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <span className="rounded-lg bg-white/5 p-2 text-slate-300">
                  <Icon className={`h-4 w-4 ${item.accent}`} />
                </span>
              </div>

              <div className={`mt-4 text-3xl font-extrabold sm:text-4xl ${item.accent}`}>
                <AnimatedCounter
                  value={item.value}
                  decimals={item.decimals}
                  prefix={item.prefix}
                  suffix={item.suffix}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {item.subtext}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

