export type PreparedPage = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  name: string;
  source: string;
};

const TARGET_EDGE = 1700;
const SIZE_BUDGET = 3.6 * 1024 * 1024;

type EncodeOptions = { edge: number; quality: number };

async function loadPdfjs() {
  const [pdfjs, workerModule] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.mjs").catch(() => null),
  ]);
  if (workerModule && typeof globalThis !== "undefined") {
    (globalThis as unknown as { pdfjsWorker?: unknown }).pdfjsWorker = workerModule;
  }
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
  return pdfjs;
}

async function fileToBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file);
  } catch {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Could not read image: ${file.name}`));
      };
      img.src = url;
    });
  }
}

function drawToCanvas(
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  srcW: number,
  srcH: number,
  edge: number
): HTMLCanvasElement {
  const scale = Math.min(1, edge / Math.max(srcW, srcH));
  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("JPEG encoding failed."))),
      "image/jpeg",
      quality
    );
  });
}

async function encodePage(
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  srcW: number,
  srcH: number,
  opts: EncodeOptions
): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, opts.edge / Math.max(srcW, srcH));
  const canvas = drawToCanvas(source, srcW, srcH, opts.edge);
  const blob = await canvasToBlob(canvas, opts.quality);
  return { blob, width: Math.round(srcW * scale), height: Math.round(srcH * scale) };
}

async function pagesFromFile(
  file: File,
  opts: EncodeOptions,
  onPage: (done: number) => void
): Promise<PreparedPage[]> {
  const pages: PreparedPage[] = [];
  if (file.type === "application/pdf") {
    const pdfjs = await loadPdfjs();
    const data = new Uint8Array(await file.arrayBuffer());
    const doc = await pdfjs.getDocument({ data }).promise;
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const viewport = page.getViewport({ scale: 1 });
      const renderScale = Math.min(2.5, opts.edge / Math.max(viewport.width, viewport.height));
      const renderViewport = page.getViewport({ scale: renderScale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(renderViewport.width);
      canvas.height = Math.round(renderViewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport: renderViewport }).promise;
      const blob = await canvasToBlob(canvas, opts.quality);
      pages.push({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        name: `${file.name.replace(/\.pdf$/i, "")} — page ${p}`,
        source: file.name,
      });
      page.cleanup();
      onPage(p);
    }
    void doc.destroy();
    return pages;
  }
  const bitmap = await fileToBitmap(file);
  const srcW = "width" in bitmap ? bitmap.width : 0;
  const srcH = "height" in bitmap ? bitmap.height : 0;
  const encoded = await encodePage(bitmap, srcW, srcH, opts);
  if ("close" in bitmap) bitmap.close();
  pages.push({
    blob: encoded.blob,
    url: URL.createObjectURL(encoded.blob),
    width: encoded.width,
    height: encoded.height,
    name: file.name,
    source: file.name,
  });
  onPage(1);
  return pages;
}

export async function preparePages(
  files: File[],
  onProgress: (done: number, total: number) => void
): Promise<PreparedPage[]> {
  if (files.length === 0) return [];
  const ordered = [...files];
  const total = ordered.length;
  let done = 0;
  let opts: EncodeOptions = { edge: TARGET_EDGE, quality: 0.8 };
  let pages = await pagesFromFile(ordered[0], opts, () => {
    done += 1;
    onProgress(done, total);
  });
  for (let i = 1; i < ordered.length; i++) {
    const more = await pagesFromFile(ordered[i], opts, () => {
      done += 1;
      onProgress(done, total);
    });
    pages = pages.concat(more);
  }
  let totalBytes = pages.reduce((s, p) => s + p.blob.size, 0);
  const attempts: EncodeOptions[] = [
    { edge: 1500, quality: 0.72 },
    { edge: 1300, quality: 0.62 },
    { edge: 1100, quality: 0.55 },
  ];
  let attemptIndex = 0;
  while (totalBytes > SIZE_BUDGET && attemptIndex < attempts.length) {
    for (const p of pages) URL.revokeObjectURL(p.url);
    opts = attempts[attemptIndex];
    const rebuilt: PreparedPage[] = [];
    for (const file of ordered) {
      const more = await pagesFromFile(file, opts, () => {});
      rebuilt.push(...more);
    }
    pages = rebuilt;
    totalBytes = pages.reduce((s, p) => s + p.blob.size, 0);
    attemptIndex++;
  }
  return pages;
}
