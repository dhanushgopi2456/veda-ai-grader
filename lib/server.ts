import { ApiError, detectProvider, type MediaPart } from "./ai";

export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const DEFAULT_MODELS: Record<"openrouter" | "gemini", string> = {
  openrouter: "dots-studio/dots-3-note-preview:free",
  gemini: "gemini-3.8-flash",
};

export function isRealKey(k: string | undefined | null): boolean {
  if (!k) return false;
  const t = k.trim();
  if (
    !t ||
    t === "MY_GEMINI_API_KEY" ||
    t === "YOUR_API_KEY" ||
    t.startsWith("MY_") ||
    t.startsWith("YOUR_")
  ) {
    return false;
  }
  return true;
}

export function resolveModel(
  bodyModel: string | null,
  apiKey: string
): string {
  const model = (bodyModel || "").trim();
  const provider = detectProvider(apiKey);

  if (model) {
    if (provider === "gemini") {
      // Migrate deprecated gemini models to gemini-3.8-flash
      if (model.includes("2.5") || model.includes("2.0") || model.includes("1.5")) {
        return "gemini-3.8-flash";
      }
    }
    return model;
  }

  return DEFAULT_MODELS[provider];
}

export function resolveApiKey(bodyKey: string | null): string {
  if (isRealKey(bodyKey)) {
    return (bodyKey as string).trim();
  }

  // Prioritize real configured server keys
  if (isRealKey(process.env.OPENROUTER_API_KEY)) {
    return (process.env.OPENROUTER_API_KEY as string).trim();
  }

  if (isRealKey(process.env.GEMINI_API_KEY)) {
    return (process.env.GEMINI_API_KEY as string).trim();
  }

  throw new ApiError(
    "No AI API key found. Add your Gemini or OpenRouter key in Settings (top-right) to run the evaluation.",
    400
  );
}

function detectMimeType(file: File): string {
  if (SUPPORTED_IMAGE_TYPES.has(file.type)) return file.type;
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return file.type || "image/jpeg";
}

export async function filesToMediaParts(
  files: File[]
): Promise<MediaPart[]> {
  const parts: MediaPart[] = [];

  for (const file of files) {
    const mimeType = detectMimeType(file);
    if (!SUPPORTED_IMAGE_TYPES.has(mimeType)) {
      throw new ApiError(
        `Unsupported file type: ${file.name}. Upload PDF or image files.`,
        400
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length === 0) {
      throw new ApiError(
        `The uploaded file "${file.name}" is empty or could not be read.`,
        400
      );
    }

    parts.push({
      inlineData: {
        mimeType,
        data: buffer.toString("base64"),
      },
    });
  }

  if (parts.length === 0) {
    throw new ApiError(
      "No pages received. Please upload your files again.",
      400
    );
  }

  return parts;
}

export function jsonError(err: unknown): Response {
  if (err instanceof ApiError) {
    return Response.json(
      { error: err.message },
      { status: err.status }
    );
  }

  const msg =
    err instanceof Error
      ? err.message
      : "Unexpected server error";

  return Response.json(
    { error: msg.slice(0, 300) },
    { status: 500 }
  );
}