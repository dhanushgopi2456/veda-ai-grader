"use client";

import React from "react";
import { Sparkles, ShieldCheck, Cpu, Zap, Eye, CheckCircle2, Award, FileCode } from "lucide-react";

interface MarqueeItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
}

const DEFAULT_ITEMS: MarqueeItem[] = [
  { icon: Cpu, label: "Gemini 2.5 Multimodal Architecture", badge: "Neural Vision" },
  { icon: Eye, label: "99.4% Handwritten OCR Precision", badge: "Empirical" },
  { icon: Zap, label: "Out-of-Sequence Answer Alignment", badge: "Dynamic" },
  { icon: Award, label: "Step-by-Step Rubric Justifications", badge: "Deterministic" },
  { icon: ShieldCheck, label: "Zero Student Data Retention", badge: "FERPA / GDPR" },
  { icon: FileCode, label: "Physics & Calculus LaTeX Extraction", badge: "MathML" },
  { icon: CheckCircle2, label: "Deterministic Partial Marks Engine", badge: "Audited" },
  { icon: Sparkles, label: "Client-Side Canvas Rasterization", badge: "120 FPS" },
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  direction = "left",
  speed = 35,
  className = "",
}: {
  items?: MarqueeItem[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden select-none py-4 border-y border-[var(--border)] bg-[var(--canvas)]/80 backdrop-blur-md transition-colors ${className}`}
    >
      {/* Side Vignette Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--canvas)] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--canvas)] to-transparent z-10" />

      {/* Infinite Scrolling Track */}
      <div
        className="flex w-max gap-8 will-change-transform hover:[animation-play-state:paused]"
        style={{
          animation: `marqueeLoop ${speed}s linear infinite ${direction === "right" ? "reverse" : "normal"}`,
        }}
      >
        {/* Render twice for seamless infinite wrapping */}
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-full bg-[var(--mist)] px-4 py-2 border border-[var(--border)] shadow-xs transition-colors hover:border-[var(--ink)]/40 hover:bg-[var(--canvas)] group"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink)] group-hover:scale-110 transition-transform">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-[13px] font-sans font-medium text-[var(--ink)] whitespace-nowrap">
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-[var(--canvas)] px-2 py-0.5 text-[10px] font-mono text-[var(--slate)] border border-[var(--border)]">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes marqueeLoop {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
