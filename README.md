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

## Approach / Technical Explanation

The main goal of VedaAI was to build an answer-sheet evaluation system that works with real handwritten exam papers rather than relying only on plain text extraction.

### 1. Input Processing

The application accepts a question paper and a student's handwritten answer sheet as PDF or image files.

Instead of sending PDFs directly to the backend, I rasterize PDF pages in the browser using **pdf.js**. Each page is converted into a JPEG image with a controlled size budget.

This approach has two benefits:

* The AI model receives the same page image that the teacher sees.
* The coordinates returned by the vision model can be directly mapped to the displayed page, making answer highlighting accurate.

### 2. Question Extraction

The question paper images are sent to the vision model through `/api/extract-questions`.

The model is instructed to return structured JSON rather than free-form text. The extraction preserves:

* Original question numbering
* Sub-parts such as `11 (a)` and `11 (b)`
* Internal choices such as `OR`
* Marks such as `[2]`, `(5 marks)`, and `3M`
* The original printed order

Using schema-constrained JSON makes the output predictable and easier for the application to process.

### 3. Handwritten Answer Extraction

The answer-sheet pages are processed separately through `/api/extract-answers`.

For every detected answer, the model returns:

* Answer label
* Page number
* Bounding box
* Handwriting transcription
* Confidence information when applicable

Bounding boxes use normalized coordinates from `0–1000`, so they remain independent of the actual image resolution.

For answers that continue onto another page, multiple regions are stored instead of forcing the answer into one bounding box.

### 4. Answer-to-Question Mapping

A key design decision was to **avoid positional matching**.

A student may answer questions in a different order, skip questions, or write labels such as:

* `Q11`
* `Ans 4`
* `11 a)`
* `iv`

Therefore, the server uses pure label-processing functions in `lib/labels.ts` to normalize and compare labels.

The mapping process identifies:

* Correctly matched answers
* Unanswered questions
* Answers that do not correspond to any question
* Uncertain matches that require teacher verification

This makes the mapping deterministic and keeps it independent from the AI grading step.

### 5. AI Grading

Once the questions and answers are mapped, `/api/grade` evaluates each question-answer pair.

The grading model considers the question, expected answer context, marks, and student's transcribed answer.

For every question it produces:

* Verdict: correct / partial / incorrect / unanswered
* Marks awarded
* Feedback explaining the result

The API also generates an overall evaluation containing:

* Total score
* Grade
* Summary
* Strengths
* Areas for improvement

Separating extraction, mapping, and grading makes the system easier to debug and replace individual components without affecting the complete pipeline.

### 6. Visual Result Verification

The results screen connects the AI evaluation back to the original answer sheet.

Each question card displays its grading information alongside the corresponding answer region.

When a teacher selects a question:

1. The application identifies the mapped answer.
2. The answer-sheet viewer scrolls to the corresponding page.
3. The exact bounding box is highlighted.
4. The region is briefly emphasized so the teacher can visually verify it.

The reverse interaction also works: selecting an answer region identifies the related question.

This was important because the system should not only provide an AI-generated score; the teacher should be able to see exactly which handwritten content was evaluated.

### 7. Manual Correction

AI-based label matching can occasionally be uncertain. Instead of hiding those cases, VedaAI exposes them to the teacher.

The teacher can manually:

* Link an answer to a question
* Remove an incorrect mapping
* Change an uncertain mapping

After a mapping is changed, the application automatically regrades the affected evaluation.

This provides a human-in-the-loop workflow rather than treating the AI output as permanently authoritative.

### 8. Provider Abstraction

The application supports both **Google Gemini** and **OpenRouter**.

The provider is detected from the configured API key, while the application keeps the extraction and grading pipeline independent of the provider.

This makes it possible to switch models without changing the core evaluation logic.

### 9. Privacy and Architecture

No database is required.

Evaluation history is maintained only for the current session, and API keys entered through Settings are stored in browser `localStorage`.

The architecture is intentionally lightweight:

```text
Browser
   │
   ├── PDF/Image upload
   ├── PDF → JPEG rasterization
   └── Results + highlighting
          │
          ▼
      Next.js API
          │
          ├── Question Extraction
          │
          ├── Answer Extraction
          │
          ├── Deterministic Label Mapping
          │
          └── AI Grading
                  │
                  ▼
             Gemini / OpenRouter
```

### 10. Why This Approach

The most important design principle was to separate **what the AI does** from **what the application can determine reliably**.

AI is used for vision, handwriting transcription, question understanding, and grading. Deterministic application logic is used for label normalization, answer mapping, UI state, and coordinate handling.

This reduces unnecessary AI decisions and makes the system easier to debug, test, and extend.

The result is a pipeline that combines:

**Vision AI + deterministic mapping + human verification + visual evidence**

rather than treating the final AI score as a black box.

