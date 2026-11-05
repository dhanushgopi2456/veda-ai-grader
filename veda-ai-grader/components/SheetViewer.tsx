"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { EvaluationResult, PageImage, Region } from "@/lib/types";
import { ZoomIn, ZoomOut, Eye } from "lucide-react";

type Props = {
  result: EvaluationResult;
  selectedAnswerId: string | null;
  onSelectAnswer: (answerId: string | null) => void;
};

type Overlay = {
  answerId: string;
  label: string;
  kind: "matched" | "unmatched";
  region: Region;
};

export default function SheetViewer({ result, selectedAnswerId, onSelectAnswer }: Props) {
  const [zoom, setZoom] = useState(100);
  const [showAll, setShowAll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const regionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const answerToQuestion = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of result.results) {
      if (r.answerId) m.set(r.answerId, r.question.label);
    }
    return m;
  }, [result.results]);

  const overlays: Overlay[] = useMemo(() => {
    const list: Overlay[] = [];
    for (const a of result.answers) {
      const matched = answerToQuestion.has(a.id);
      for (const region of a.regions) {
        list.push({
          answerId: a.id,
          label: answerToQuestion.get(a.id) ?? "?",
          kind: matched ? "matched" : "unmatched",
          region,
        });
      }
    }
    return list;
  }, [result.answers, answerToQuestion]);

  const selectedOverlays = useMemo(
    () => overlays.filter((o) => o.answerId === selectedAnswerId),
    [overlays, selectedAnswerId]
  );

  useEffect(() => {
    if (!selectedAnswerId) return;
    const first = selectedOverlays[0];
    if (!first) return;
    const key = `${first.answerId}:${first.region.page}:${first.region.bbox.y0.toFixed(4)}`;
    const el = regionRefs.current.get(key);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedAnswerId, selectedOverlays]);

  function toggleShowAll() {
    setShowAll((v) => !v);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-neutral-100 dark:bg-neutral-950">
      {/* Control bar */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-neutral-200/90 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Student Answer Sheet
          </span>
          <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {result.answerPages.length} {result.answerPages.length !== 1 ? "pages" : "page"}
          </span>
          {selectedOverlays.length > 1 && (
            <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              Spans {selectedOverlays.length} regions
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleShowAll}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              showAll
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>All highlights</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-9 text-center text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 tabular-nums">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(220, z + 15))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pages Container */}
      <div ref={containerRef} className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <div
          className="mx-auto flex flex-col items-center gap-6"
          style={{ width: `${zoom}%`, maxWidth: zoom > 100 ? "none" : "820px" }}
        >
          {result.answerPages.length === 0 && (
            <div className="mt-20 text-center text-sm text-neutral-400">
              Answer sheet pages are not available in this view.
            </div>
          )}

          {result.answerPages.map((page: PageImage, pageIndex) => {
            const pageOverlays = overlays.filter((o) => o.region.page === pageIndex + 1);
            return (
              <div key={page.url} className="w-full">
                <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.url}
                    alt={`Answer sheet page ${pageIndex + 1}`}
                    className="block w-full select-none"
                    draggable={false}
                  />

                  {pageOverlays
                    .filter((o) => showAll || o.answerId === selectedAnswerId)
                    .map((o) => {
                      const key = `${o.answerId}:${o.region.page}:${o.region.bbox.y0.toFixed(4)}`;
                      const isSelected = o.answerId === selectedAnswerId;
                      const dimmed = selectedAnswerId !== null && !isSelected;

                      return (
                        <div
                          key={key}
                          ref={(el) => {
                            if (el) regionRefs.current.set(key, el);
                            else regionRefs.current.delete(key);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAnswer(isSelected ? null : o.answerId);
                          }}
                          className={`absolute cursor-pointer rounded-lg transition-all duration-200 ${
                            isSelected
                              ? "z-20 border-[3px] border-emerald-500 bg-emerald-500/25 shadow-[0_0_0_6px_rgba(16,185,129,0.25)] ring-2 ring-white dark:ring-neutral-900"
                              : o.kind === "unmatched"
                                ? "border-2 border-amber-400 bg-amber-400/20 hover:bg-amber-400/35"
                                : "border-2 border-emerald-500/70 bg-emerald-500/15 hover:bg-emerald-500/30"
                          } ${dimmed ? "opacity-35" : "opacity-100"}`}
                          style={{
                            left: `${Math.max(0, o.region.bbox.x0 * 100 - 0.4)}%`,
                            top: `${Math.max(0, o.region.bbox.y0 * 100 - 0.6)}%`,
                            width: `${Math.min(100, (o.region.bbox.x1 - o.region.bbox.x0) * 100 + 0.8)}%`,
                            height: `${Math.min(100, (o.region.bbox.y1 - o.region.bbox.y0) * 100 + 1.2)}%`,
                          }}
                        >
                          <span
                            className={`absolute -top-3.5 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-xs ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : o.kind === "unmatched"
                                  ? "bg-amber-400 text-amber-950 font-bold"
                                  : "bg-white text-emerald-800 ring-1 ring-emerald-500/60 dark:bg-neutral-900 dark:text-emerald-300"
                            }`}
                          >
                            {o.label === "?" ? "Unmatched" : `Q${o.label}`}
                          </span>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-2 text-center text-xs font-medium text-neutral-400 dark:text-neutral-500">
                  Page {pageIndex + 1} of {result.answerPages.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex h-10 shrink-0 items-center justify-center gap-5 border-t border-neutral-200/90 bg-white px-4 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border-2 border-emerald-500 bg-emerald-500/30" />
          <span>Matched Answer</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border-2 border-amber-400 bg-amber-400/30" />
          <span>Unmatched Block</span>
        </span>
        <span className="hidden sm:inline text-neutral-400">
          Click any highlighted region to locate corresponding question card
        </span>
      </div>
    </div>
  );
}
