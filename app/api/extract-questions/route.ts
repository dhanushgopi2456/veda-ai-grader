import type { Question } from "@/lib/types";
import {
  ApiError,
  QUESTIONS_PROMPT,
  generateJson,
  questionsSchema,
} from "@/lib/ai";
import {
  extractMarksAndAlt,
  normalizeSubpartMarks,
  splitInlineSubparts,
} from "@/lib/labels";
import { filesToMediaParts, jsonError, resolveApiKey, resolveModel } from "@/lib/server";

export const runtime = "nodejs";
export const maxDuration = 300;

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
      prompt: QUESTIONS_PROMPT,
      parts,
      schema: questionsSchema,
      temperature: 0.1,
    });
    const rawQuestions = Array.isArray(data.questions) ? data.questions : [];
    const questions: Question[] = rawQuestions
      .map((q, i) => {
        const obj = q as Record<string, unknown>;
        const label = String(obj.label ?? "").trim() || `Q${i + 1}`;
        const number = String(obj.number ?? "").trim() || label;
        const subRaw = obj.sub == null ? "" : String(obj.sub).trim();
        let text = String(obj.text ?? "").trim();
        if (subRaw) {
          const marker = `(${subRaw.toLowerCase()})`;
          const lower = text.toLowerCase();
          if (lower.startsWith(marker)) text = text.slice(marker.length).trimStart();
          else if (lower.startsWith(`${subRaw.toLowerCase()})`)) {
            text = text.slice(subRaw.length + 1).trimStart();
          }
        }
        const marksNum =
          typeof obj.marks === "number"
            ? obj.marks
            : typeof obj.marks === "string"
              ? parseFloat(obj.marks.replace(/[^0-9.]/g, ""))
              : NaN;
        return {
          id: `q${i + 1}`,
          label,
          number,
          sub: subRaw || null,
          text,
          altText: obj.altText == null ? null : String(obj.altText).trim() || null,
          marks:
            Number.isFinite(marksNum) && marksNum > 0
              ? Math.max(0, Math.round(marksNum))
              : null,
        };
      })
      .filter((q) => q.text.length > 0);
    const finalQuestions = normalizeSubpartMarks(
      splitInlineSubparts(questions.map(extractMarksAndAlt))
    ).map((q, i) => ({
      ...q,
      id: `q${i + 1}`,
    }));
    if (finalQuestions.length === 0) {
      throw new ApiError(
        "No questions could be detected in the question paper. Make sure the file is readable.",
        422
      );
    }
    return Response.json({
      examTitle: String(data.examTitle ?? "").trim(),
      questions: finalQuestions,
    });
  } catch (err) {
    return jsonError(err);
  }
}
