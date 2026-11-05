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

    // Dynamic particle network with vibrant neon cores
    const particleCount = variant === "hero" ? 75 : variant === "auth" ? 45 : 30;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    const colors = [
      "rgba(99, 102, 241, ", // Indigo
      "rgba(56, 189, 248, ", // Cyan/Electric Blue
      "rgba(244, 81, 30, ",  // Veda Orange
      "rgba(168, 85, 247, ", // Violet
      "rgba(52, 211, 153, ", // Emerald Green
      "rgba(251, 191, 36, ", // Amber Gold
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
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
      mouseX += (targetMouseX - mouseX) * 0.07;
      mouseY += (targetMouseY - mouseY) * 0.07;

      ctx.clearRect(0, 0, width, height);

      // Interactive cursor volumetric spotlight
      const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 320);
      grad.addColorStop(0, "rgba(99, 102, 241, 0.12)");
      grad.addColorStop(0.4, "rgba(244, 81, 30, 0.06)");
      grad.addColorStop(0.8, "rgba(168, 85, 247, 0.03)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw neural connections between nodes
      const maxDist = 150;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.pulse += p1.pulseSpeed;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Interactive mouse gentle push
        const dxM = mouseX - p1.x;
        const dyM = mouseY - p1.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < 200) {
          p1.x -= (dxM / distM) * 0.85;
          p1.y -= (dyM / distM) * 0.85;
        }

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const linkAlpha = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${linkAlpha})`;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }
        }

        // Draw particle node with pulsing glow
        const currentRadius = p1.radius + Math.sin(p1.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${p1.alpha})`;
        ctx.shadowColor = p1.color + "1)";
        ctx.shadowBlur = 12;
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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#04060e]">
      {/* Dynamic Aurora Mesh Glows */}
      <div className="absolute -top-[25%] -left-[10%] h-[75vw] w-[75vw] rounded-full bg-gradient-to-br from-indigo-900/40 via-blue-900/25 to-transparent blur-[130px] will-change-transform animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute top-[20%] -right-[15%] h-[70vw] w-[70vw] rounded-full bg-gradient-to-bl from-purple-900/35 via-orange-950/30 to-transparent blur-[140px] will-change-transform animate-[pulse_13s_ease-in-out_infinite_2s]" />
      <div className="absolute -bottom-[20%] left-[15%] h-[65vw] w-[65vw] rounded-full bg-gradient-to-t from-cyan-950/35 via-indigo-950/30 to-transparent blur-[140px] will-change-transform animate-[pulse_15s_ease-in-out_infinite_4s]" />

      {/* Cinematic Diagonal Light Rays */}
      <div className="absolute -top-[50%] left-[18%] h-[200%] w-[140px] bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent blur-2xl anim-laser-ray" />
      <div className="absolute -top-[40%] right-[22%] h-[200%] w-[110px] bg-gradient-to-b from-transparent via-orange-500/15 to-transparent blur-2xl anim-laser-ray [animation-delay:3.8s]" />
      <div className="absolute -top-[30%] left-[55%] h-[200%] w-[80px] bg-gradient-to-b from-transparent via-purple-500/15 to-transparent blur-2xl anim-laser-ray [animation-delay:6s]" />

      {/* Cybernetic Isometric Dot/Grid Matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_35%,#000_75%,transparent_100%)] opacity-90" />

      {/* Horizon Laser Scan Grid Line */}
      <div className="absolute top-[32%] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent shadow-[0_0_20px_#22d3ee]" />

      {/* Live Canvas for floating neural particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />

      {/* Center Spotlight Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,transparent_0%,rgba(4,6,14,0.72)_100%)]" />
    </div>
  );
}
