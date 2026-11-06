import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--canvas)]/90 backdrop-blur-md border-t border-[var(--border)] text-[var(--slate)] py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="font-serif text-[22px] font-normal tracking-[-0.5px] text-[var(--ink)]">
                VedaAI Grader
              </span>
            </Link>
            <p className="max-w-md text-[14px] font-sans text-[#777b86] leading-relaxed">
              An editorial, multimodal assessment platform designed for universities, schools, and examination committees. Ingests raw handwritten answer sheets, auto-maps out-of-order questions, and generates step-by-step criteria feedback.
            </p>
            <div className="text-[12px] font-sans text-[#979799]">
              Gemini 2.5 Multimodal Architecture · Zero Permanent Server Storage
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#17191c] block">
              Navigation
            </span>
            <ul className="space-y-2 text-[14px] font-sans">
              <li>
                <Link href="/" className="hover:text-[#17191c] transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/grader" className="hover:text-[#17191c] transition-colors">
                  Grader Workspace
                </Link>
              </li>
              <li>
                <Link href="/grader?sample=true" className="hover:text-[#17191c] transition-colors">
                  Sample Assessment
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#17191c] transition-colors">
                  Educator Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Governance */}
          <div className="space-y-3">
            <span className="text-[12px] font-sans font-medium uppercase tracking-[0.04em] text-[#17191c] block">
              Governance & Privacy
            </span>
            <ul className="space-y-2 text-[13px] font-sans">
              <li>Ephemeral In-Browser Rasterization</li>
              <li>FERPA & GDPR Compliant Operation</li>
              <li>Zero Student Identity Retention</li>
              <li className="pt-2 text-[12px] text-[#979799]">
                Scripts processed exclusively in runtime session.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-[#f2f2f3] pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] font-sans text-[#979799] gap-4">
          <p>© {new Date().getFullYear()} VedaAI Assessment Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#17191c] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-[#17191c] transition-colors">
              Terms of Evaluation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
