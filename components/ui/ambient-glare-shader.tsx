"use client";

import React, { useEffect, useRef, useState } from "react";

export interface AmbientGlareColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface AmbientGlareShaderProps {
  className?: string;
  radius?: number;
  playback?: boolean;
  duration?: number;
  pause?: number;
  loop?: boolean;
  direction?: "ltr" | "rtl";
  freezeAt?: number;
  glowWidth?: number;
  intensity?: number;
  softness?: number;
  edgeWear?: number;
  bow?: number;
  refraction?: number;
  dispersion?: number;
  depth?: number;
  ribbonWidth?: number;
  ribbonStrength?: number;
  ambient?: number;
  coolColor?: AmbientGlareColor;
  crestColor?: AmbientGlareColor;
  frontColor?: AmbientGlareColor;
}

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_progress;
uniform float u_glowWidth;
uniform float u_intensity;
uniform float u_softness;
uniform float u_refraction;
uniform float u_dispersion;
uniform float u_depth;
uniform float u_ambient;
uniform vec4 u_coolColor;
uniform vec4 u_crestColor;
uniform vec4 u_frontColor;

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 st = gl_FragCoord.xy;
  vec2 halfSize = u_resolution * 0.5;
  vec2 p = st - halfSize;

  float r = min(u_radius, min(halfSize.x, halfSize.y));
  float d = sdRoundedBox(p, halfSize, r);

  float borderAlpha = 1.0 - smoothstep(-1.0, 0.5, d);
  if (borderAlpha <= 0.005) {
    discard;
  }

  float ny = st.y / u_resolution.y;

  // Adaptive shape tracking: curve calculation near rounded boundaries
  float capZone = max(0.0, abs(p.x) - (halfSize.x - r)) / max(r, 0.001);
  float cornerCurve = sqrt(max(0.0, 1.0 - min(capZone, 1.0) * min(capZone, 1.0)));
  float verticalBow = (ny - 0.5) * (ny - 0.5) * 4.0;

  // Light front travel
  float totalTravel = u_resolution.x + u_glowWidth * 3.0;
  float frontX = u_progress * totalTravel - u_glowWidth * 1.5;

  // Front curve offset
  float distFromFront = st.x - frontX + verticalBow * (1.0 - cornerCurve) * 20.0;

  // Glare intensity with configurable softness
  float glare = exp(-pow(distFromFront / max(u_glowWidth, 1.0), 2.0) * (3.2 - u_softness * 2.0));

  // Edge ribbon & rim refraction
  float edgeDist = max(0.0, -d);
  float rimRibbon = exp(-edgeDist * edgeDist / (u_depth * 14.0 + 1.0));

  // Top specular bezel highlight
  float topEdge = smoothstep(1.5, 0.0, u_resolution.y - st.y) * 0.45;

  // Chromatic dispersion
  float disp = u_dispersion * 7.0;
  float glareR = exp(-pow((distFromFront + disp) / u_glowWidth, 2.0) * 3.0);
  float glareG = glare;
  float glareB = exp(-pow((distFromFront - disp) / u_glowWidth, 2.0) * 3.0);

  vec3 color = u_frontColor.rgb * glareG * u_frontColor.a;
  color += u_coolColor.rgb * glareB * u_coolColor.a * 0.85;
  color += u_crestColor.rgb * glareR * u_crestColor.a * 0.70;

  color += (u_crestColor.rgb + vec3(0.35)) * rimRibbon * glare * u_refraction * 1.6;
  color += vec3(1.0) * topEdge * (0.25 + glare * 0.75);
  color += u_coolColor.rgb * u_ambient;

  float finalAlpha = clamp(
    (glare * 0.95 + rimRibbon * glare * 0.45 + topEdge * 0.3 + u_ambient * 0.2) * u_intensity * borderAlpha,
    0.0,
    1.0
  );

  gl_FragColor = vec4(color, finalAlpha);
}
`;

export default function AmbientGlareShader({
  className = "absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden",
  radius = 9999,
  playback = true,
  duration = 2.2,
  pause = 1.8,
  loop = true,
  direction = "ltr",
  freezeAt = -1,
  glowWidth = 48,
  intensity = 1.15,
  softness = 0.7,
  edgeWear = 1.6,
  bow = 0,
  refraction = 0.6,
  dispersion = 0.5,
  depth = 0.7,
  ribbonWidth = 3,
  ribbonStrength = 1,
  ambient = 0.045,
  coolColor = { r: 0.0, g: 0.2, b: 1.0, a: 1.0 }, // #0033FF electric blue
  crestColor = { r: 0.5, g: 0.13, b: 0.99, a: 1.0 }, // #7F22FE violet
  frontColor = { r: 1.0, g: 0.96, b: 0.92, a: 1.0 }, // luminous white-gold
}: AmbientGlareShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Setup WebGL
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      // Graceful fallback for non-WebGL environments: draw a static subtle glare on 2D context
      const ctx2d = canvas.getContext("2d");
      if (ctx2d) {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    function createShader(type: number, src: string) {
      if (!gl) return null;
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    const vert = createShader(gl.VERTEX_SHADER, VERT_SRC);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return;
    }

    gl.useProgram(prog);

    // Full quad buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uRadius = gl.getUniformLocation(prog, "u_radius");
    const uProgress = gl.getUniformLocation(prog, "u_progress");
    const uGlowWidth = gl.getUniformLocation(prog, "u_glowWidth");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");
    const uSoftness = gl.getUniformLocation(prog, "u_softness");
    const uRefraction = gl.getUniformLocation(prog, "u_refraction");
    const uDispersion = gl.getUniformLocation(prog, "u_dispersion");
    const uDepth = gl.getUniformLocation(prog, "u_depth");
    const uAmbient = gl.getUniformLocation(prog, "u_ambient");
    const uCool = gl.getUniformLocation(prog, "u_coolColor");
    const uCrest = gl.getUniformLocation(prog, "u_crestColor");
    const uFront = gl.getUniformLocation(prog, "u_frontColor");

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Animation state
    const totalCycle = Math.max(0.1, duration + pause);
    let startTime = performance.now();

    const render = (now: number) => {
      if (!gl || !canvas) return;

      const elapsedSec = (now - startTime) / 1000;
      let rawT = (elapsedSec % totalCycle) / duration;

      let p = 0;
      if (freezeAt >= 0) {
        p = freezeAt;
      } else if (!playback || prefersReducedMotion) {
        p = 0.5; // subtle static ambient state
      } else if (rawT > 1.0) {
        // In pause window: keep glare parked offscreen
        p = direction === "ltr" ? 1.5 : -0.5;
      } else {
        // Smooth easing: cubic-bezier(0.23, 1, 0.32, 1) approximation
        const t = Math.min(Math.max(rawT, 0), 1);
        const ease = 1 - Math.pow(1 - t, 3.2);
        p = direction === "ltr" ? ease : 1 - ease;
      }

      gl.useProgram(prog);
      gl.uniform2f(uRes, width * dpr, height * dpr);
      gl.uniform1f(
        uRadius,
        radius === Infinity || radius > 500 ? (height * dpr) / 2 : radius * dpr
      );
      gl.uniform1f(uProgress, p);
      gl.uniform1f(uGlowWidth, glowWidth * dpr);
      gl.uniform1f(uIntensity, intensity);
      gl.uniform1f(uSoftness, softness);
      gl.uniform1f(uRefraction, refraction);
      gl.uniform1f(uDispersion, dispersion);
      gl.uniform1f(uDepth, depth);
      gl.uniform1f(uAmbient, ambient);

      gl.uniform4f(uCool, coolColor.r, coolColor.g, coolColor.b, coolColor.a);
      gl.uniform4f(
        uCrest,
        crestColor.r,
        crestColor.g,
        crestColor.b,
        crestColor.a
      );
      gl.uniform4f(
        uFront,
        frontColor.r,
        frontColor.g,
        frontColor.b,
        frontColor.a
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (playback && !prefersReducedMotion && freezeAt < 0) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (gl) {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
      }
    };
  }, [
    radius,
    playback,
    duration,
    pause,
    loop,
    direction,
    freezeAt,
    glowWidth,
    intensity,
    softness,
    refraction,
    dispersion,
    depth,
    ambient,
    coolColor,
    crestColor,
    frontColor,
  ]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-100 will-change-transform"
      />
    </div>
  );
}

