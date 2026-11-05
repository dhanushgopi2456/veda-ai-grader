"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-transparent transition-colors">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 lg:px-8">
        {/* Brand Logo - Ink Black with subtle weight */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-[22px] tracking-[-0.5px] text-[#17191c] font-normal">
            VedaAI
          </span>
          <span className="text-[12px] font-sans font-medium text-[#777b86] tracking-tight pt-0.5">
            / Editorial Grader
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-sans text-[#777b86]">
          <a
            href="#features"
            className="hover:text-[#17191c] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#17191c] transition-colors"
          >
            Methodology
          </a>
          <a
            href="#metrics"
            className="hover:text-[#17191c] transition-colors"
          >
            Benchmarks
          </a>
          <Link
            href="/grader?sample=true"
            className="hover:text-[#17191c] transition-colors"
          >
            Sample Paper
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[14px] font-sans text-[#777b86] hover:text-[#17191c] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/grader"
            className="btn-steep-primary"
          >
            <span>Launch Grader</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#17191c] hover:bg-[#f2f2f3] md:hidden transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 rounded-[20px] bg-[#ffffff] border border-[#f2f2f3] p-6 shadow-steep-artifact md:hidden"
          >
            <div className="flex flex-col gap-3 text-[15px] font-sans">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#777b86] hover:text-[#17191c]"
              >
                Capabilities
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#777b86] hover:text-[#17191c]"
              >
                Methodology
              </a>
              <a
                href="#metrics"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#777b86] hover:text-[#17191c]"
              >
                Benchmarks
              </a>
              <Link
                href="/grader?sample=true"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#777b86] hover:text-[#17191c]"
              >
                Sample Paper
              </Link>
              <div className="mt-4 pt-4 border-t border-[#f2f2f3] flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-steep-secondary w-full"
                >
                  Sign In
                </Link>
                <Link
                  href="/grader"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-steep-primary w-full"
                >
                  Launch Grader
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
