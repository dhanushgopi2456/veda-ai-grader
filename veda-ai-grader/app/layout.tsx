import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VedaAI Grader — Autonomous Handwritten Assessment & OCR Evaluation",
  description:
    "Multimodal AI grading platform. Ingests raw handwritten answer sheets, auto-maps out-of-order questions, and generates step-by-step criteria feedback.",
};

export const viewport: Viewport = {
  themeColor: "#050711",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050711] text-slate-100">{children}</body>
    </html>
  );
}
