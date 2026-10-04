import { GoogleGenAI } from "@google/genai";
import { detectProvider } from "@/lib/ai";
import { isRealKey } from "@/lib/server";

export const runtime = "nodejs";

export async function GET() {
  const hasServerKey = Boolean(
    isRealKey(process.env.GEMINI_API_KEY) || isRealKey(process.env.OPENROUTER_API_KEY)
  );
  return Response.json({ hasServerKey });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { apiKey?: string; model?: string };
    let key = (body.apiKey || "").trim();
    if (!isRealKey(key)) {
      if (isRealKey(process.env.OPENROUTER_API_KEY)) {
        key = (process.env.OPENROUTER_API_KEY as string).trim();
      } else if (isRealKey(process.env.GEMINI_API_KEY)) {
        key = (process.env.GEMINI_API_KEY as string).trim();
      }
    }
    if (!key) {
      return Response.json({ ok: false, error: "No API key provided." }, { status: 400 });
    }
    let model = (body.model || "").trim();
    if (detectProvider(key) === "openrouter") {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: model || "dots-studio/dots-3-note-preview:free",
          max_tokens: 2000,
          messages: [{ role: "user", content: "Reply with the single word OK." }],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = text.slice(0, 200);
        try {
          msg = (JSON.parse(text) as { error?: { message?: string } }).error?.message ?? msg;
        } catch {}
        return Response.json({ ok: false, error: msg }, { status: 400 });
      }
      return Response.json({ ok: true });
    }
    if (model.includes("2.5") || model.includes("2.0") || !model) {
      model = "gemini-3.8-flash";
    }
    const ai = new GoogleGenAI({ apiKey: key });
    await ai.models.generateContent({
      model,
      contents: "Reply with the single word OK.",
      config: { maxOutputTokens: 2000 },
    });
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Key check failed";
    return Response.json({ ok: false, error: msg.slice(0, 200) }, { status: 400 });
  }
}
