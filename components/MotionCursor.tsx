"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  isDrag: boolean;
  colorIndex: number;
}

const GRADIENT_PALETTES = [
  "from-cyan-400 via-fuchsia-500 to-amber-400",
  "from-violet-500 via-cyan-400 to-pink-500",
  "from-amber-400 via-rose-500 to-indigo-500",
  "from-emerald-400 via-teal-500 to-cyan-400",
];

export default function MotionCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  // Raw cursor position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for inner crisp focal dot
  const dotSpringX = useSpring(mouseX, { stiffness: 1400, damping: 65, mass: 0.1 });
  const dotSpringY = useSpring(mouseY, { stiffness: 1400, damping: 65, mass: 0.1 });

  // Weightless fluid spring for trailing halo ring
  const haloSpringX = useSpring(mouseX, { stiffness: 350, damping: 28, mass: 0.45 });
  const haloSpringY = useSpring(mouseY, { stiffness: 350, damping: 28, mass: 0.45 });

  // Velocity-driven deformation
  const [angle, setAngle] = useState(0);
  const [speedScale, setSpeedScale] = useState(1);
  const [velocityMagnitude, setVelocityMagnitude] = useState(0);
  const lastPos = useRef({ x: 0, y: 0, time: 0 });
  const trailIdCounter = useRef(0);
  const isMouseDownRef = useRef(false);
  const lastTrailEmitTime = useRef(0);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      setVelocityMagnitude(velocity);

      // Velocity stretching & directional rotation
      if (dist > 2) {
        const rad = Math.atan2(dy, dx);
        setAngle(rad * (180 / Math.PI));
        // Subtle stretch proportional to speed, clamped to [1, 1.55]
        const stretch = Math.min(1.55, 1 + velocity * 0.18);
        setSpeedScale(stretch);
      } else {
        setSpeedScale(1);
      }

      // Continuous gradient motion trail (emitted while moving)
      const isDragging = isMouseDownRef.current;
      const minDistance = isDragging ? 6 : 14;
      const timeSinceLastEmit = now - lastTrailEmitTime.current;

      if (dist > minDistance && timeSinceLastEmit > 28) {
        lastTrailEmitTime.current = now;
        const newPoint: TrailPoint = {
          id: ++trailIdCounter.current,
          x: e.clientX,
          y: e.clientY,
          angle: Math.atan2(dy, dx) * (180 / Math.PI),
          isDrag: isDragging,
          colorIndex: trailIdCounter.current % GRADIENT_PALETTES.length,
        };
        setTrail((prev) => [...prev.slice(-12), newPoint]);
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

    // Global click listener: when clicking any button, link, or actionable element,
    // trigger the futuristic loading animated cursor state!
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isClickable = target.closest(
        'button, a, input[type="submit"], input[type="button"], [role="button"], [role="tab"], [role="switch"], .cursor-pointer'
      );

      if (isClickable) {
        setIsLoading(true);
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 850);
      }
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

    // Custom window events for programmatic loading state
    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => setIsLoading(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("veda-cursor-loading-start", handleStartLoading);
    window.addEventListener("veda-cursor-loading-stop", handleStopLoading);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("veda-cursor-loading-start", handleStartLoading);
      window.removeEventListener("veda-cursor-loading-stop", handleStopLoading);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [mouseX, mouseY, isVisible]);

  // Clean up movement trail points periodically with graceful fade
  useEffect(() => {
    if (trail.length === 0) return;
    const timer = setTimeout(() => {
      setTrail((prev) => prev.slice(1));
    }, 110);
    return () => clearTimeout(timer);
  }, [trail]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* 1. Fluid Gradient Movement & Drag Trails */}
      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            initial={{
              opacity: point.isDrag ? 0.85 : 0.5,
              scale: point.isDrag ? 0.9 : 0.6,
            }}
            animate={{
              opacity: 0,
              scale: point.isDrag ? 2.4 : 1.7,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: point.isDrag ? 0.45 : 0.32, ease: "easeOut" }}
            style={{
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute rounded-full blur-[2px] ${
              point.isDrag
                ? "h-6 w-6 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 shadow-[0_0_14px_rgba(217,70,239,0.6)]"
                : "h-4 w-4 bg-gradient-to-r from-violet-500/50 via-cyan-400/50 to-pink-500/50"
            }`}
          />
        ))}
      </AnimatePresence>

      {/* 2. Ambient Gradient Glow Aura that Breathes with Velocity */}
      <motion.div
        style={{
          x: haloSpringX,
          y: haloSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute will-change-transform flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            scale: isLoading
              ? 1.9
              : isMouseDown
              ? 1.7
              : isHovered
              ? 1.8
              : 1 + Math.min(0.65, velocityMagnitude * 0.16),
            opacity: isVisible
              ? isLoading
                ? 0.85
                : isMouseDown
                ? 0.75
                : isHovered
                ? 0.6
                : 0.35
              : 0,
          }}
          transition={{ duration: 0.2 }}
          className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-500/35 via-fuchsia-500/35 to-amber-500/35 blur-lg dark:from-cyan-400/45 dark:via-purple-500/45 dark:to-pink-500/45"
        />
      </motion.div>

      {/* 3. Smooth Trailing Halo Ring with Shifting Prismatic Gradient / Loading State */}
      <motion.div
        style={{
          x: haloSpringX,
          y: haloSpringY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: isLoading ? 0 : angle,
          scaleX: isLoading ? 1 : isMouseDown ? 0.75 : speedScale,
          scaleY: isLoading ? 1 : isMouseDown ? 0.75 : 1 / Math.sqrt(speedScale),
        }}
        className="absolute will-change-transform flex items-center justify-center pointer-events-none"
      >
        {/* If in Loading State: Show futuristic glowing orbital spinner */}
        {isLoading ? (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            className="relative flex items-center justify-center"
          >
            {/* Outer rapid dashed spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="h-10 w-10 rounded-full border-2 border-dashed border-cyan-400 border-t-fuchsia-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            />
            {/* Counter-rotating inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute h-6 w-6 rounded-full border-2 border-dotted border-amber-400 border-b-cyan-300"
            />
            {/* Center spinning core */}
            <span className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          </motion.div>
        ) : (
          /* Normal / Hover Mode: Rotating Conic Gradient Border Track */
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                width: isHovered ? 48 : 30,
                height: isHovered ? 48 : 30,
              }}
              className="absolute rounded-full p-[1.5px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 via-amber-400 to-blue-500 opacity-90 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              <div className="h-full w-full rounded-full bg-[var(--canvas)]/70 dark:bg-black/60 backdrop-blur-[2px]" />
            </motion.div>

            {/* Inner Interactive Lens Fill */}
            <motion.div
              animate={{
                width: isHovered ? 44 : 26,
                height: isHovered ? 44 : 26,
                opacity: isVisible ? 1 : 0,
                scale: isHovered ? 1.1 : isMouseDown ? 0.8 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 30,
                mass: 0.2,
              }}
              className={`rounded-full transition-colors duration-150 ${
                isHovered
                  ? "bg-gradient-to-tr from-cyan-500/10 via-purple-500/15 to-pink-500/10 backdrop-blur-[3px] border border-white/40 dark:border-white/50"
                  : isMouseDown
                  ? "bg-gradient-to-tr from-fuchsia-500/30 via-cyan-500/30 to-amber-500/30 border border-white/60"
                  : "bg-transparent border border-transparent"
              }`}
            />
          </div>
        )}
      </motion.div>

      {/* 4. Ultra-responsive Center Focal Dot with Vibrant Gradient Core */}
      {!isLoading && (
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
              scale: isMouseDown ? 0.6 : isHovered ? 1.6 : 1,
              opacity: isVisible ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 35,
            }}
            className={`rounded-full shadow-[0_0_8px_rgba(236,72,153,0.6)] ${
              isHovered
                ? "h-2.5 w-2.5 bg-gradient-to-tr from-cyan-400 via-fuchsia-400 to-amber-300 ring-2 ring-white/80 dark:ring-white/90"
                : isMouseDown
                ? "h-2 w-2 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400"
                : "h-2 w-2 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 ring-1 ring-white/60 dark:ring-black/60"
            }`}
          />
        </motion.div>
      )}
    </div>
  );
}
