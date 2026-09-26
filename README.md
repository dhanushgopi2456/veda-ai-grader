# 🧠 VedaAI — AI Answer Sheet Evaluation

<p align="center">
  <strong>AI-powered evaluation of handwritten exam answer sheets</strong>
</p>

<p align="center">
  Upload a question paper + handwritten answer sheet → extract → map → grade → visually verify
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vision_AI-Gemini%20%2F%20OpenRouter-8E75B2?style=for-the-badge" alt="Vision AI" />
  <img src="https://img.shields.io/badge/pdf.js-PDF%20Rasterization-red?style=for-the-badge" alt="pdf.js" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-technical-approach">Technical Approach</a> •
  <a href="#-setup">Setup</a>
</p>

---

## ✨ What is VedaAI?

**VedaAI** is an AI-powered handwritten answer-sheet evaluation system built to evaluate real exam papers rather than relying only on plain text input.

A teacher can upload:

* 📄 A **question paper**
* ✍️ A **student's handwritten answer sheet**

VedaAI then:

```text
Extract Questions
       ↓
Detect Handwritten Answers
       ↓
Map Answers → Questions
       ↓
Evaluate Each Answer
       ↓
Generate Marks + Feedback
       ↓
Highlight Exact Answer Regions
```

The key idea is simple:

> **AI performs the difficult vision and grading tasks, while deterministic application logic handles mapping, coordinates, and verification.**

This makes the evaluation pipeline easier to understand, debug, and verify.

---

## 🎯 Core Experience

<table>
<tr>
<td width="50%">

### 📄 Question Paper

* Extracts original numbering
* Detects sub-parts
* Preserves printed order
* Detects marks
* Captures internal `OR` choices

</td>
<td width="50%">

### ✍️ Handwritten Answers

* Detects answer labels
* Locates answers on pages
* Transcribes handwriting
* Creates normalized bounding boxes
* Supports answers spanning multiple pages

</td>
</tr>

<tr>
<td width="50%">

### 🤖 AI Evaluation

* Correct
* Partially correct
* Incorrect
* Unanswered
* Marks awarded
* Constructive feedback

</td>
<td width="50%">

### 🔍 Visual Verification

* Exact answer highlighting
* Question ↔ answer navigation
* Teacher remapping
* Automatic regrading
* Uncertain matches flagged

</td>
</tr>
</table>

---

# 🚀 Features

## 📤 Intelligent File Upload

Upload question papers and handwritten answer sheets in:

* PDF
* JPG
* PNG
* WEBP
* Multiple files

The application provides staged processing progress throughout the evaluation pipeline.

---

## 📝 Smart Question Extraction

VedaAI preserves the structure of the original question paper.

It can detect:

```text
11 (a)
11 (b)
12
13 (OR)
```

It also extracts:

* Original numbering
* Sub-parts
* Internal choices
* Marks such as `[2]`, `(5 marks)`, `3M`
* Original printed order

---

## ✍️ Handwriting & Answer Detection

Every detected answer can contain:

```text
Answer Label
Page Number
Bounding Box
Handwriting Transcription
Confidence Information
```

Bounding boxes use normalized `0–1000` coordinates, making them independent of the original image resolution. Answers continuing onto another page can also contain multiple regions.

---

# 🔗 Intelligent Answer Mapping

One of the most important design decisions is that VedaAI **does not depend on answer position**.

Students can answer questions in any order.

For example:

```text
Question Paper

11 (a)
11 (b)
12
13
14
```

The student might write:

```text
Ans 14
Q11
iv
11 a)
Ans 12
```

VedaAI normalizes these labels and maps them using deterministic label-processing logic.

### Mapping states

| State        | Meaning                                 |
| ------------ | --------------------------------------- |
| ✅ Matched    | Answer successfully linked              |
| ⚠️ Check     | AI/system is uncertain                  |
| ❌ Unanswered | No answer detected                      |
| 🔎 Unmatched | Answer doesn't correspond to a question |

Teachers can manually change mappings whenever necessary.

---

# 🤖 AI-Powered Grading

Once the mapping is complete, VedaAI evaluates each question-answer pair.

For every question, the system produces:

```text
Verdict
Marks Awarded
Constructive Feedback
```

Possible verdicts:

* ✅ Correct
* 🟡 Partial
* ❌ Incorrect
* ⚪ Unanswered

The evaluation also produces:

* Total score
* Grade
* Overall summary
* Strengths
* Areas for improvement

---

# 🔍 Visual Evidence — No Black-Box Score

Instead of showing only:

> **Score: 78/100**

VedaAI connects the evaluation back to the original handwritten answer.

### Question → Answer

```text
Teacher selects Question
        ↓
Find mapped answer
        ↓
Scroll to correct page
        ↓
Highlight exact region
        ↓
Visually verify evaluated content
```

