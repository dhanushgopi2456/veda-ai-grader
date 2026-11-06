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

    // Listen for system theme preferences
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

    // Multi-layered fluid wave parameters based on 21st.dev Gradient Wave reference
    const waves: WaveConfig[] = [
      {
        frequency: 0.0016,
        speed: 0.007,
        amplitude: 65,
        phase: 0,
        verticalOffset: 0.48,
        harmonicFreq: 0.0009,
        harmonicAmp: 25,
      },
      {
        frequency: 0.0022,
        speed: 0.011,
        amplitude: 50,
        phase: 1.9,
        verticalOffset: 0.58,
        harmonicFreq: 0.0012,
        harmonicAmp: 20,
      },
      {
        frequency: 0.0014,
        speed: 0.006,
        amplitude: 75,
        phase: 3.5,
        verticalOffset: 0.68,
        harmonicFreq: 0.0007,
        harmonicAmp: 30,
      },
      {
        frequency: 0.0028,
        speed: 0.014,
        amplitude: 40,
        phase: 5.1,
        verticalOffset: 0.76,
        harmonicFreq: 0.0015,
        harmonicAmp: 16,
      },
    ];

    let time = 0;

    const render = () => {
      time += prefersReducedMotion ? 0 : 1;

      // Smooth cursor spring damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains("dark");

      // 1. Atmospheric Ambient Radial Glow Bloom
      const glowX = width * (0.35 + (mouseRef.current.x - 0.5) * 0.2);
      const glowY = height * (0.42 + (mouseRef.current.y - 0.5) * 0.2);
      const bgGrad = ctx.createRadialGradient(
        glowX,
        glowY,
        width * 0.05,
        glowX,
        glowY,
        width * 0.75
      );

      if (dark) {
        // Deep obsidian luxury: Electric blue (#0033FF) and royal violet blooms
        bgGrad.addColorStop(0, "rgba(0, 51, 255, 0.16)");
        bgGrad.addColorStop(0.35, "rgba(99, 102, 241, 0.10)");
        bgGrad.addColorStop(0.7, "rgba(139, 92, 246, 0.04)");
        bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        // Calm editorial daylight: Soft airy electric blue tint and warm peach mist
        bgGrad.addColorStop(0, "rgba(0, 51, 255, 0.045)");
        bgGrad.addColorStop(0.3, "rgba(99, 102, 241, 0.035)");
        bgGrad.addColorStop(0.65, "rgba(251, 225, 209, 0.18)");
        bgGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render each overlapping fluid wave ribbon
      waves.forEach((wave, idx) => {
        const baseY = height * wave.verticalOffset + (mouseRef.current.y - 0.5) * 45;
        const currentPhase = wave.phase + time * wave.speed;

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseY);

        const step = Math.max(5, Math.floor(width / 140));
        for (let x = 0; x <= width + step; x += step) {
          const normalizedX = x / width;
          const mouseDist = Math.abs(normalizedX - mouseRef.current.x);
          const mouseFactor = Math.max(0, 1 - mouseDist * 2.8) * (mouseRef.current.y - 0.5) * 30;

          // Multi-harmonic sinusoidal wave equation
          const y =
            baseY +
            Math.sin(x * wave.frequency + currentPhase) * wave.amplitude +
            Math.cos(x * wave.harmonicFreq - currentPhase * 0.75) * wave.harmonicAmp +
            Math.sin(x * 0.0005 + time * 0.003) * 12 +
            mouseFactor;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Dynamic multi-stop gradient fill matching 21st.dev color palette
        const waveGrad = ctx.createLinearGradient(0, baseY - wave.amplitude, width, height);

        if (dark) {
          if (idx === 0) {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.25)");
            waveGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.22)");
            waveGrad.addColorStop(1, "rgba(18, 19, 22, 0.08)");
          } else if (idx === 1) {
            waveGrad.addColorStop(0, "rgba(59, 130, 246, 0.22)");
            waveGrad.addColorStop(0.5, "rgba(147, 51, 234, 0.20)");
            waveGrad.addColorStop(1, "rgba(99, 102, 241, 0.06)");
          } else if (idx === 2) {
            waveGrad.addColorStop(0, "rgba(6, 182, 212, 0.20)");
            waveGrad.addColorStop(0.55, "rgba(79, 70, 229, 0.24)");
            waveGrad.addColorStop(1, "rgba(168, 85, 247, 0.08)");
          } else {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.30)");
            waveGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.26)");
            waveGrad.addColorStop(1, "rgba(9, 9, 11, 0.15)");
          }
        } else {
          if (idx === 0) {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.065)");
            waveGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.07)");
            waveGrad.addColorStop(1, "rgba(255, 255, 255, 0.01)");
          } else if (idx === 1) {
            waveGrad.addColorStop(0, "rgba(56, 189, 248, 0.075)");
            waveGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.06)");
            waveGrad.addColorStop(1, "rgba(251, 225, 209, 0.10)");
          } else if (idx === 2) {
            waveGrad.addColorStop(0, "rgba(14, 165, 233, 0.065)");
            waveGrad.addColorStop(0.55, "rgba(99, 102, 241, 0.07)");
            waveGrad.addColorStop(1, "rgba(244, 114, 182, 0.04)");
          } else {
            waveGrad.addColorStop(0, "rgba(0, 51, 255, 0.085)");
            waveGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.08)");
            waveGrad.addColorStop(1, "rgba(242, 242, 243, 0.06)");
          }
        }

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // 3. Glowing contour crest line
        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          const normalizedX = x / width;
          const mouseDist = Math.abs(normalizedX - mouseRef.current.x);
          const mouseFactor = Math.max(0, 1 - mouseDist * 2.8) * (mouseRef.current.y - 0.5) * 30;

          const y =
            baseY +
            Math.sin(x * wave.frequency + currentPhase) * wave.amplitude +
            Math.cos(x * wave.harmonicFreq - currentPhase * 0.75) * wave.harmonicAmp +
            Math.sin(x * 0.0005 + time * 0.003) * 12 +
            mouseFactor;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineWidth = dark ? (idx === 3 ? 1.5 : 1) : 1;
        ctx.strokeStyle = dark
          ? idx === 3
            ? "rgba(147, 197, 253, 0.45)"
            : idx === 2
              ? "rgba(165, 180, 252, 0.30)"
              : "rgba(99, 102, 241, 0.24)"
          : idx === 3
            ? "rgba(0, 51, 255, 0.18)"
            : idx === 2
              ? "rgba(99, 102, 241, 0.15)"
              : "rgba(168, 85, 247, 0.12)";
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
