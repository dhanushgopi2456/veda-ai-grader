import type { AnswerExtraction, Region } from "@/lib/types";
import { ANSWERS_PROMPT, ApiError, answersSchema, generateJson } from "@/lib/ai";
import { filesToMediaParts, jsonError, resolveApiKey, resolveModel } from "@/lib/server";

export const runtime = "nodejs";
export const maxDuration = 300;

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const apiKey = resolveApiKey(form.get("apiKey") as string | null);
    const model = resolveModel(form.get("model") as string | null, apiKey);
    const files = form.getAll("pages").filter((f): f is File => f instanceof File);
    const parts = await filesToMediaParts(files);
    const data = await generateJson({
      apiKey,
      model,
      prompt: ANSWERS_PROMPT,
      parts,
      schema: answersSchema,
      temperature: 0.1,
    });
    const rawAnswers = Array.isArray(data.answers) ? data.answers : [];
    const answers: AnswerExtraction[] = [];
    rawAnswers.forEach((a, i) => {
      const obj = a as Record<string, unknown>;
      const rawRegions = Array.isArray(obj.regions) ? obj.regions : [];
      const regions: Region[] = [];
      for (const r of rawRegions) {
        const ro = r as Record<string, unknown>;
        const page = Math.round(Number(ro.page ?? 0));
        const ymin = Number(ro.ymin ?? NaN);
        const xmin = Number(ro.xmin ?? NaN);
        const ymax = Number(ro.ymax ?? NaN);
        const xmax = Number(ro.xmax ?? NaN);
        if (
          !Number.isFinite(ymin) ||
          !Number.isFinite(xmin) ||
          !Number.isFinite(ymax) ||
          !Number.isFinite(xmax)
        )
          continue;
        let y0 = Math.min(ymin, ymax) / 1000;
        let y1 = Math.max(ymin, ymax) / 1000;
        let x0 = Math.min(xmin, xmax) / 1000;
        let x1 = Math.max(xmin, xmax) / 1000;
        const scaled = y1 - y0 > 1 || x1 - x0 > 1;
        if (scaled) {
          y0 /= 1000;
          y1 /= 1000;
          x0 /= 1000;
          x1 /= 1000;
        }
        y0 = clamp01(y0);
        y1 = clamp01(y1);
        x0 = clamp01(x0);
        x1 = clamp01(x1);
        if (y1 - y0 < 0.005 || x1 - x0 < 0.005) continue;
        if (page < 1 || page > files.length) continue;
        regions.push({
          page,
          bbox: { x0, y0, x1, y1 },
        });
      }
      if (regions.length === 0) return;
      const confidence =
        typeof obj.confidence === "number" && Number.isFinite(obj.confidence)
          ? Math.min(1, Math.max(0, obj.confidence > 1 ? obj.confidence / 100 : obj.confidence))
          : 0.7;
      answers.push({
        id: `a${i + 1}`,
        rawLabel: String(obj.rawLabel ?? "").trim(),
        transcription: String(obj.transcription ?? "").trim(),
        confidence,
        regions,
      });
    });
    if (answers.length === 0) {
      throw new ApiError(
        "No handwritten answers could be detected in the answer sheet. Make sure the scans are readable.",
        422
      );
    }
    return Response.json({ answers });
  } catch (err) {
    return jsonError(err);
  }
}
