"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.success("Signed in successfully", "Redirecting to grader workspace...");
    setTimeout(() => {
      router.push("/grader");
    }, 400);
  };

  const handleDemoAccess = () => {
    setLoading(true);
    toast.success("Demo access granted", "Loading sample exam sandbox...");
    setTimeout(() => {
      router.push("/grader?sample=true");
    }, 200);
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    toast.info("Password reset link sent", "Check your registered institutional email");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-transparent p-6 text-[var(--ink)]">
      {/* Top Brand Link */}
      <div className="fixed top-8 left-8 z-30">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-[22px] font-normal tracking-[-0.5px] text-[var(--ink)]">
            VedaAI
          </span>
          <span className="text-[12px] font-sans font-medium text-[var(--slate)] pt-0.5">
            / Portal
          </span>
        </Link>
      </div>

      {/* Main Split-Screen Shell - Flat with Steep Border Radius */}
      <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--canvas)]/90 backdrop-blur-xl shadow-steep-artifact">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Mist Gray Editorial Overview (5 cols) */}
          <div className="hidden lg:flex flex-col justify-between bg-[var(--mist)] p-10 lg:col-span-5 border-r border-[var(--border)]">
            <div className="space-y-4">
              <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[var(--ash)]">
                Educator Portal
              </span>
              <h2 className="font-serif text-[32px] font-normal tracking-[-0.66px] leading-[1.25] text-[var(--ink)]">
                A disciplined interface for exam evaluation.
              </h2>
              <p className="text-[14px] font-sans text-[var(--slate)] leading-relaxed">
                Access institution batches, verified OCR extraction pipelines, and automated marking rubrics.
              </p>
            </div>

            {/* Flat Nested Info Box */}
            <div className="rounded-[16px] bg-[var(--canvas)] p-5 border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between text-[12px] font-sans">
                <span className="text-[var(--slate)]">Engine Active</span>
                <span className="font-medium text-[var(--ink)]">Gemini 2.5 Flash</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-sans">
                <span className="text-[var(--slate)]">OCR Precision</span>
                <span className="font-medium text-[var(--ink)]">98.4% benchmarked</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-sans border-t border-[var(--border-subtle)] pt-2">
                <span className="text-[var(--slate)]">Privacy</span>
                <span className="font-medium text-[var(--ink)]">Zero file retention</span>
              </div>
            </div>

            {/* Institutional Citation */}
            <div className="text-[13px] font-serif italic text-[var(--slate)]">
              &ldquo;Accurate handwriting recognition that respects teacher oversight.&rdquo;
              <p className="mt-1 font-sans not-italic text-[12px] text-[var(--ash)]">— Apex Academic Council</p>
            </div>
          </div>

          {/* Right Column: Clean Form Surface (7 cols) */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 lg:col-span-7 bg-[var(--canvas)]">
            <div className="max-w-md mx-auto w-full">
              <h1 className="font-serif text-[32px] font-normal tracking-[-0.66px] text-[var(--ink)]">
                Educator Sign In
              </h1>
              <p className="mt-2 text-[14px] font-sans text-[var(--slate)]">
                Enter your credentials or launch the instant demo sandbox.
              </p>

              {/* Fast Demo / Guest Access Button (Ghost button on same baseline) */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="btn-steep-secondary w-full"
                >
                  <span>Launch 1-Click Sample Sandbox</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Or Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[11px] uppercase tracking-wider font-sans text-[var(--ash)]">
                  or continue with email
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-[13px] font-sans font-medium text-[var(--ink)] mb-1.5">
                    Institution Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="evaluator@institution.edu"
                    className="w-full rounded-[16px] bg-[var(--mist)] border border-[var(--border)] px-4 py-3 text-[15px] font-sans text-[var(--ink)] placeholder-[var(--smoke)] focus:outline-none focus:border-[var(--ink)] transition-colors"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[13px] font-sans font-medium text-[var(--ink)]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[12px] font-sans text-[var(--slate)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-[16px] bg-[var(--mist)] border border-[var(--border)] px-4 py-3 pr-11 text-[15px] font-sans text-[var(--ink)] placeholder-[var(--smoke)] focus:outline-none focus:border-[var(--ink)] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--slate)] hover:text-[var(--ink)] cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {forgotSent && (
                  <p className="text-[13px] font-sans text-[var(--slate)]">
                    Instructions sent to registered email address.
                  </p>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between text-[13px] font-sans text-[var(--slate)] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--ink)] focus:ring-0"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-steep-primary w-full mt-2"
                >
                  {loading ? "Authenticating…" : "Sign In to Workspace"}
                </button>
              </form>

              {/* Bottom Toggle Link */}
              <div className="mt-8 text-center text-[13px] font-sans text-[var(--slate)]">
                Need an account?{" "}
                <Link href="/register" className="link-steep text-[var(--ink)]">
                  Register evaluator profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
