"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

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
    setTimeout(() => {
      router.push("/grader");
    }, 400);
  };

  const handleDemoAccess = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/grader?sample=true");
    }, 200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#ffffff] p-6 text-[#17191c]">
      {/* Top Brand Link */}
      <div className="fixed top-8 left-8 z-30">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-[22px] font-normal tracking-[-0.5px] text-[#17191c]">
            VedaAI
          </span>
          <span className="text-[12px] font-sans font-medium text-[#777b86] pt-0.5">
            / Portal
          </span>
        </Link>
      </div>

      {/* Main Split-Screen Shell - Flat with Steep Border Radius */}
      <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[24px] border border-[#e5e5e7] bg-[#ffffff]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Mist Gray Editorial Overview (5 cols) */}
          <div className="hidden lg:flex flex-col justify-between bg-[#f2f2f3] p-10 lg:col-span-5 border-r border-[#e5e5e7]">
            <div className="space-y-4">
              <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
                Educator Portal
              </span>
              <h2 className="font-serif text-[32px] font-normal tracking-[-0.66px] leading-[1.25] text-[#17191c]">
                A disciplined interface for exam evaluation.
              </h2>
              <p className="text-[14px] font-sans text-[#777b86] leading-relaxed">
                Access institution batches, verified OCR extraction pipelines, and automated marking rubrics.
              </p>
            </div>

            {/* Flat Nested Info Box */}
            <div className="rounded-[16px] bg-[#ffffff] p-5 border border-[#e5e5e7] space-y-3">
              <div className="flex items-center justify-between text-[12px] font-sans">
                <span className="text-[#777b86]">Engine Active</span>
                <span className="font-medium text-[#17191c]">Gemini 2.5 Flash</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-sans">
                <span className="text-[#777b86]">OCR Precision</span>
                <span className="font-medium text-[#17191c]">98.4% benchmarked</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-sans border-t border-[#f2f2f3] pt-2">
                <span className="text-[#777b86]">Privacy</span>
                <span className="font-medium text-[#17191c]">Zero file retention</span>
              </div>
            </div>

            {/* Institutional Citation */}
            <div className="text-[13px] font-serif italic text-[#777b86]">
              &ldquo;Accurate handwriting recognition that respects teacher oversight.&rdquo;
              <p className="mt-1 font-sans not-italic text-[12px] text-[#979799]">— Apex Academic Council</p>
            </div>
          </div>

          {/* Right Column: Clean White Form Surface (7 cols) */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 lg:col-span-7">
            <div className="max-w-md mx-auto w-full">
              <h1 className="font-serif text-[32px] font-normal tracking-[-0.66px] text-[#17191c]">
                Educator Sign In
              </h1>
              <p className="mt-2 text-[14px] font-sans text-[#777b86]">
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
                <div className="h-px flex-1 bg-[#e5e5e7]" />
                <span className="text-[11px] uppercase tracking-wider font-sans text-[#979799]">
                  or continue with email
                </span>
                <div className="h-px flex-1 bg-[#e5e5e7]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-[13px] font-sans font-medium text-[#17191c] mb-1.5">
                    Institution Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="evaluator@institution.edu"
                    className="w-full rounded-[16px] bg-[#f2f2f3] border border-[#e5e5e7] px-4 py-3 text-[15px] font-sans text-[#17191c] placeholder-[#a3a6af] focus:outline-none focus:border-[#17191c] transition-colors"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[13px] font-sans font-medium text-[#17191c]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotSent(true)}
                      className="text-[12px] font-sans text-[#777b86] hover:text-[#17191c] transition-colors"
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
                      className="w-full rounded-[16px] bg-[#f2f2f3] border border-[#e5e5e7] px-4 py-3 pr-11 text-[15px] font-sans text-[#17191c] placeholder-[#a3a6af] focus:outline-none focus:border-[#17191c] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#777b86] hover:text-[#17191c]"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {forgotSent && (
                  <p className="text-[13px] font-sans text-[#777b86]">
                    Instructions sent to registered email address.
                  </p>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between text-[13px] font-sans text-[#777b86] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#e5e5e7] text-[#17191c] focus:ring-0"
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
              <div className="mt-8 text-center text-[13px] font-sans text-[#777b86]">
                Need an account?{" "}
                <Link href="/register" className="link-steep text-[#17191c]">
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
