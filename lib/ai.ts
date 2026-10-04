export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export type MediaPart = { inlineData: { mimeType: string; data: string } };

type SchemaNode = {
  type: string | string[];
  items?: SchemaNode;
  properties?: Record<string, SchemaNode>;
  required?: string[];
  additionalProperties?: false;
  description?: string;
};

export type JsonSchema = SchemaNode & { type: "object" };

type Provider = "openrouter" | "gemini";

export function detectProvider(apiKey: string): Provider {
  return apiKey.startsWith("sk-or-") ? "openrouter" : "gemini";
}

export const QUESTIONS_PROMPT = `You are an expert exam-paper parser. You are given the pages of ONE question paper, in reading order (as images).

Extract EVERY question exactly as printed, in the original printed order.

Rules:
- Preserve the original numbering exactly. Do NOT renumber or skip.
- Labelled sub-parts are SEPARATE questions: "11 (a)" and "11 (b)" are two entries (number "11", subs "a" and "b"). The same applies to (i)/(ii), 1)/2), I./II. styles.
- CRITICAL: if a question contains labelled sub-parts like "(a) ... (b) ..." or "(i) ... (ii) ..." — even when printed inline on the same line — each sub-part MUST become its own entry with label like "3(a)", "3(b)" and the shared stem text prefixed to each.
- label = the exact printed label including sub-part, e.g. "1", "11(a)", "12(i)".
- number = main question number only, e.g. "11". sub = sub-part letter/numeral without brackets, e.g. "a"; null if none.
- If a question has an internal choice ("OR ..."), put the first option in "text" and the alternative in "altText". Otherwise altText is null.
- marks is IMPORTANT: question papers almost always print marks near the question, e.g. "[2]", "(5 marks)", "3M". Convert it to a number and put it in "marks". Do NOT leave marks null when a number is printed near the question. Only use null when genuinely nothing is printed. Never include the marks notation inside "text" — strip it from the text.
- Transcribe the full question text faithfully in plain text (formulas in simple notation, e.g. H2O, x^2).
- Ignore general instructions, headers/footers, blank space and any answer-key markings.
- examTitle = paper title/subject/class/exam name if visible, else an empty string.`;

export const ANSWERS_PROMPT = `You are an expert at reading scanned handwritten student answer sheets. You are given ALL pages of ONE student's answer sheet, in page order (page 1 = first image).

Identify every answer the student wrote and group the content into answers.

Rules:
- One answer = everything written for ONE question label: the text, equations, working, bullet lists and diagrams belonging to it.
- An answer may occupy part of a page or continue across several pages: in that case it is ONE entry whose "regions" array contains one region per page segment.
- rawLabel = the question label exactly as the student wrote it (e.g. "11(a)", "11 a.", "Q.11(b)", "Ans 4"). If the student wrote no label, infer the most likely one from position/context and LOWER the confidence; if truly impossible, use "".
- transcription = faithful, complete transcription of the handwriting in plain text. Use simple notation for math (e.g. 6CO2 + 6H2O -> C6H12O6 + 6O2). Briefly describe diagrams/tables in square brackets, e.g. [labelled diagram of heart].
- confidence = 0 to 1, reflecting how sure you are of the label and the grouping.
- regions = tight bounding boxes around ALL content of that answer (text AND diagrams), EXCLUDING ruled lines and other answers. Coordinates are integers normalized 0-1000 relative to the page width/height, as {page, ymin, xmin, ymax, xmax} where page is the 1-based page number in the given order. Boxes must tightly enclose only that answer's content.
- EXCLUDE: student name/roll number/class headers, teacher remarks, margin scribbles, rough work clearly struck out, and any printed text.
- Do NOT merge two different question labels into one answer, and never split one label's content into two answers.
- Every handwritten block that answers a question must appear in exactly one answer entry.`;

export const GRADING_PROMPT = `You are an experienced, fair examiner grading a student's answer sheet. You receive the exam questions (with marks) and the transcription of the student's answer for each matched question.

For every question:
- marksAwarded = integer between 0 and marksTotal. Give partial credit where the answer covers some key points. Be reasonably strict about required key points, but do NOT penalize minor spelling, phrasing or notation issues. If the transcription seems incomplete or hard to read, grade leniently based on the visible content.
- verdict = "correct" if awarded >= 85% of marks, "partial" if awarded > 0 but < 85%, "incorrect" if 0 with a substantive attempt, "unanswered" if there was no answer.
- feedback = 1-3 sentences in a constructive teacher tone: what was right, what was missing, and one concrete improvement. For unanswered questions, one short sentence.

For the overall object:
- totalAwarded = sum of marksAwarded; totalMax = sum of marksTotal.
- gradeLetter from percentage: >=90 A+, >=75 A, >=60 B, >=45 C, >=33 D, else F.
- summary = 2-3 sentences describing overall performance.
- strengths = 2-4 short bullet strings; improvements = 2-4 short bullet strings.`;