And the interaction works in reverse:

```text
Teacher selects answer region
        ↓
Find linked question
        ↓
Show corresponding evaluation
```

This allows teachers to visually verify what the AI actually evaluated.

---

# 👩‍🏫 Human-in-the-Loop Correction

AI-based extraction and label matching can occasionally be uncertain.

VedaAI doesn't hide those cases.

Teachers can:

* 🔗 Link an answer to a question
* 🔓 Remove an incorrect mapping
* 🔄 Change an uncertain mapping
* ♻️ Automatically regrade after correction

This creates a **human-in-the-loop evaluation workflow** rather than treating AI output as permanently authoritative.

---

# 🧩 How It Works

```text
┌──────────────────────────────┐
│        Upload Files          │
│ Question Paper + Answer Sheet│
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       Browser Processing     │
│ PDF → JPEG using pdf.js      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│    Question Extraction       │
│ Vision AI + Structured JSON  │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│     Answer Extraction        │
│ Labels + Boxes + Transcripts │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│   Deterministic Mapping      │
│      lib/labels.ts           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        AI Grading            │
│ Per-question evaluation      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       Results UI             │
│ Feedback + Highlights        │
│ Remapping + Insights         │
└──────────────────────────────┘
```

The production flow is:

```text
Upload
  ↓
Client-side rasterization
  ↓
/api/extract-questions
  ↓
/api/extract-answers
  ↓
Label matching
  ↓
/api/grade
  ↓
Results + visual verification
```

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      Browser         │
                         │                      │
                         │  PDF / Image Upload  │
                         │  PDF → JPEG          │
                         │  Results Viewer      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Next.js API     │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │    Question    │ │     Answer     │ │ Deterministic  │
        │   Extraction   │ │   Extraction   │ │     Mapping     │
        └────────────────┘ └────────────────┘ └────────────────┘
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │     AI Grading       │
                         └──────────┬───────────┘
                                    │
                         ┌──────────┴───────────┐
                         ▼                      ▼
                  Google Gemini           OpenRouter
```

The architecture deliberately separates AI operations from deterministic application logic.

---

# 🧠 Technical Approach

## 1. Browser-Side PDF Rasterization

Instead of sending PDFs directly to the backend, VedaAI converts PDF pages into JPEG images in the browser using **pdf.js**.

```text
PDF
 ↓
pdf.js
 ↓
JPEG Pages
 ↓
Vision Model
```

This ensures the AI receives the same page representation that the teacher sees, while allowing returned coordinates to align with the displayed page.

---

## 2. Structured AI Output

Question extraction uses structured JSON rather than free-form model responses.

This makes the output predictable:

```json
{
  "questionNumber": "11",
  "subPart": "a",
  "marks": 5,
  "text": "..."
}
```

The actual extraction preserves numbering, sub-parts, choices, marks, and printed order.

---

## 3. Normalized Coordinates

Answer bounding boxes use:

```text
0 → 1000
```

instead of raw pixel coordinates.

This means:

```text
Model Coordinates
       ↓
Normalized Bounding Box
       ↓
Any Display Resolution
       ↓
Correct Highlight
```

This is particularly useful when the same answer-sheet page is rendered at different sizes.

---

## 4. Deterministic Mapping

The application deliberately avoids asking the AI to decide every answer-to-question relationship.

Instead:

```text
AI
 ↓
Extract labels
 ↓
Application
 ↓
Normalize labels
 ↓
Compare labels
 ↓
Create mapping
```

This separation keeps the mapping predictable and easier to test.

---

## 5. Provider Abstraction

VedaAI supports two AI providers:

### Google Gemini

```text
gemini-2.5-flash
gemini-2.5-pro
```

### OpenRouter

Supports compatible vision models configured through the application.

The provider is detected from the configured API key, while the extraction and grading pipeline remains independent from the provider.

---

# 🔐 Privacy & Data Model

VedaAI intentionally avoids a database.

```text
No Database
     │
     ├── Evaluation history
     │      └── Current session only
     │
     └── API key
            └── Browser localStorage
