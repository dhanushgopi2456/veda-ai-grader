"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export default function MotionCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  // Raw cursor position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for inner crisp focal dot
  const dotSpringX = useSpring(mouseX, { stiffness: 1200, damping: 60, mass: 0.1 });
  const dotSpringY = useSpring(mouseY, { stiffness: 1200, damping: 60, mass: 0.1 });

  // Weightless fluid spring for trailing halo ring
  const haloSpringX = useSpring(mouseX, { stiffness: 320, damping: 26, mass: 0.45 });
  const haloSpringY = useSpring(mouseY, { stiffness: 320, damping: 26, mass: 0.45 });

  // Velocity-driven deformation
  const [angle, setAngle] = useState(0);
  const [speedScale, setSpeedScale] = useState(1);
  const lastPos = useRef({ x: 0, y: 0, time: 0 });
  const trailIdCounter = useRef(0);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // Only run on desktop/fine pointers and respect prefers-reduced-motion
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      const dt = Math.max(1, now - lastPos.current.time);
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);
      const velocity = dist / dt;

      // Velocity stretching & directional rotation
      if (dist > 3) {
        const rad = Math.atan2(dy, dx);
        setAngle(rad * (180 / Math.PI));
        // Subtle stretch proportional to speed, clamped to [1, 1.45]
        const stretch = Math.min(1.45, 1 + velocity * 0.12);
        setSpeedScale(stretch);
      } else {
        setSpeedScale(1);
      }

      // Drag / movement trail effect when dragging or moving rapidly
      if (isMouseDownRef.current && dist > 12) {
        const newPoint: TrailPoint = {
          id: ++trailIdCounter.current,
          x: e.clientX,
          y: e.clientY,
          angle: Math.atan2(dy, dx) * (180 / Math.PI),
        };
        setTrail((prev) => [...prev.slice(-6), newPoint]);
      }

      lastPos.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      isMouseDownRef.current = false;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect clickable/interactive hover targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [role="tab"], [role="switch"], [tabindex], label, summary, .cursor-pointer'
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Clean up drag trail points periodically
  useEffect(() => {
    if (trail.length === 0) return;
    const timer = setTimeout(() => {
      setTrail((prev) => prev.slice(1));
    }, 180);
    return () => clearTimeout(timer);
  }, [trail]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Dragging Motion Particle Ripples */}
      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.55, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute h-5 w-5 rounded-full border border-[var(--ink)]/30 dark:border-white/40 bg-[var(--ink)]/5 dark:bg-white/10 blur-[1px]"
          />
        ))}
      </AnimatePresence>

      {/* Smooth Trailing Halo Ring with Cult UI Glassmorphic Rim */}
      <motion.div
        style={{
          x: haloSpringX,
          y: haloSpringY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: angle,
          scaleX: isMouseDown ? 0.75 : speedScale,
          scaleY: isMouseDown ? 0.75 : 1 / Math.sqrt(speedScale),
        }}
        className="absolute will-change-transform flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            width: isHovered ? 44 : 26,
            height: isHovered ? 44 : 26,
            opacity: isVisible ? 1 : 0,
            scale: isHovered ? 1.15 : isMouseDown ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 30,
            mass: 0.2,
          }}
          className={`rounded-full transition-colors duration-150 ${
            isHovered
              ? "border border-[var(--ink)]/40 dark:border-white/60 bg-[var(--ink)]/10 dark:bg-white/15 backdrop-blur-[2px] shadow-[0_0_12px_rgba(0,0,0,0.08)] dark:shadow-[0_0_16px_rgba(255,255,255,0.18)]"
              : isMouseDown
              ? "border-2 border-[var(--ink)]/60 dark:border-white/80 bg-[var(--ink)]/20 dark:bg-white/25 shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.25)]"
              : "border border-[var(--ink)]/25 dark:border-white/40 bg-[var(--ink)]/[0.03] dark:bg-white/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_6px_rgba(255,255,255,0.08)]"
          }`}
        />
      </motion.div>

      {/* Ultra-responsive Center Focal Dot */}
      <motion.div
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute will-change-transform flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            scale: isMouseDown ? 0.6 : isHovered ? 1.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 35,
          }}
          className={`rounded-full transition-colors duration-150 ${
            isHovered
              ? "h-2 w-2 bg-[var(--ink)] dark:bg-white shadow-[0_0_6px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              : isMouseDown
              ? "h-1.5 w-1.5 bg-[var(--ink)] dark:bg-white"
              : "h-1.5 w-1.5 bg-[var(--ink)]/80 dark:bg-white/90"
          }`}
        />
      </motion.div>
    </div>
  );
}
