"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileCheck,
  X,
  Plus,
  Sparkles,
  Sliders,
  ChevronDown,
  ArrowRight,
  Loader2,
  FileImage,
  AlertCircle,
  Eye,
} from "lucide-react";
import type { EvaluationConfig } from "@/lib/types";

type Props = {
  qFiles: File[];
  aFiles: File[];
  onQFiles: (files: File[]) => void;
  onAFiles: (files: File[]) => void;
  onProcess: (config: EvaluationConfig) => void;
  onLoadSample: () => void;
  error: string | null;
  busy: boolean;
  sampleLoading: boolean;
  activeModel: string;
  onModelChange: (model: string) => void;
  hasKey: boolean;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DropZone({
  title,
  subtitle,
  accept,
  files,
  onFiles,
  badgeText,
  onPreviewFile,
}: {
  title: string;
  subtitle: string;
  accept: string;
  files: File[];
  onFiles: (files: File[]) => void;
  badgeText: string;
  onPreviewFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleAdd(incoming: FileList | null) {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.type === "image/jpeg" ||
        f.type === "image/png" ||
        f.type === "image/webp"
    );
    const existing = new Set(files.map((f) => `${f.name}:${f.size}`));
    const deduped = valid.filter((f) => !existing.has(`${f.name}:${f.size}`));
    if (deduped.length > 0) onFiles([...files, ...deduped]);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            {badgeText}
          </span>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
            {title}
          </h3>
        </div>
        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 tabular-nums">
          {files.length} {files.length === 1 ? "file" : "files"}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleAdd(e.target.files);
          e.target.value = "";
        }}
      />

      {files.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleAdd(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragOver
              ? "border-orange-500 bg-orange-50/50 dark:border-orange-500 dark:bg-orange-950/20"
              : "border-neutral-200 bg-neutral-50/60 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40 dark:hover:border-neutral-700"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs text-orange-500 border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 text-center">
            Drag &amp; drop your file here
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 text-center">
            or <span className="text-orange-500 font-medium underline">browse files</span> from your device
          </p>
          <span className="mt-3 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
            {subtitle}
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${file.size}-${idx}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40 group transition-all"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/80 dark:text-orange-400">
                  {file.type === "application/pdf" ? (
                    <FileText className="h-4.5 w-4.5" />
                  ) : (
                    <FileImage className="h-4.5 w-4.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-neutral-900 dark:text-white">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    <span>{formatSize(file.size)}</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                      <FileCheck className="h-3 w-3" /> Ready
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onPreviewFile(file)}
                    className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-white transition-colors"
                    title="Preview file"
                    aria-label="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onFiles(files.filter((_, j) => j !== idx))}
                    className="p-1 rounded-lg text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors"
                    title="Remove file"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-neutral-300 text-xs font-medium text-neutral-600 hover:border-orange-500 hover:text-orange-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-orange-400 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add another page or sheet</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewEvaluationView({
  qFiles,
  aFiles,
  onQFiles,
  onAFiles,
  onProcess,
  onLoadSample,
  error,
  busy,
  sampleLoading,
  activeModel,
  onModelChange,
  hasKey,
}: Props) {
  const [showConfig, setShowConfig] = useState(true);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string; isPdf: boolean } | null>(null);

  // Configuration state
  const [config, setConfig] = useState<EvaluationConfig>({
    strictness: "balanced",
    partialMarking: true,
    handwritingForgiving: true,
    feedbackLevel: "standard",
    subject: "Physics",
    studentName: "Arjun Sharma",
    totalMarksOverride: null,
    customInstructions: "",
  });

  const isReady = qFiles.length > 0 && aFiles.length > 0;

  function handlePreview(file: File) {
    const url = URL.createObjectURL(file);
    setPreviewFile({
      name: file.name,
      url,
      isPdf: file.type === "application/pdf",
    });
  }

  function closePreview() {
    if (previewFile?.url) {
      URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* 5-Step Stepper Bar */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between overflow-x-auto text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                qFiles.length > 0
                  ? "bg-emerald-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              1
            </span>
            <span className={qFiles.length > 0 ? "text-neutral-900 dark:text-white font-semibold" : ""}>
              Question Paper
            </span>
          </div>

          <div className="h-px w-6 sm:w-12 bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                aFiles.length > 0
                  ? "bg-emerald-500 text-white"
                  : qFiles.length > 0
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              2
            </span>
            <span className={aFiles.length > 0 ? "text-neutral-900 dark:text-white font-semibold" : ""}>
              Answer Sheet
            </span>
          </div>

          <div className="h-px w-6 sm:w-12 bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                isReady
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              3
            </span>
            <span className={isReady ? "text-neutral-900 dark:text-white font-semibold" : ""}>
              Configuration
            </span>
          </div>

          <div className="h-px w-6 sm:w-12 bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 text-xs font-bold dark:bg-neutral-800 dark:text-neutral-400">
              4
            </span>
            <span>AI Evaluation</span>
          </div>

          <div className="h-px w-6 sm:w-12 bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 text-xs font-bold dark:bg-neutral-800 dark:text-neutral-400">
              5
            </span>
            <span>Results</span>
          </div>
        </div>
      </div>

      {/* Header & Quick Sample Loader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Create New Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Upload the question paper and student handwritten sheet. VedaAI extracts both documents, maps responses, and computes rubric-based grades.
          </p>
        </div>

        <button
          onClick={onLoadSample}
          disabled={sampleLoading || busy}
          className="inline-flex items-center gap-2 shrink-0 rounded-xl border border-orange-200/80 bg-orange-50/80 px-3.5 py-2.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-950/70 transition-all disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          <span>{sampleLoading ? "Loading Sample..." : "Use Sample Exam Pack"}</span>
        </button>
      </div>

      {/* Two Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DropZone
          badgeText="Step 1"
          title="Question Paper"
          subtitle="Supports PDF, JPG, PNG or WEBP (Multiple pages supported)"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          files={qFiles}
          onFiles={onQFiles}
          onPreviewFile={handlePreview}
        />

        <DropZone
          badgeText="Step 2"
          title="Student Answer Sheet"
          subtitle="Supports handwritten scanned PDF, JPG, PNG or WEBP"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          files={aFiles}
          onFiles={onAFiles}
          onPreviewFile={handlePreview}
        />
      </div>

      {/* Step 3: Evaluation Configuration Panel */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowConfig((v) => !v)}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <Sliders className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Step 3
                </span>
                <span className="text-xs text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Rubric &amp; AI Preferences
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Evaluation Configuration
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline text-xs text-neutral-500">
              {config.subject} · {config.strictness} strictness
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-750 transition-colors">
              <span>{showConfig ? "Hide Options" : "See Options"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  showConfig ? "rotate-180" : ""
                }`}
              />
            </span>
          </div>
        </button>

        {showConfig && (
          <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/80 mt-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={config.studentName}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, studentName: e.target.value }))
                  }
                  placeholder="e.g. Arjun Sharma"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, subject: e.target.value }))
                  }
                  placeholder="e.g. Physics, Calculus, Biology"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
                />
              </div>

              {/* Strictness */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Marking Strictness
                </label>
                <select
                  value={config.strictness}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      strictness: e.target.value as "lenient" | "balanced" | "strict",
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
                >
                  <option value="lenient">Lenient (Focus on attempt &amp; concepts)</option>
                  <option value="balanced">Balanced (Standard academic rubric)</option>
                  <option value="strict">Strict (Exact keywords &amp; derivation steps)</option>
                </select>
              </div>

              {/* Feedback Level */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Feedback Depth
                </label>
                <select
                  value={config.feedbackLevel}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      feedbackLevel: e.target.value as "concise" | "standard" | "comprehensive",
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
                >
                  <option value="concise">Concise &amp; Key Takeaways</option>
                  <option value="standard">Standard Teacher Feedback</option>
                  <option value="comprehensive">Comprehensive Line-by-Line</option>
                </select>
              </div>

              {/* AI Model */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Vision Model
                  </label>
                  <span
                    className={`text-[10px] font-semibold ${
                      hasKey
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {hasKey ? "Key active" : "Key needed"}
                  </span>
                </div>
                <select
                  value={activeModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
                >
                  <option value="dots-studio/dots-3-note-preview:free">Dots 3 Note (Free OCR via OpenRouter)</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Recommended)</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Handwriting Focus)</option>
                  <option value="minimax/minimax-m3:free">MiniMax M3 (Free via OpenRouter)</option>
                </select>
              </div>

              {/* Partial Marking Toggle */}
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="partialMarking"
                  checked={config.partialMarking}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, partialMarking: e.target.checked }))
                  }
                  className="h-4 w-4 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
                <label
                  htmlFor="partialMarking"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Enable partial marks for step work
                </label>
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Examiner Guidance or Custom Rubric (Optional)
              </label>
              <textarea
                value={config.customInstructions || ""}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    customInstructions: e.target.value,
                  }))
                }
                rows={2}
                placeholder="e.g. Award full credit for Question 3 if either formula is used. Penalize missing units by 1 mark."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 outline-none transition-colors focus:border-orange-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-orange-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="anim-fade-up flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Evaluation Error</p>
            <p className="text-xs leading-relaxed mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Start AI Evaluation CTA */}
      <div className="flex flex-col items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (busy || sampleLoading) return;
            if (!isReady) {
              onLoadSample();
              return;
            }
            onProcess(config);
          }}
          disabled={busy || sampleLoading}
          className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-sm font-bold text-white shadow-xl transition-all duration-200 min-w-[280px] active:scale-98 ${
            busy || sampleLoading
              ? "bg-neutral-800 cursor-wait dark:bg-neutral-700"
              : !isReady
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
          }`}
        >
          {busy || sampleLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{sampleLoading ? "Loading Sample Exam..." : "Analyzing Answer Sheet..."}</span>
            </>
          ) : !isReady ? (
            <>
              <Sparkles className="h-5 w-5 text-amber-200" />
              <span>Load Sample &amp; Start Evaluation</span>
              <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            <>
              <span>Start AI Evaluation</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {!isReady && (
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
            <span>Upload files in Step 1 &amp; Step 2 above, or click</span>
            <button
              type="button"
              onClick={onLoadSample}
              disabled={sampleLoading}
              className="font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span>Use Sample Exam Pack</span>
            </button>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={closePreview} />
          <div className="anim-fade-up relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                {previewFile.name}
              </span>
              <button
                onClick={closePreview}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
              {previewFile.isPdf ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[600px] rounded-lg border border-neutral-200 dark:border-neutral-800"
                  title="PDF Preview"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewFile.url}
                  alt="File preview"
                  className="max-h-[70vh] object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
