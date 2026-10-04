"use client";

import { useRef, useState } from "react";
import {
  DocIcon,
  FileIcon,
  PlusIcon,
  SparklesIcon,
  UploadIcon,
  XIcon,
} from "./Icons";

type Props = {
  qFiles: File[];
  aFiles: File[];
  onQFiles: (files: File[]) => void;
  onAFiles: (files: File[]) => void;
  onProcess: () => void;
  onLoadSample: () => void;
  error: string | null;
  busy: boolean;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DropCard({
  title,
  hint,
  accept,
  files,
  onFiles,
  accent,
}: {
  title: string;
  hint: string;
  accept: string;
  files: File[];
  onFiles: (files: File[]) => void;
  accent: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.type === "image/jpeg" ||
        f.type === "image/png" ||
        f.type === "image/webp"
    );
    const names = new Set(files.map((f) => `${f.name}:${f.size}`));
    const deduped = incoming.filter((f) => !names.has(`${f.name}:${f.size}`));
    if (deduped.length > 0) onFiles([...files, ...deduped]);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
      className={`flex min-h-[220px] flex-col rounded-2xl border-2 border-dashed p-5 transition-colors ${
        dragging
          ? "border-accent bg-accent-soft"
          : files.length > 0
            ? "border-neutral-300 bg-white"
            : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {files.length === 0 ? (
        <button onClick={() => inputRef.current?.click()} className="flex flex-1 flex-col items-center justify-center gap-3 py-4">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              accent ? "bg-accent-soft text-accent" : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <UploadIcon className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-neutral-900">{title}</span>
          <span className="text-xs text-neutral-500">{hint}</span>
        </button>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {title}
            </span>
            <span className="text-xs text-neutral-400">
              {files.length} file{files.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
            {files.map((f, i) => (
              <div
                key={`${f.name}-${f.size}-${i}`}
                className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <FileIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-neutral-900">{f.name}</span>
                  <span className="block text-[11px] text-neutral-400">{formatSize(f.size)}</span>
                </span>
                <button
                  onClick={() => onFiles(files.filter((_, j) => j !== i))}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label={`Remove ${f.name}`}
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-accent hover:text-accent"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add more files
          </button>
        </div>
      )}
    </div>
  );
}

export default function UploadScreen({
  qFiles,
  aFiles,
  onQFiles,
  onAFiles,
  onProcess,
  onLoadSample,
  error,
  busy,
}: Props) {
  const ready = qFiles.length > 0 && aFiles.length > 0;
  return (
    <div className="flex h-full items-start justify-center overflow-y-auto px-4 py-10 lg:items-center">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
            <SparklesIcon className="h-8 w-8 text-accent anim-float" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 lg:text-[28px]">
            Upload <span className="text-accent">Question Paper &amp; Answer Sheets</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Upload both files to get started. VedaAI extracts the questions, finds every answer,
            and grades the paper for you.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <DropCard
            title="Upload Question Paper"
            hint="PDF or images (JPG, PNG)"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            files={qFiles}
            onFiles={onQFiles}
            accent={false}
          />
          <DropCard
            title="Upload Student Answer Sheet"
            hint="PDF or images (JPG, PNG)"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            files={aFiles}
            onFiles={onAFiles}
            accent={true}
          />
        </div>

        {error && (
          <div className="anim-fade-up mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={onProcess}
            disabled={!ready || busy}
            className="rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {busy ? "Working…" : "Get Feedback"}
          </button>
          {!ready && (
            <p className="text-xs text-neutral-400">
              {qFiles.length === 0 && aFiles.length === 0
                ? "Add a question paper and an answer sheet to continue"
                : qFiles.length === 0
                  ? "Still waiting for the question paper"
                  : "Still waiting for the answer sheet"}
            </p>
          )}
          <button
            onClick={onLoadSample}
            disabled={busy}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-accent disabled:opacity-40"
          >
            <DocIcon className="h-3.5 w-3.5" />
            Try it with sample papers
          </button>
        </div>
      </div>
    </div>
  );
}
