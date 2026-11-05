"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";

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
  const strengthLabels = ["Enter password", "Basic", "Moderate", "Solid", "Strong"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/grader");
    }, 400);
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
            / Registration
          </span>
        </Link>
      </div>

      {/* Main Split-Screen Shell */}
      <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[24px] border border-[#e5e5e7] bg-[#ffffff]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Column: Mist Gray Editorial Overview (5 cols) */}
          <div className="hidden lg:flex flex-col justify-between bg-[#f2f2f3] p-10 lg:col-span-5 border-r border-[#e5e5e7]">
            <div className="space-y-4">
              <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#979799]">
                Academic Onboarding
              </span>
              <h2 className="font-serif text-[32px] font-normal tracking-[-0.66px] leading-[1.25] text-[#17191c]">
                Empower your department with automated rubric scoring.
              </h2>
              <p className="text-[14px] font-sans text-[#777b86] leading-relaxed">
                Configure your educator profile to preserve grading logs, customize rubric strictness, and export grade sheets.
              </p>
            </div>

            {/* Checklist of Privileges */}
            <div className="space-y-3">
              <div className="rounded-[16px] bg-[#ffffff] p-4 border border-[#e5e5e7] text-[13px] font-sans flex items-center gap-3">
                <Check className="h-4 w-4 text-[#17191c] shrink-0" />
                <span>Multi-page PDF & image batch rasterization</span>
              </div>
              <div className="rounded-[16px] bg-[#ffffff] p-4 border border-[#e5e5e7] text-[13px] font-sans flex items-center gap-3">
                <Check className="h-4 w-4 text-[#17191c] shrink-0" />
                <span>Non-linear question and answer pairing</span>
              </div>
              <div className="rounded-[16px] bg-[#ffffff] p-4 border border-[#e5e5e7] text-[13px] font-sans flex items-center gap-3">
                <Check className="h-4 w-4 text-[#17191c] shrink-0" />
                <span>Gemini 2.5 Flash API multimodal engine</span>
              </div>
            </div>

            <div className="text-[13px] font-serif italic text-[#777b86]">
              &ldquo;The single most effective grading workflow our physics department has implemented.&rdquo;
              <p className="mt-1 font-sans not-italic text-[12px] text-[#979799]">— Faculty of Sciences</p>
            </div>
          </div>

          {/* Right Column: Clean White Form Surface (7 cols) */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 lg:col-span-7">
            <div className="max-w-md mx-auto w-full">
              <h1 className="font-serif text-[32px] font-normal tracking-[-0.66px] text-[#17191c]">
                Create Educator Profile
              </h1>
              <p className="mt-2 text-[14px] font-sans text-[#777b86]">
                Provide your institutional details to access the evaluation workspace.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[13px] font-sans font-medium text-[#17191c] mb-1.5">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prof. Eleanor Vance"
                    className="w-full rounded-[16px] bg-[#f2f2f3] border border-[#e5e5e7] px-4 py-3 text-[15px] font-sans text-[#17191c] placeholder-[#a3a6af] focus:outline-none focus:border-[#17191c] transition-colors"
                  />
                </div>

                {/* Institutional Role Selector */}
                <div>
                  <label className="block text-[13px] font-sans font-medium text-[#17191c] mb-1.5">
                    Institutional Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-[16px] bg-[#f2f2f3] border border-[#e5e5e7] px-4 py-3 text-[15px] font-sans text-[#17191c] focus:outline-none focus:border-[#17191c] transition-colors"
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[13px] font-sans font-medium text-[#17191c] mb-1.5">
                    Institution Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="evaluator@university.edu"
                    className="w-full rounded-[16px] bg-[#f2f2f3] border border-[#e5e5e7] px-4 py-3 text-[15px] font-sans text-[#17191c] placeholder-[#a3a6af] focus:outline-none focus:border-[#17191c] transition-colors"
                  />
                </div>

                {/* Password with Strength Meter */}
                <div>
                  <label className="block text-[13px] font-sans font-medium text-[#17191c] mb-1.5">
                    Password
                  </label>
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

                  {/* Clean Strength Meter */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex h-1 gap-1 w-full rounded-full overflow-hidden bg-[#e5e5e7]">
                        <div className={`h-full flex-1 ${strengthScore >= 1 ? "bg-[#17191c]" : ""}`} />
                        <div className={`h-full flex-1 ${strengthScore >= 2 ? "bg-[#17191c]" : ""}`} />
                        <div className={`h-full flex-1 ${strengthScore >= 3 ? "bg-[#17191c]" : ""}`} />
                        <div className={`h-full flex-1 ${strengthScore >= 4 ? "bg-[#17191c]" : ""}`} />
                      </div>
                      <span className="text-[11px] font-sans text-[#777b86]">
                        Complexity: {strengthLabels[strengthScore]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-1 text-[13px] font-sans text-[#777b86]">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-[#e5e5e7] text-[#17191c] mt-0.5"
                  />
                  <span>
                    I confirm that student answer sheets will be processed under institutional examination guidelines.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-steep-primary w-full mt-2"
                >
                  {loading ? "Creating Profile…" : "Complete Registration"}
                </button>
              </form>

              {/* Bottom Toggle Link */}
              <div className="mt-8 text-center text-[13px] font-sans text-[#777b86]">
                Already registered?{" "}
                <Link href="/login" className="link-steep text-[#17191c]">
                  Sign in to workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
