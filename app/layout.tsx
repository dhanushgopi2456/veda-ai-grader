import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import GradientWave from "@/components/GradientWave";
import "./globals.css";

const serifFont = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VedaAI Grader — Autonomous Handwritten Assessment & OCR Evaluation",
  description:
    "An editorial, multimodal AI assessment engine. Ingests raw handwritten answer sheets, auto-maps out-of-order questions, and generates step-by-step criteria feedback.",
};

export const viewport: Viewport = {
  themeColor: "#17191c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var raw = localStorage.getItem('veda.settings.v1');
                var theme = raw ? JSON.parse(raw).theme : null;
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--ink)] font-sans selection:bg-[var(--mist)] selection:text-[var(--ink)] transition-colors duration-200 relative">
        {/* Living Gradient Wave Background across all pages */}
        <GradientWave />
        <ToastProvider>
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
