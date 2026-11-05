"use client";

import { useEffect, useRef } from "react";

interface Props {
  variant?: "hero" | "subtle" | "auth";
}

export default function CinematicBackground({ variant = "hero" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes for neural graph
    const particleCount = variant === "hero" ? 45 : variant === "auth" ? 30 : 20;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }[] = [];

    const colors = [
      "rgba(99, 102, 241, ", // Indigo
      "rgba(56, 189, 248, ", // Cyan/Electric Blue
      "rgba(244, 81, 30, ",  // Veda Orange
      "rgba(168, 85, 247, ", // Violet
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle neural connecting links
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse gentle repel/attract
        const dxM = mouseX - p1.x;
        const dyM = mouseY - p1.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < 160) {
          p1.x -= (dxM / distM) * 0.6;
          p1.y -= (dyM / distM) * 0.6;
        }

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const linkAlpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${p1.alpha})`;
        ctx.shadowColor = p1.color + "0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050711]">
      {/* Aurora Mesh Glows */}
      <div className="absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full bg-gradient-to-br from-indigo-900/25 via-blue-900/15 to-transparent blur-[120px] will-change-transform animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute top-[30%] -right-[15%] h-[60vw] w-[60vw] rounded-full bg-gradient-to-bl from-purple-900/20 via-orange-950/15 to-transparent blur-[140px] will-change-transform animate-[pulse_14s_ease-in-out_infinite_2s]" />
      <div className="absolute -bottom-[20%] left-[20%] h-[50vw] w-[50vw] rounded-full bg-gradient-to-t from-cyan-950/20 via-indigo-950/20 to-transparent blur-[130px] will-change-transform" />

      {/* Cybernetic Isometric Dot/Grid Matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-80" />

      {/* Live Canvas for floating neural particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />

      {/* Subtle Noise Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,17,0.7)_100%)]" />
    </div>
  );
}

