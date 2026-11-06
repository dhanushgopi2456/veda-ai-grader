"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, PieChart as PieChartIcon, Award, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export interface DonutSegment {
  label: string;
  count: number;
  pct: number;
  color: string;
  strokeColor: string;
  fillBg: string;
}

export interface LineDataPoint {
  id: string;
  label: string;
  subTitle: string;
  score: number;
  grade: string;
  date: string;
}

interface Props {
  donutData?: DonutSegment[];
  lineData?: LineDataPoint[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_DONUT: DonutSegment[] = [
  { label: "Correct (≥85%)", count: 21, pct: 54, color: "#10b981", strokeColor: "stroke-emerald-500", fillBg: "bg-emerald-500" },
  { label: "Partial Credit", count: 2, pct: 5, color: "#f59e0b", strokeColor: "stroke-amber-500", fillBg: "bg-amber-500" },
  { label: "Incorrect Attempt", count: 0, pct: 0, color: "#f43f5e", strokeColor: "stroke-rose-500", fillBg: "bg-rose-500" },
  { label: "Unanswered / Blank", count: 16, pct: 41, color: "#64748b", strokeColor: "stroke-slate-500", fillBg: "bg-slate-500" },
];

const DEFAULT_LINE: LineDataPoint[] = [
  { id: "1", label: "Paper 1", subTitle: "Physics Midterm", score: 55, grade: "Grade C", date: "Sep 14" },
  { id: "2", label: "Paper 2", subTitle: "Math Calculus", score: 67, grade: "Grade B", date: "Sep 28" },
  { id: "3", label: "Paper 3", subTitle: "Harmonic Motion", score: 79, grade: "Grade A", date: "Oct 12" },
  { id: "4", label: "Paper 4", subTitle: "Differential Velocity", score: 85, grade: "Grade A", date: "Oct 26" },
  { id: "5", label: "Paper 5", subTitle: "AP Physics Final", score: 90, grade: "Grade A+", date: "Nov 06" },
];

export default function InteractiveMetricsCharts({
  donutData = DEFAULT_DONUT,
  lineData = DEFAULT_LINE,
  title = "Performance & Accuracy Distributions",
  subtitle = "Aggregated across evaluated student examination submissions.",
}: Props) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<(LineDataPoint & { x: number; y: number }) | null>(null);
  const chartId = useId();

  // Donut geometry constants
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  // Line graph geometry
  const width = 540;
  const height = 220;
  const paddingX = 45;
  const paddingY = 35;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  // Convert points to SVG coordinates
  const points = lineData.map((d, index) => {
    const x = paddingX + (index / Math.max(1, lineData.length - 1)) * innerWidth;
    // Map score [0..100] to y [height - paddingY .. paddingY]
    const y = height - paddingY - (d.score / 100) * innerHeight;
    return { ...d, x, y };
  });

  // Build smooth cubic bezier curve path
  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, "");

