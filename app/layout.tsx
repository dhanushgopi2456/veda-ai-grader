import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#17191c] font-sans selection:bg-[#f2f2f3] selection:text-[#17191c]">
        {children}
      </body>
    </html>
  );
}
