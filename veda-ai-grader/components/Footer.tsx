import Link from "next/link";
import { Sparkles, Shield, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#04060e] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_15px_rgba(244,81,30,0.3)]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                VedaAI Grader
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-slate-400 leading-relaxed">
              AI-driven assessment extraction, non-linear OCR answer mapping, and automated rubric grading for universities, schools, and competitive examination bodies.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini 2.5 Flash / Pro Vision Engine Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/grader" className="hover:text-white transition-colors">
                  Grader Workspace
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Architecture & Trust
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                <span>Zero Server File Retention</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span>Client-side Rasterization</span>
              </li>
              <li>
                <span className="text-xs text-slate-500">
                  Files stay strictly in-memory during session. Only sent to selected Gemini API endpoint.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VedaAI Grader. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="font-mono text-slate-400">v2.4-cinematic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