export const questionsSchema: JsonSchema = {
  type: "object",
  properties: {
    examTitle: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          number: { type: "string" },
          sub: { type: ["string", "null"] },
          text: { type: "string" },
          altText: { type: ["string", "null"] },
          marks: { type: ["integer", "null"] },
        },
        required: ["label", "number", "sub", "text", "altText", "marks"],
        additionalProperties: false,
      },
    },
  },
  required: ["examTitle", "questions"],
  additionalProperties: false,
};

export const answersSchema: JsonSchema = {
  type: "object",
  properties: {
    answers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rawLabel: { type: "string" },
          transcription: { type: "string" },
          confidence: { type: "number" },
          regions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                page: { type: "integer" },
                ymin: { type: "integer" },
                xmin: { type: "integer" },
                ymax: { type: "integer" },
                xmax: { type: "integer" },
              },
              required: ["page", "ymin", "xmin", "ymax", "xmax"],
              additionalProperties: false,
            },
          },
        },
        required: ["rawLabel", "transcription", "confidence", "regions"],
        additionalProperties: false,
      },
    },
  },
  required: ["answers"],
  additionalProperties: false,
};

export const gradingSchema: JsonSchema = {
  type: "object",
  properties: {
    grading: {
      type: "array",
      items: {
        type: "object",
        properties: {
          questionId: { type: "string" },
          verdict: { type: "string" },
          marksAwarded: { type: "integer" },
          feedback: { type: "string" },
        },
        required: ["questionId", "verdict", "marksAwarded", "feedback"],
        additionalProperties: false,
      },
    },
    overall: {
      type: "object",
      properties: {
        totalAwarded: { type: "integer" },
        totalMax: { type: "integer" },
        gradeLetter: { type: "string" },
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } },
      },
      required: [
        "totalAwarded",
        "totalMax",
        "gradeLetter",
        "summary",
        "strengths",
        "improvements",
      ],
      additionalProperties: false,
    },
  },
  required: ["grading", "overall"],
  additionalProperties: false,
};

const GEMINI_TYPES: Record<string, string> = {
  object: "OBJECT",
  array: "ARRAY",
  string: "STRING",
  integer: "INTEGER",
  number: "NUMBER",
  boolean: "BOOLEAN",
};

function toGeminiSchema(s: SchemaNode): Record<string, unknown> {
  const types = Array.isArray(s.type) ? s.type : [s.type];
  const nullable = types.includes("null");
  const main = types.find((t) => t !== "null") ?? "string";
  const out: Record<string, unknown> = { type: GEMINI_TYPES[main] ?? "STRING", nullable };
  if (s.description) out.description = s.description;
  if (main === "array" && s.items) {
    out.items = toGeminiSchema(s.items);
  }
  if (main === "object" && s.properties) {
    const props: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(s.properties)) props[k] = toGeminiSchema(v);
    out.properties = props;
    if (s.required) out.required = s.required;
  }
  return out;
}

function extractJson(text: string): Record<string, unknown> {
  const t0 = text.trim();
  const fence = t0.match(/```(?:json)?\s*([\s\S]*?)```/);
  let t = fence ? fence[1].trim() : t0;
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) {
    t = t.slice(start, end + 1);
  } else {
    throw new ApiError(
      `AI model output did not contain valid JSON: ${t0.slice(0, 150)}`,
      502
    );
  }
  try {
    return JSON.parse(t) as Record<string, unknown>;
  } catch {
    throw new ApiError(
      `AI model output could not be parsed as JSON: ${t0.slice(0, 150)}`,
      502
    );
  }
}