  // Area path for gradient fill under the curve
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : "";

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-left">
          {title && (
            <h3 className="font-serif text-[24px] sm:text-[30px] font-normal tracking-[-0.6px] text-[var(--ink)]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-[13px] font-sans text-[var(--slate)] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Grid: Donut Chart (Col 1) + Smooth Line Graph (Col 2) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 1. Animated Donut Chart Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-[20px] bg-[var(--canvas)]/90 backdrop-blur-xl border border-[var(--border)] p-6 shadow-xs lg:col-span-5 flex flex-col justify-between relative overflow-hidden transition-colors"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-500" />
              <span className="font-sans font-medium text-[13px] text-[var(--ink)]">
                Response Quality Breakdown
              </span>
            </div>
            <span className="rounded-full bg-[var(--mist)] px-2.5 py-0.5 text-[11px] font-mono text-[var(--slate)] border border-[var(--border)]">
              Automated OCR
            </span>
          </div>

          {/* Donut Visualization + Central Dynamic Metric */}
          <div className="relative my-6 flex items-center justify-center">
            <svg
              className="w-48 h-48 -rotate-90 transform overflow-visible"
              viewBox="0 0 160 160"
            >
              {/* Background circle track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[var(--mist)] fill-none"
                strokeWidth="14"
              />

              {/* Animated Donut Slices */}
              {(() => {
                let cumulativePct = 0;
                return donutData.map((seg, i) => {
                  const strokeDash = (seg.pct / 100) * circumference;
                  const strokeOffset = (cumulativePct / 100) * circumference;
                  cumulativePct += seg.pct;

                  if (seg.pct <= 0) return null;

                  const isHovered = hoveredSegment === i;

                  return (
                    <motion.circle
                      key={seg.label}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={isHovered ? 18 : 14}
                      strokeDasharray={`${strokeDash} ${circumference}`}
                      strokeDashoffset={-strokeOffset}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{
                        strokeDasharray: `${strokeDash} ${circumference}`,
                      }}
                      transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                      onMouseEnter={() => setHoveredSegment(i)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    />
                  );
                });
              })()}
            </svg>

            {/* Central Metric Readout */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              {hoveredSegment !== null ? (
                <motion.div
                  key={hoveredSegment}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="font-serif text-[28px] font-normal text-[var(--ink)]">
                    {donutData[hoveredSegment]?.pct}%
                  </span>
                  <span className="block text-[11px] font-sans text-[var(--slate)] max-w-[100px] truncate">
                    {donutData[hoveredSegment]?.label}
                  </span>
                </motion.div>
              ) : (
                <div>
                  <span className="font-serif text-[32px] font-normal tracking-tight text-[var(--ink)]">
                    {donutData[0]?.pct || 54}%
                  </span>
                  <span className="block text-[11px] font-sans text-[var(--slate)]">
                    Full Mastery
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            {donutData.map((item, idx) => (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredSegment(idx)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center justify-between text-[12px] font-sans px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  hoveredSegment === idx ? "bg-[var(--mist)] text-[var(--ink)]" : "text-[var(--slate)] hover:bg-[var(--mist)]/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-[var(--ink)]">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[var(--slate)]">{item.count} items</span>
                  <span className="font-medium text-[var(--ink)]">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2. Silky Smooth Line Graph Card (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="rounded-[20px] bg-[var(--canvas)]/90 backdrop-blur-xl border border-[var(--border)] p-6 shadow-xs lg:col-span-7 flex flex-col justify-between relative overflow-hidden transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <span className="font-sans font-medium text-[13px] text-[var(--ink)]">
                Historical Cohort Performance Trajectory
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-sans text-[var(--slate)]">Live Curve</span>
            </div>
          </div>

          {/* Smooth SVG Line Chart Canvas */}
          <div className="relative my-4 w-full">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id={`areaGradient-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
                  <stop offset="70%" stopColor="#6366f1" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={`lineStroke-${chartId}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid Guidelines */}
              {[100, 75, 50, 25].map((val) => {
                const y = height - paddingY - (val / 100) * innerHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-[var(--border)]"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-[var(--slate)] text-[10px] font-mono"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Area Gradient Fill */}
              {areaPath && (
                <motion.path
                  d={areaPath}
                  fill={`url(#areaGradient-${chartId})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
              )}

              {/* Smooth Bezier Line with Drawing In Animation */}
              {linePath && (
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke={`url(#lineStroke-${chartId})`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}

              {/* Active Crosshair Line on Node Hover */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={paddingY}
                  x2={hoveredPoint.x}
                  y2={height - paddingY}
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="opacity-70 pointer-events-none"
                />
              )}

              {/* Interactive Data Nodes */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.id === pt.id;
                return (
                  <g
                    key={pt.id}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    {/* Invisible larger hit target */}
                    <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                    {/* Outer glowing halo on hover */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        className="fill-cyan-400/30 animate-ping"
                      />
                    )}

                    {/* Node circle */}
                    <motion.circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4.5}
                      fill={isHovered ? "#06b6d4" : "var(--canvas)"}
                      stroke={isHovered ? "#ffffff" : "#8b5cf6"}
                      strokeWidth="2.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                    />

                    {/* X-axis date labels */}
                    <text
                      x={pt.x}
                      y={height - paddingY + 18}
                      textAnchor="middle"
                      className="fill-[var(--slate)] text-[10px] font-sans"
                    >
                      {pt.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Popup */}
            <AnimatePresence>
              {hoveredPoint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: `${(hoveredPoint.y / height) * 100 - 32}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                  className="pointer-events-none absolute z-30 min-w-[150px] rounded-[14px] bg-[var(--ink)] text-[var(--canvas)] p-3 shadow-steep-artifact text-left border border-[var(--border)]"
                >
                  <p className="font-serif text-[13px] font-normal">{hoveredPoint.subTitle}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-sans opacity-85">
                    <span>{hoveredPoint.label}</span>
                    <span className="font-mono text-cyan-300 font-semibold">{hoveredPoint.score}%</span>
                  </div>
                  <span className="mt-1 inline-block rounded-full bg-[var(--canvas)]/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    {hoveredPoint.grade}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Highlights */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-[12px] font-sans text-[var(--slate)]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Continuous Multimodal Tracking
            </span>
            <span className="font-mono text-[var(--ink)] font-medium">
              Peak: 90% · Avg: 75.2%
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
