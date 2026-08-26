import type { AnswerExtraction, Question, QuestionResult } from "./types";

export function normalizeLabel(raw: string): string {
  if (!raw) return "";
  let s = raw.toLowerCase();
  s = s.replace(/[^a-z0-9]/g, "");
  s = s.replace(/^(question|ques|que|answer|ans|no|num|number)/, "");
  s = s.replace(/^q(?=[0-9ivxl])/, "");
  return s;
}

export function parseLabel(norm: string): { number: string; sub: string } {
  const m = norm.match(/^(\d+)([a-z]*)$/);
  if (!m) return { number: norm, sub: "" };
  return { number: m[1], sub: m[2] };
}

export function matchScore(qNorm: string, aNorm: string): number {
  if (!qNorm || !aNorm) return 0;
  if (qNorm === aNorm) return 100;
  const q = parseLabel(qNorm);
  const a = parseLabel(aNorm);
  if (q.number && q.number === a.number) {
    if (q.sub && a.sub) return q.sub === a.sub ? 95 : 0;
    if (!q.sub && !a.sub) return 90;
    return 45;
  }
  if (qNorm.startsWith(aNorm) || aNorm.startsWith(qNorm)) {
    return Math.max(0, 70 - Math.abs(qNorm.length - aNorm.length) * 5);
  }
  return 0;
}

export function extractMarksAndAlt(q: Question): Question {
  let text = q.text;
  let marks = q.marks;
  if (marks == null) {
    const patterns = [
      /\s*[\[(](\d{1,2})\s*(?:marks?|mks?|m)[\])]\.?\s*$/i,
      /\s*\((\d{1,2})\s*marks?\)\s*/i,
      /\s*[\[(](\d{1,2})[\])]\s*\.?\s*$/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        marks = parseInt(m[1], 10);
        text = text.replace(p, "").trim();
        break;
      }
    }
  }
  let altText = q.altText;
  if (!altText) {
    const idx = text.search(/\sOR\s/);
    if (idx > 10) {
      altText = text.slice(idx + 4).trim();
      text = text.slice(0, idx).trim();
    }
  }
  return { ...q, text, marks, altText: altText || null };
}

export function normalizeSubpartMarks(questions: Question[]): Question[] {
  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    if (!q.sub) continue;
    const key = q.number;
    const list = groups.get(key) ?? [];
    list.push(q);
    groups.set(key, list);
  }
  const marksByQuestion = new Map<string, number | null>();
  for (const [, list] of groups) {
    if (list.length < 2) continue;
    const withMarks = list.filter((q) => q.marks != null);
    if (withMarks.length === list.length || withMarks.length === 0) continue;
    const total = Math.max(...withMarks.map((q) => q.marks as number));
    const per = Math.max(1, Math.round(total / list.length));
    for (const q of list) marksByQuestion.set(q.id, per);
  }
  return questions.map((q) =>
    marksByQuestion.has(q.id) ? { ...q, marks: marksByQuestion.get(q.id) ?? q.marks } : q
  );
}

export function splitInlineSubparts(questions: Question[]): Question[] {
  const out: Question[] = [];
  for (const q of questions) {
    if (q.sub) {
      out.push(q);
      continue;
    }
    const markerRe = /\(([a-z]{1,2}|[ivx]{1,5})\)\s+/g;
    const markers = [...q.text.matchAll(markerRe)].filter((m) => m.index !== undefined && m.index > 0);
    if (markers.length >= 2) {
      const stem = q.text.slice(0, markers[0].index!).trim().replace(/[:;]\s*$/, "");
      const parts: { sub: string; text: string }[] = [];
      for (let i = 0; i < markers.length; i++) {
        const start = markers[i].index! + markers[i][0].length;
        const end = i + 1 < markers.length ? markers[i + 1].index! : q.text.length;
        const text = q.text.slice(start, end).trim();
        if (text.length > 2) parts.push({ sub: markers[i][1], text });
      }
      if (parts.length >= 2) {
        const marks = q.marks != null ? Math.max(1, Math.round(q.marks / parts.length)) : null;
        parts.forEach((p, i) => {
          out.push({
            id: `${q.id}s${i + 1}`,
            label: `${q.number}(${p.sub})`,
            number: q.number,
            sub: p.sub,
            text: stem ? `${stem}: ${p.text}` : p.text,
            altText: null,
            marks,
          });
        });
        continue;
      }
    }
    out.push(q);
  }
  return out;
}

export type MapOutcome = {
  results: QuestionResult[];
  unmatched: AnswerExtraction[];
};

export function mapAnswersToQuestions(
  questions: Question[],
  answers: AnswerExtraction[]
): MapOutcome {
  type Cand = { answerId: string; questionId: string; score: number };
  const cands: Cand[] = [];
  for (const a of answers) {
    const aNorm = normalizeLabel(a.rawLabel);
    for (const q of questions) {
      const score = matchScore(normalizeLabel(q.label), aNorm);
      if (score > 0) cands.push({ answerId: a.id, questionId: q.id, score });
    }
  }
  cands.sort((x, y) => y.score - x.score);
  const byQuestion = new Map<string, string>();
  const byAnswer = new Map<string, string>();
  const lowConfidenceAnswers = new Set<string>();
  for (const c of cands) {
    if (byQuestion.has(c.questionId) || byAnswer.has(c.answerId)) continue;
    byQuestion.set(c.questionId, c.answerId);
    byAnswer.set(c.answerId, c.questionId);
    if (c.score < 80) lowConfidenceAnswers.add(c.answerId);
  }
  const results: QuestionResult[] = questions.map((q) => {
    const answerId = byQuestion.get(q.id) ?? null;
    return {
      question: q,
      answerId,
      status: answerId ? "matched" : "unanswered",
      lowConfidence: answerId ? lowConfidenceAnswers.has(answerId) : false,
      grading: null,
    };
  });
  const unmatched = answers.filter((a) => !byAnswer.has(a.id));
  return { results, unmatched };
}
