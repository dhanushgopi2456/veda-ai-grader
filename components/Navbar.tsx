"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ToastProvider";

export default function Navbar() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      const raw = localStorage.getItem("veda.settings.v1");
      const parsed = raw ? JSON.parse(raw) : {};
      parsed.theme = nextDark ? "dark" : "light";
      localStorage.setItem("veda.settings.v1", JSON.stringify(parsed));
    } catch {}
    toast.info(nextDark ? "Theme switched to Dark mode" : "Theme switched to Light mode");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--canvas)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 lg:px-8">
        {/* Brand Logo - Ink Black with subtle weight */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-[22px] tracking-[-0.5px] text-[var(--ink)] font-normal">
            VedaAI
          </span>
          <span className="text-[12px] font-sans font-medium text-[var(--slate)] tracking-tight pt-0.5">
            / Editorial Grader
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-sans text-[var(--slate)]">
          <a
            href="#features"
            className="hover:text-[var(--ink)] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[var(--ink)] transition-colors"
          >
            Methodology
          </a>
          <a
            href="#metrics"
            className="hover:text-[var(--ink)] transition-colors"
          >
            Benchmarks
          </a>
          <Link
            href="/grader?sample=true"
            onClick={() => toast.info("Opening sample assessment...")}
            className="hover:text-[var(--ink)] transition-colors"
          >
            Sample Paper
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            href="/login"
            onClick={() => toast.info("Opening Educator Portal...")}
            className="text-[14px] font-sans text-[var(--slate)] hover:text-[var(--ink)] px-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            onClick={() => toast.info("Navigating to Educator Portal...")}
            className="btn-steep-primary"
          >
            <span>Launch Grader</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Hamburger & Quick Theme */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--ink)] hover:bg-[var(--mist)] transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 rounded-[20px] bg-[var(--canvas)] border border-[var(--border)] p-6 shadow-steep-artifact md:hidden"
          >
            <div className="flex flex-col gap-3 text-[15px] font-sans">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[var(--slate)] hover:text-[var(--ink)]"
              >
                Capabilities
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[var(--slate)] hover:text-[var(--ink)]"
              >
                Methodology
              </a>
              <a
                href="#metrics"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[var(--slate)] hover:text-[var(--ink)]"
              >
                Benchmarks
              </a>
              <Link
                href="/grader?sample=true"
                onClick={() => {
                  setMobileMenuOpen(false);
                  toast.info("Opening sample assessment...");
                }}
                className="py-2 text-[var(--slate)] hover:text-[var(--ink)]"
              >
                Sample Paper
              </Link>
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toast.info("Opening Educator Portal...");
                  }}
                  className="btn-steep-secondary w-full"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toast.info("Navigating to Educator Portal...");
                  }}
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
