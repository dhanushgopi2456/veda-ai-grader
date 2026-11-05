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
  User,
  Building,
  Check,
} from "lucide-react";
import CinematicBackground from "@/components/CinematicBackground";

const ROLES = [
  { id: "teacher", label: "School / K-12 Teacher" },
  { id: "professor", label: "University Professor" },
  { id: "grader", label: "Teaching Assistant / Grader" },
  { id: "admin", label: "Exam Board / Dean" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  // Real-time password strength calculation
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
  const strengthLabels = ["Enter password", "Weak", "Fair", "Good", "Bulletproof"];
  const strengthColors = ["bg-slate-700", "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-emerald-500"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Side: Cinematic AI Feature Highlights (5 cols) */}
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-b from-indigo-950/40 via-slate-950/60 to-[#070b18] p-8 lg:col-span-5">
            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-mono text-orange-300">
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                <span>INSTITUTION REGISTRATION</span>
              </div>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-white">
                Empower your department with autonomous AI grading
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Setup your educator profile to keep session evaluation logs, customize rubric strictness, and export grade sheets.
              </p>
            </div>

            {/* Checklist of Privileges */}
            <div className="my-6 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Unlimited multi-page PDF batch rasterization</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Out-of-order automatic question & answer pairing</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Bring-Your-Own-Key Gemini 2.5 Flash API support</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 text-xs text-slate-400 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>FERPA & GDPR aligned · In-memory processing</span>
            </div>
          </div>

          {/* Right Side: Register Form (7 cols) */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:col-span-7">
            <div className="max-w-md mx-auto w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Create Account
                </h2>
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/20"
                >
                  <Zap className="h-3 w-3" />
                  <span>Try Demo First</span>
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Join educator network or test instant sample evaluation.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Full Name & Title
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Eleanor Vance"
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-base text-white placeholder-slate-500 transition-all focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Institution Role Selector */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Academic Role
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Building className="h-4 w-4" />
                    </span>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#0f172a] py-2.5 pl-10 pr-4 text-base text-white transition-all focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Institutional Email
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
                      placeholder="vance@physics.university.edu"
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-base text-white placeholder-slate-500 transition-all focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Password with Real-time Strength Meter */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Secure Password
                  </label>
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

                  {/* Animated Strength Indicator Bars */}
                  {password.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 animate-fade-up">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Strength:</span>
                        <span className="font-semibold text-slate-200">{strengthLabels[strengthScore]}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all duration-300 ${
                              strengthScore >= step ? strengthColors[strengthScore] : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Criteria Mini Badges */}
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
                        <span className={`flex items-center gap-1 ${hasLength ? "text-emerald-400" : ""}`}>
                          <Check className="h-3 w-3" /> 8+ chars
                        </span>
                        <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-400" : ""}`}>
                          <Check className="h-3 w-3" /> Uppercase
                        </span>
                        <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-400" : ""}`}>
                          <Check className="h-3 w-3" /> Number
                        </span>
                        <span className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-400" : ""}`}>
                          <Check className="h-3 w-3" /> Symbol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center text-xs text-slate-300">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                    />
                    <span>
                      I agree to the Terms of Service, FERPA compliance guidelines, and privacy policy.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Creating Educator Profile…" : "Register & Launch Grader"}
                </button>
              </form>

              {/* Bottom Toggle Link */}
              <div className="mt-6 text-center text-xs text-slate-400">
                Already have an educator account?{" "}
                <Link href="/login" className="font-semibold text-orange-400 hover:text-orange-300">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

