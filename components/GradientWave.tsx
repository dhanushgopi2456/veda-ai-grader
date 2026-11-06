"use client";

import React, { useEffect, useRef, useState } from "react";

interface WaveConfig {
  frequency: number;
  speed: number;
  amplitude: number;
  phase: number;
  verticalOffset: number;
  harmonicFreq: number;
  harmonicAmp: number;
}

export default function GradientWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDark, setIsDark] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check initial theme state
    const checkTheme = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        (!localStorage.getItem("veda.settings.v1") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(dark);
    };

    checkTheme();

    // Listen for dark class mutations on <html>
    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => checkTheme();
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / width;
      mouseRef.current.targetY = e.clientY / height;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Multi-layered fluid wave parameters: high visibility, energetic amplitudes, organic movement
    const waves: WaveConfig[] = [
      {
        frequency: 0.0018,
        speed: 0.016,
        amplitude: 90,
        phase: 0,
        verticalOffset: 0.30,
        harmonicFreq: 0.0009,
        harmonicAmp: 40,
      },
      {
        frequency: 0.0024,
        speed: 0.022,
        amplitude: 105,
        phase: 2.1,
        verticalOffset: 0.44,
        harmonicFreq: 0.0013,
        harmonicAmp: 36,
      },
      {
        frequency: 0.0015,
        speed: 0.014,
        amplitude: 95,
        phase: 3.8,
        verticalOffset: 0.58,
        harmonicFreq: 0.0008,
        harmonicAmp: 44,
      },
      {
        frequency: 0.0030,
        speed: 0.025,
        amplitude: 80,
        phase: 5.2,
        verticalOffset: 0.70,
        harmonicFreq: 0.0016,
        harmonicAmp: 32,
      },
    ];

    let time = 0;

    const render = () => {
      time += prefersReducedMotion ? 0 : 1;

      // Smooth cursor spring damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains("dark");

      // 1. Atmospheric Ambient Radial Glow Bloom (More luminous in light mode)
      const glowX = width * (0.35 + (mouseRef.current.x - 0.5) * 0.25);
      const glowY = height * (0.38 + (mouseRef.current.y - 0.5) * 0.25);
      const bgGrad = ctx.createRadialGradient(
        glowX,
        glowY,
        width * 0.06,
        glowX,
        glowY,
        width * 0.8
      );

      if (dark) {
        // Deep obsidian luxury: Electric blue (#0033FF) and royal violet blooms
        bgGrad.addColorStop(0, "rgba(0, 51, 255, 0.22)");
        bgGrad.addColorStop(0.35, "rgba(99, 102, 241, 0.15)");
        bgGrad.addColorStop(0.7, "rgba(139, 92, 246, 0.06)");
        bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        // Vibrant daylight mode: Clear electric blue (#0033FF), iris violet, and blush peach blooms
        bgGrad.addColorStop(0, "rgba(0, 51, 255, 0.14)");
        bgGrad.addColorStop(0.35, "rgba(99, 102, 241, 0.11)");
        bgGrad.addColorStop(0.68, "rgba(251, 146, 60, 0.09)");
        bgGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render each overlapping fluid wave ribbon
      waves.forEach((wave, idx) => {
        const baseY = height * wave.verticalOffset + (mouseRef.current.y - 0.5) * 50;
        const currentPhase = wave.phase + time * wave.speed;

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseY);

        const step = Math.max(4, Math.floor(width / 160));
        for (let x = 0; x <= width + step; x += step) {
          const normalizedX = x / width;
          const mouseDist = Math.abs(normalizedX - mouseRef.current.x);
          const mouseFactor = Math.max(0, 1 - mouseDist * 2.5) * (mouseRef.current.y - 0.5) * 40;

          // Multi-harmonic sinusoidal wave equation
          const y =
            baseY +
            Math.sin(x * wave.frequency + currentPhase) * wave.amplitude +
            Math.cos(x * wave.harmonicFreq - currentPhase * 0.75) * wave.harmonicAmp +
            Math.sin(x * 0.0006 + time * 0.008) * 18 +
            mouseFactor;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Dynamic multi-stop gradient fill matching 21st.dev color palette
        const waveGrad = ctx.createLinearGradient(0, baseY - wave.amplitude, width, height);

        if (dark) {
          if (idx === 0) {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.32)");
            waveGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.28)");
            waveGrad.addColorStop(1, "rgba(18, 19, 22, 0.10)");
          } else if (idx === 1) {
            waveGrad.addColorStop(0, "rgba(59, 130, 246, 0.28)");
            waveGrad.addColorStop(0.5, "rgba(147, 51, 234, 0.26)");
            waveGrad.addColorStop(1, "rgba(99, 102, 241, 0.08)");
          } else if (idx === 2) {
            waveGrad.addColorStop(0, "rgba(6, 182, 212, 0.26)");
            waveGrad.addColorStop(0.55, "rgba(79, 70, 229, 0.30)");
            waveGrad.addColorStop(1, "rgba(168, 85, 247, 0.10)");
          } else {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.38)");
            waveGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.34)");
            waveGrad.addColorStop(1, "rgba(9, 9, 11, 0.20)");
          }
        } else {
          // Much more visible and vibrant in light mode while staying comfortable
          if (idx === 0) {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.20)");
            waveGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.18)");
            waveGrad.addColorStop(1, "rgba(255, 255, 255, 0.02)");
          } else if (idx === 1) {
            waveGrad.addColorStop(0, "rgba(14, 165, 233, 0.22)");
            waveGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.18)");
            waveGrad.addColorStop(1, "rgba(251, 225, 209, 0.16)");
          } else if (idx === 2) {
            waveGrad.addColorStop(0, "rgba(6, 182, 212, 0.20)");
            waveGrad.addColorStop(0.55, "rgba(99, 102, 241, 0.22)");
            waveGrad.addColorStop(1, "rgba(244, 63, 94, 0.14)");
          } else {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.25)");
            waveGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.22)");
            waveGrad.addColorStop(1, "rgba(242, 242, 243, 0.12)");
          }
        }

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // 3. Clear, luminous crest contour line
        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          const normalizedX = x / width;
          const mouseDist = Math.abs(normalizedX - mouseRef.current.x);
          const mouseFactor = Math.max(0, 1 - mouseDist * 2.5) * (mouseRef.current.y - 0.5) * 40;

          const y =
            baseY +
            Math.sin(x * wave.frequency + currentPhase) * wave.amplitude +
            Math.cos(x * wave.harmonicFreq - currentPhase * 0.75) * wave.harmonicAmp +
            Math.sin(x * 0.0006 + time * 0.008) * 18 +
            mouseFactor;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineWidth = dark ? (idx === 3 ? 2 : 1.5) : (idx === 3 ? 2.2 : 1.5);
        ctx.strokeStyle = dark
          ? idx === 3
            ? "rgba(147, 197, 253, 0.65)"
            : idx === 2
              ? "rgba(165, 180, 252, 0.45)"
              : "rgba(99, 102, 241, 0.35)"
          : idx === 3
            ? "rgba(0, 51, 255, 0.45)"
            : idx === 2
              ? "rgba(99, 102, 241, 0.38)"
              : "rgba(168, 85, 247, 0.30)";
        ctx.stroke();
      });

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-opacity duration-700"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-100 will-change-transform"
      />
    </div>
  );
}
