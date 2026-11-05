"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  Mail,
  Cpu,
} from "lucide-react";
import CinematicBackground from "@/components/CinematicBackground";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulated instant smooth sign-in transition
    setTimeout(() => {
      router.push("/grader");
    }, 600);
  };

  const handleDemoAccess = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/grader?sample=true");
    }, 300);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050711] p-4 text-white sm:p-6 lg:p-8">
      <CinematicBackground variant="auth" />

      {/* Top Brand Link */}
      <div className="fixed top-6 left-6 z-30">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_15px_rgba(244,81,30,0.4)] transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
            VedaAI <span className="text-xs font-mono font-medium text-orange-400">Grader</span>
          </span>
        </Link>
      </div>

      {/* Main Split-Screen Shell */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-2xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* Left Side: Cinematic AI Grading Telemetry & Visuals (5 cols) */}
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-b from-indigo-950/40 via-slate-950/60 to-[#070b18] p-8 lg:col-span-5">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono text-indigo-300">
                <Cpu className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                <span>VEDA TELEMETRY HUD</span>
              </div>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-white">
                Autonomous Grading Infrastructure
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Log in to access your batch queue, rubric presets, and student gap distribution analytics.
              </p>
            </div>

            {/* Floating Glass Telemetry Card */}
            <div className="my-6 space-y-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Model Engine
                  </span>
                  <span>Gemini 2.5 Flash</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-white font-semibold">
                  <span>Batch Throughput</span>
                  <span className="text-cyan-400">&gt; 120 papers/min</span>
                </div>
              </div>

              <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-3.5">
                <div className="flex items-center justify-between text-[11px] text-orange-300">
                  <span>OCR POLYGON ACCURACY</span>
                  <span className="font-bold">99.4%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-[99.4%]" />
                </div>
              </div>
            </div>

            {/* Educator Quote */}
            <div className="border-t border-white/10 pt-4 text-xs text-slate-400 italic">
              &ldquo;Reduced our midterm grading turnaround from five days down to under an hour.&rdquo;
              <p className="mt-1 font-mono not-italic text-slate-300">— Dept of Physics, Pacific Coast</p>
            </div>
          </div>

          {/* Right Side: Sleek Glassmorphic Login Form (7 cols) */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:col-span-7">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Sign in to your educator account or launch guest testing mode.
              </p>

              {/* Fast Demo / Guest Access Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 py-3 text-sm font-bold text-orange-400 transition-all duration-300 hover:border-orange-500 hover:bg-orange-500/25 hover:text-white hover:shadow-[0_0_20px_rgba(244,81,30,0.3)]"
                >
                  <Zap className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>One-Click Demo / Guest Access</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="mt-1 text-center text-[11px] text-slate-500">
                  Instantly launch workspace with sample physics exam papers
                </div>
              </div>

              {/* Or Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase font-mono text-slate-500">or sign in with email</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Email Address
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@institution.edu"
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-base text-white placeholder-slate-500 transition-all focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotSent(true)}
                      className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-11 text-base text-white placeholder-slate-500 transition-all focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {forgotSent && (
                  <p className="text-xs text-emerald-400 animate-fade-up">
                    Password reset link sent to demo registered email.
                  </p>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Authenticating & Loading Workspace…" : "Sign In to VedaAI"}
                </button>
              </form>

              {/* Social Login Options */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Bottom Toggle Link */}
              <div className="mt-8 text-center text-xs text-slate-400">
                Don&apos;t have an account yet?{" "}
                <Link href="/register" className="font-semibold text-orange-400 hover:text-orange-300">
                  Create educator profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

