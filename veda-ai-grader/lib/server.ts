import { ApiError, detectProvider, type MediaPart } from "./ai";

export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const DEFAULT_MODELS: Record<"openrouter" | "gemini", string> = {
  openrouter: "dots-studio/dots-3-note-preview:free",
  gemini: "gemini-2.5-flash",
};

export function resolveModel(bodyModel: string | null, apiKey: string): string {
  const model = (bodyModel || "").trim();
  if (model) return model;
  return DEFAULT_MODELS[detectProvider(apiKey)];
}

export function resolveApiKey(bodyKey: string | null): string {
  const key = (
    bodyKey ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    ""
  ).trim();
  if (!key) {
    throw new ApiError(
      "No AI API key found. Add your Gemini or OpenRouter key in Settings (top-right) to run the evaluation.",
      400
    );
  }
  return key;
}

export async function filesToMediaParts(
  files: File[]
): Promise<MediaPart[]> {
  const parts: MediaPart[] = [];
  for (const file of files) {
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      throw new ApiError(
        `Unsupported file type: ${file.name}. Upload PDF or image files.`,
        400
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    parts.push({
      inlineData: { mimeType: "image/jpeg", data: buffer.toString("base64") },
    });
  }
  if (parts.length === 0) {
    throw new ApiError("No pages received. Please upload your files again.", 400);
  }
  return parts;
}

export function jsonError(err: unknown): Response {
  if (err instanceof ApiError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  const msg = err instanceof Error ? err.message : "Unexpected server error";
  return Response.json({ error: msg.slice(0, 300) }, { status: 500 });
}
