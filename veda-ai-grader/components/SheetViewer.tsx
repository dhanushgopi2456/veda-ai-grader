"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EvaluationResult, PageImage, Region } from "@/lib/types";
import { EyeIcon, MinusIcon, PlusIcon } from "./Icons";

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
    <div className="flex h-full min-h-0 flex-col bg-neutral-100">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 bg-white px-3">
        <div className="flex items-center gap-1.5">
          <span className="hidden text-xs font-medium text-neutral-500 sm:block">
            Answer sheet
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
            {result.answerPages.length} page{result.answerPages.length !== 1 ? "s" : ""}
          </span>
          {selectedOverlays.length > 1 && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
              spans {selectedOverlays.length} regions
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleShowAll}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showAll ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <EyeIcon className="h-3.5 w-3.5" />
            All regions
          </button>
          <div className="mx-1 h-5 w-px bg-neutral-200" />
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            aria-label="Zoom out"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs font-medium text-neutral-600">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(220, z + 15))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            aria-label="Zoom in"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto flex flex-col items-center gap-5" style={{ width: `${zoom}%`, maxWidth: zoom > 100 ? "none" : "820px" }}>
          {result.answerPages.length === 0 && (
            <div className="mt-20 text-center text-sm text-neutral-400">
              Answer sheet pages are not available in this view.
            </div>
          )}
          {result.answerPages.map((page: PageImage, pageIndex) => {
            const pageOverlays = overlays.filter((o) => o.region.page === pageIndex + 1);
            return (
              <div key={page.url} className="w-full">
                <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
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
                          className={`absolute cursor-pointer rounded-md transition-all duration-200 ${
                            isSelected
                              ? "z-10 border-[3px] border-green-500 bg-green-400/25 shadow-[0_0_0_6px_rgba(34,197,94,0.25)]"
                              : o.kind === "unmatched"
                                ? "border-2 border-amber-400 bg-amber-300/20 hover:bg-amber-300/35"
                                : "border-2 border-green-500/70 bg-green-400/15 hover:bg-green-400/30"
                          } ${dimmed ? "opacity-35" : "opacity-100"}`}
                          style={{
                            left: `${Math.max(0, o.region.bbox.x0 * 100 - 0.4)}%`,
                            top: `${Math.max(0, o.region.bbox.y0 * 100 - 0.6)}%`,
                            width: `${Math.min(100, (o.region.bbox.x1 - o.region.bbox.x0) * 100 + 0.8)}%`,
                            height: `${Math.min(100, (o.region.bbox.y1 - o.region.bbox.y0) * 100 + 1.2)}%`,
                          }}
                        >
                          <span
                            className={`absolute -top-3 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-sm ${
                              isSelected
                                ? "bg-green-600 text-white"
                                : o.kind === "unmatched"
                                  ? "bg-amber-400 text-amber-950"
                                  : "bg-white text-green-700 ring-1 ring-green-500/60"
                            }`}
                          >
                            {o.label === "?" ? "Unmatched" : `Q${o.label}`}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-1.5 text-center text-[11px] text-neutral-400">
                  Page {pageIndex + 1} of {result.answerPages.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex h-9 shrink-0 items-center justify-center gap-4 border-t border-neutral-200 bg-white text-[11px] text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-green-500 bg-green-400/30" />
          Answer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-amber-400 bg-amber-300/30" />
          Unmatched
        </span>
        <span className="hidden sm:inline">Click a box to open its question</span>
      </div>
    </div>
  );
}