function mapHttpError(status: number, body: string): ApiError {
  const snippet = body.slice(0, 300);
  if (status === 401 || status === 403) {
    return new ApiError("Your API key is not valid. Check it in Settings.", 401);
  }
  if (status === 402) {
    return new ApiError(
      "This model needs OpenRouter credits. Pick a model marked (free) in Settings.",
      402
    );
  }
  if (status === 429) {
    return new ApiError(
      "Rate limit or daily quota reached for this model. Wait a moment, or pick another model in Settings.",
      429
    );
  }
  if (status === 404) {
    return new ApiError("This model is not available. Pick another model in Settings.", 404);
  }
  return new ApiError(`AI request failed (${status}): ${snippet}`, 502);
}

async function callGemini(opts: {
  apiKey: string;
  model: string;
  prompt: string;
  parts: MediaPart[];
  schema: JsonSchema;
  temperature: number;
}): Promise<Record<string, unknown>> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: opts.apiKey });
  try {
    const response = await ai.models.generateContent({
      model: opts.model,
      contents: [{ role: "user", parts: [...opts.parts, { text: opts.prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: toGeminiSchema(opts.schema) as never,
        temperature: opts.temperature,
      },
    });
    const text = response.text ?? "";
    if (!text.trim()) {
      throw new ApiError("The AI model returned an empty response. Please try again.", 502);
    }
    return extractJson(text);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    if (/API key not valid|API_KEY_INVALID|invalid api key/i.test(msg)) {
      throw new ApiError("Your Gemini API key is not valid. Check it in Settings.", 401);
    }
    if (/quota|RESOURCE_EXHAUSTED|rate.?limit/i.test(msg)) {
      throw new ApiError(
        "Gemini API quota exceeded or rate limited. Wait a moment and try again, or use another key.",
        429
      );
    }
    if (/permission|PERMISSION_DENIED/i.test(msg)) {
      throw new ApiError(
        "The API key does not have access to this model. Try the other model in Settings.",
        403
      );
    }
    if (/fetch failed|network|ECONNRESET|timeout/i.test(msg)) {
      throw new ApiError("Network error while contacting the AI provider.", 504);
    }
    throw new ApiError(msg.slice(0, 300), 500);
  }
}

async function callOpenRouter(
  opts: {
    apiKey: string;
    model: string;
    prompt: string;
    parts: MediaPart[];
    schema: JsonSchema;
    temperature: number;
  },
  mode: "json_schema" | "json_object"
): Promise<Record<string, unknown>> {
  const content: unknown[] = opts.parts.map((p) => ({
    type: "image_url",
    image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` },
  }));
  let prompt = opts.prompt;
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: [{ role: "user", content }],
    temperature: opts.temperature,
    max_tokens: 8192,
  };
  if (mode === "json_schema") {
    body.response_format = {
      type: "json_schema",
      json_schema: { name: "result", strict: true, schema: opts.schema },
    };
  } else {
    body.response_format = { type: "json_object" };
    prompt +=
      "\n\nRespond with ONLY a single JSON object (no commentary) matching exactly this JSON shape:\n" +
      JSON.stringify(opts.schema);
  }
  content.push({ type: "text", text: prompt });
  let res: Response;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiKey}`,
        "HTTP-Referer": "https://vedaai-grader.app",
        "X-Title": "VedaAI Grader",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Network error while contacting OpenRouter.", 504);
  }
  if (!res.ok) {
    const errText = await res.text();
    if (mode === "json_schema" && /response_format|json_schema|structured|schema/i.test(errText)) {
      return callOpenRouter(opts, "json_object");
    }
    throw mapHttpError(res.status, errText);
  }
  let data: {
    choices?: { message?: { content?: string | null; reasoning?: string | null } }[];
    error?: { message?: string };
  } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    throw new ApiError("Model provider returned a non-JSON response.", 502);
  }
  if (data.error) {
    throw new ApiError((data.error.message ?? "Unknown provider error").slice(0, 300), 502);
  }
  const text: string = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) {
    throw new ApiError("The AI model returned an empty response. Please try again.", 502);
  }
  try {
    return extractJson(text);
  } catch {
    throw new ApiError("Could not parse the AI response. Please try again.", 502);
  }
}

export async function generateJson(opts: {
  apiKey: string;
  model: string;
  prompt: string;
  parts: MediaPart[];
  schema: JsonSchema;
  temperature?: number;
}): Promise<Record<string, unknown>> {
  const temperature = opts.temperature ?? 0.2;
  if (detectProvider(opts.apiKey) === "openrouter") {
    return callOpenRouter({ ...opts, temperature }, "json_schema");
  }
  return callGemini({ ...opts, temperature });
}
