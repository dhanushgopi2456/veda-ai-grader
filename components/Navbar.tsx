"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#050711]/75 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_15px_rgba(244,81,30,0.4)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              VedaAI <span className="text-xs font-mono font-medium text-orange-400">Grader</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono -mt-1 hidden sm:block">
              Neural Assessment Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-white">
            How It Works
          </a>
          <a href="#metrics" className="transition-colors hover:text-white">
            Benchmarks
          </a>
          <Link href="/grader?sample=true" className="flex items-center gap-1 transition-colors hover:text-orange-400">
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            Live Demo
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/grader"
            className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(244,81,30,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(244,81,30,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Launch Grader
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-[#050711]/95 px-4 pt-2 pb-6 md:hidden backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-3 pt-2 text-sm">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-200 hover:bg-white/5"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-200 hover:bg-white/5"
              >
                How It Works
              </a>
              <a
                href="#metrics"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-200 hover:bg-white/5"
              >
                Benchmarks
              </a>
              <Link
                href="/grader?sample=true"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-orange-400 hover:bg-white/5 flex items-center gap-2 font-medium"
              >
                <Zap className="h-4 w-4 text-orange-400" />
                Live Demo with Sample Assessment
              </Link>
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl border border-white/15 bg-white/5 py-2.5 font-medium text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/grader"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-2.5 font-semibold text-white shadow-lg shadow-orange-500/30"
                >
                  Launch Grader Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

