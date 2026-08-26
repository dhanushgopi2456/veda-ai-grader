import { GoogleGenAI } from "@google/genai";
import { detectProvider } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { apiKey?: string; model?: string };
    const key = (
      body.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      ""
    ).trim();
    if (!key) {
      return Response.json({ ok: false, error: "No API key provided." }, { status: 400 });
    }
    const model = (body.model || "").trim();
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
    const ai = new GoogleGenAI({ apiKey: key });
    await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      contents: "Reply with the single word OK.",
      config: { maxOutputTokens: 2000 },
    });
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Key check failed";
    return Response.json({ ok: false, error: msg.slice(0, 200) }, { status: 400 });
  }
}
