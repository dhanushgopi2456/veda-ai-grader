# VedaAI — AI Answer Sheet Evaluation

Upload a **question paper** and a **student's handwritten answer sheet** (PDF or images).
VedaAI extracts every question, locates each handwritten answer on the sheet, maps answers to
questions, and grades the paper with AI feedback — with the exact answer region highlighted.

Built for the VedaAI Hiring Assignment.

## Features

- **Upload both files** (PDF/JPG/PNG/WEBP, multiple files supported) with staged processing progress
- **Question extraction** preserving original numbering and printed order
  - Labelled sub-parts become separate entries (`11 (a)` and `11 (b)` → two questions)
  - Internal choices ("OR ...") captured as alternative text
  - Marks detected from notation like `[2]`, `(5 marks)`, `3M`
- **Answer extraction** with tight bounding boxes per page (0–1000 normalized coords)
  - Multi-page answers span multiple regions
  - Handwriting transcription included for grading and review
- **Answer mapping** by label matching (handles `Q11.`, `Ans 4`, `11 a)`, roman numerals, …)
  - Out-of-order answers handled (mapping is label-based, not positional)
  - Unanswered questions flagged
  - Answers that match no question listed separately
  - Uncertain matches flagged with a "Check" badge
  - Manual re-mapping dropdowns (teacher can link/unlink any answer) with automatic regrading
- **Grading & feedback** — per-question verdict (correct / partial / incorrect / unanswered),
  marks awarded, constructive feedback, plus overall score, grade letter, summary, strengths and
  improvements
- **Side-by-side results view** — question cards with AI feedback on the left, the answer sheet on
  the right with color-coded highlight boxes; clicking a question auto-scrolls to and pulses the
  exact answer region (and vice versa)
- **History** of evaluations in the current session (in-memory only)
- **Sample papers** built in ("Try it with sample papers") for instant demo

## How it works

```
Upload → client-side rasterization (PDF pages → JPEG, size-budgeted)
       → /api/extract-questions  (vision LLM, JSON-schema constrained)
       → /api/extract-answers    (vision LLM, bounding boxes + transcription)
       → label matching (server-of-truth: pure functions in lib/labels.ts)
       → /api/grade              (LLM per-question verdicts + overall summary)
       → results UI (highlights, remapping, insights)
```

PDFs and images are rasterized **in the browser** (pdf.js), so the server never handles PDFs,
page numbering is deterministic, and highlight boxes align exactly with what you see.

## AI providers

Works with either key (auto-detected, entered in Settings, stored in `localStorage`):

- **OpenRouter** key (`sk-or-…`) — free models such as `dots-3-note`, MiniMax M3, Gemma 4
- **Google Gemini** key (`AIza…`) from AI Studio — `gemini-2.5-flash` / `gemini-2.5-pro`

You can also provide a key server-side via env var (`OPENROUTER_API_KEY` or `GEMINI_API_KEY`).

## Running locally in VS Code

### 1. Prerequisites

- **Node.js 20 or newer** — check with `node -v` (download from https://nodejs.org if missing)
- **Visual Studio Code** — https://code.visualstudio.com
- **An AI API key** (free):
  - OpenRouter: https://openrouter.ai/keys → create key (starts with `sk-or-…`), or
  - Google AI Studio: https://aistudio.google.com/apikey → create key (starts with `AIza…`)

Recommended VS Code extensions (optional): **ESLint**, **Prettier**, **Tailwind CSS IntelliSense**.

### 2. Open the project

1. Open VS Code → **File ▸ Open Folder…** → select the `veda-ai-grader` folder
2. Open the integrated terminal: **Terminal ▸ New Terminal** (or `` Ctrl+` ``)

### 3. Install & run

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser (Ctrl+Click the link printed in the terminal).

### 4. Add your API key (one time, per browser)

1. Click **Settings** in the left sidebar (or the gear icon, top right)
2. Paste your OpenRouter or Gemini key → click **Test** → you should see "Key works"
3. Pick a model (free models are marked) → **Save**

The key is stored only in your browser's `localStorage` — nothing is sent anywhere except the
AI provider you chose.

### 5. Try it

- Click **Try it with sample papers** to run the full flow on bundled sample files, or
- Upload your own question paper + answer sheet (PDF, JPG, PNG) and press **Get Feedback**

### Useful commands

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the dev server (hot reload)         |
| `npm run build`   | Create a production build                 |
| `npm start`       | Serve the production build                |
| `npm run lint`    | Run ESLint                                |

Troubleshooting:
- **Port already in use** → `npm run dev -- -p 3001`
- **"No AI API key found"** → add your key in Settings (step 4)
- **Free model rate-limited (429)** → wait a minute or switch model in Settings

## Deployment

Deployable to any Node host (built with Next.js App Router):

```bash
npm run build && npm start
```

Or push to GitHub and import in Vercel. No database, no auth, no server env required —
teachers bring their own key through the UI. (Optional: set `OPENROUTER_API_KEY` /
`GEMINI_API_KEY` as an env var to pre-provision a key.)

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Google Gemini / OpenRouter vision models with JSON-schema-constrained output
- pdf.js for client-side PDF rasterization
- No database — in-memory session state only