```

The API key entered through Settings is stored in browser `localStorage` and is sent only to the selected AI provider.

> **Note:** Anyone deploying this for real educational use should independently review the privacy, security, retention, and API-key handling requirements for their environment.

---

# 🧰 Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Framework      | Next.js                    |
| Language       | TypeScript                 |
| Styling        | Tailwind CSS v4            |
| AI             | Google Gemini / OpenRouter |
| Vision         | Multimodal Vision Models   |
| PDF Processing | pdf.js                     |
| API            | Next.js App Router API     |
| State          | In-memory session state    |
| Storage        | Browser `localStorage`     |
| Deployment     | Node.js / Vercel           |

---

# 📂 Project Flow

```text
veda-ai-grader/
│
├── app/
│   ├── api/
│   │   ├── extract-questions/
│   │   ├── extract-answers/
│   │   └── grade/
│   │
│   └── ...
│
├── lib/
│   └── labels.ts
│
├── components/
│   └── ...
│
├── public/
│   └── sample-papers/
│
├── package.json
└── README.md
```

> The exact repository structure may contain additional files/components beyond the conceptual structure shown above.

---

# ⚡ Getting Started

## Prerequisites

You need:

* **Node.js 20+**
* **VS Code**
* An AI API key

Supported providers:

* OpenRouter
* Google AI Studio / Gemini

---

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd veda-ai-grader
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Development Server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🔑 Configure AI Provider

Open:

```text
Settings
```

Then:

1. Paste your OpenRouter or Gemini API key
2. Click **Test**
3. Confirm the key works
4. Select a model
5. Click **Save**

The key is stored in the browser's `localStorage`.

Alternatively, configure:

```env
OPENROUTER_API_KEY=your_key
```

or:

```env
GEMINI_API_KEY=your_key
```

---

# 🧪 Try the Demo

You can immediately test the complete pipeline using the bundled sample papers.

```text
Try it with sample papers
          ↓
Upload
          ↓
Extract
          ↓
Map
          ↓
Grade
          ↓
Visual Results
```

You can also upload your own:

* Question paper
* Handwritten answer sheet

and select **Get Feedback**.

---

# 📜 Available Commands

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |

---

# 🚀 Deployment

VedaAI is built with the Next.js App Router and can be deployed to a Node host.

### Production build

```bash
npm run build
npm start
```

### Vercel

```text
GitHub Repository
       ↓
Import into Vercel
       ↓
Build
       ↓
Deploy
```

The project does not require a database or authentication for the described workflow. API keys can be supplied through the UI or optionally through environment variables.

---

# 🛠️ Troubleshooting

### Port already in use

```bash
npm run dev -- -p 3001
```

### No AI API key found

Open **Settings** and configure an API key.

### Model returns `429`

The selected free model may be rate-limited.

Try:

* Waiting briefly
* Switching to another available model

---

# 💡 Why VedaAI?

Traditional automated evaluation often focuses on text that has already been extracted.

VedaAI starts earlier in the pipeline:

```text
Real Handwritten Paper
        ↓
      Vision
        ↓
   Transcription
        ↓
Question Mapping
        ↓
     Grading
        ↓
 Visual Evidence
```

The project combines:

**Vision AI + deterministic logic + human verification + visual evidence**

instead of treating the final AI score as an unexplained black box.

---

# 🏆 Engineering Highlights

### 🧠 AI

* Multimodal vision processing
* Handwriting transcription
* Structured JSON output
* Per-question evaluation
* Multiple AI provider support

### ⚙️ Backend

* Independent extraction endpoints
* Deterministic label mapping
* Modular grading pipeline
* Server-side API key support

### 🎨 Frontend

* Interactive answer-sheet viewer
* Synchronized question/answer navigation
* Bounding-box highlighting
* Manual mapping controls
* Processing progress

### 🧪 Reliability

* Uncertain mappings are surfaced
* Unanswered questions are detected
* Unmatched answers are separated
* Manual corrections trigger regrading

---

# 🔮 Future Improvements

Potential next steps for the system:

* [ ] Persistent evaluation history
* [ ] Teacher accounts and authentication
* [ ] Database-backed evaluation storage
* [ ] Class and student management
* [ ] Exportable evaluation reports
* [ ] More advanced handwriting models
* [ ] Rubric-based grading
* [ ] Custom teacher grading criteria
* [ ] Batch evaluation for multiple students
* [ ] Analytics and class-level insights

---

# 📌 Project Status

**VedaAI** is a functional AI answer-sheet evaluation project built around a real handwritten-paper workflow.

The current architecture intentionally keeps the system lightweight:

```text
No Database
No Required Authentication
Client-side PDF Processing
Multiple AI Providers
Human Verification
```

This makes it suitable for demonstrating the complete AI evaluation pipeline while leaving room for future production-oriented features.

---

# 👨‍💻 Built For

**VedaAI Hiring Assignment**

The project focuses on demonstrating:

* AI/LLM integration
* Computer vision workflows
* Handwritten document processing
* Full-stack development
* Deterministic business logic
* Human-in-the-loop AI systems
* Interactive frontend engineering

---

<p align="center">

### 🧠 VedaAI

**From handwritten answers to explainable AI feedback.**

</p>

<p align="center">
  Built with Next.js • TypeScript • Tailwind CSS • Gemini • OpenRouter • pdf.js
</p>
