import type { QuestionGrading, OverallFeedback, Verdict } from "@/lib/types";
import { GRADING_PROMPT, generateJson, gradingSchema } from "@/lib/ai";
import { jsonError, resolveApiKey, resolveModel } from "@/lib/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const VERDICTS: Verdict[] = ["correct", "partial", "incorrect", "unanswered"];

type GradeInput = {
  questions: {
    id: string;
    label: string;
    text: string;
    altText: string | null;
    marks: number | null;
  }[];
  answers: { questionId: string; label: string; transcription: string }[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GradeInput & {
      apiKey?: string;
      model?: string;
    };
    const apiKey = resolveApiKey(body.apiKey ?? null);
    const model = resolveModel(body.model ?? null, apiKey);
    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      return Response.json({ error: "No questions to grade." }, { status: 400 });
    }
    const answerByQ = new Map(
      (Array.isArray(body.answers) ? body.answers : []).map((a) => [a.questionId, a])
    );
    const payload = {
      questions: body.questions.map((q) => {
        const a = answerByQ.get(q.id);
        return {
          id: q.id,
          label: q.label,
          marksTotal: q.marks ?? 5,
          questionText: q.text,
          alternativeText: q.altText ?? "",
          studentAnswer: a ? a.transcription : "",
          answered: Boolean(a),
        };
      }),
    };
    const data = await generateJson({
      apiKey,
      model,
      prompt:
        GRADING_PROMPT +
        `\n\nInput JSON:\n${JSON.stringify(payload, null, 2)}`,
      parts: [],
      schema: gradingSchema,
      temperature: 0.2,
    });
    const rawGrading = Array.isArray(data.grading) ? data.grading : [];
    const gradingMap = new Map<string, QuestionGrading>();
    for (const g of rawGrading) {
      const obj = g as Record<string, unknown>;
      const questionId = String(obj.questionId ?? "");
      const verdictRaw = String(obj.verdict ?? "").toLowerCase() as Verdict;
      const verdict = VERDICTS.includes(verdictRaw) ? verdictRaw : "partial";
      if (!questionId) continue;
      const q = body.questions.find((x) => x.id === questionId);
      const marksTotal = q?.marks ?? 5;
      const awardedRaw = Number(obj.marksAwarded ?? 0);
      const marksAwarded = Math.max(
        0,
        Math.min(marksTotal, Math.round(Number.isFinite(awardedRaw) ? awardedRaw : 0))
      );
      gradingMap.set(questionId, {
        questionId,
        verdict,
        marksAwarded,
        marksTotal,
        feedback: String(obj.feedback ?? "").trim(),
      });
    }
    const grading: QuestionGrading[] = body.questions.map((q) => {
      const existing = gradingMap.get(q.id);
      if (existing) {
        if (!answerByQ.has(q.id)) {
          return { ...existing, verdict: "unanswered", marksAwarded: 0 };
        }
        return existing;
      }
      const answered = answerByQ.has(q.id);
      const marksTotal = q.marks ?? 5;
      return {
        questionId: q.id,
        verdict: answered ? "partial" : "unanswered",
        marksAwarded: 0,
        marksTotal,
        feedback: answered
          ? "The answer could not be fully evaluated. Please review it manually."
          : "No answer was found for this question in the answer sheet.",
      };
    });
    const o = (data.overall ?? {}) as Record<string, unknown>;
    const totalMax = grading.reduce((s, g) => s + g.marksTotal, 0);
    const totalAwarded = grading.reduce((s, g) => s + g.marksAwarded, 0);
    const pct = totalMax > 0 ? (totalAwarded / totalMax) * 100 : 0;
    const fallbackGrade =
      pct >= 90 ? "A+" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 45 ? "C" : pct >= 33 ? "D" : "F";
    const overall: OverallFeedback = {
      totalAwarded,
      totalMax,
      gradeLetter: String(o.gradeLetter ?? fallbackGrade).trim() || fallbackGrade,
      summary: String(o.summary ?? "").trim(),
      strengths: Array.isArray(o.strengths) ? o.strengths.map(String).slice(0, 4) : [],
      improvements: Array.isArray(o.improvements)
        ? o.improvements.map(String).slice(0, 4)
        : [],
    };
    return Response.json({ grading, overall });
  } catch (err) {
    return jsonError(err);
  }
}
