# 🧠 VedaAI — AI Answer Sheet Evaluation

<p align="center">
  <img src="https://img.shields.io/badge/🧠_VedaAI-AI_Answer_Sheet_Evaluation-7C3AED?style=for-the-badge" />
</p>

<p align="center">
  <strong>Transform handwritten exam papers into explainable AI-powered evaluations.</strong>
</p>

<p align="center">
  📄 Upload &nbsp;→&nbsp; 👁️ Understand &nbsp;→&nbsp; 🔗 Map &nbsp;→&nbsp; 🤖 Grade &nbsp;→&nbsp; 🔍 Verify
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vision_AI-Gemini_|_OpenRouter-8E75B2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/pdf.js-PDF_Rasterization-E34F26?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-what-is-vedaai">About</a> •
  <a href="#-core-features">Features</a> •
  <a href="#-how-vedaai-works">Workflow</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-technical-highlights">Technical</a> •
  <a href="#-setup">Setup</a>
</p>

---

## ✨ What is VedaAI?

**VedaAI** is an AI-powered handwritten answer-sheet evaluation system designed for real examination papers.

Instead of evaluating only extracted text, VedaAI processes the complete workflow:

```text
┌─────────────────────────────────────────────────────────────┐
│                    🧠 VedaAI PIPELINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📄 Question Paper          ✍️ Handwritten Answer Sheet   │
│           │                           │                     │
│           └──────────────┬────────────┘                     │
│                          ▼                                  │
│                  👁️ Vision Processing                      │
│                          │                                  │
│                          ▼                                  │
│                  📝 Text Extraction                        │
│                          │                                  │
│                          ▼                                  │
│                  🔗 Answer Mapping                          │
│                          │                                  │
│                          ▼                                  │
│                    🤖 AI Grading                            │
│                          │                                  │
│                          ▼                                  │
│                 📊 Marks + Feedback                         │
│                          │                                  │
│                          ▼                                  │
│                  🔍 Visual Verification                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **AI handles vision and evaluation, while deterministic application logic handles mapping, coordinates, and verification.**

This separation makes the system easier to understand, test, debug, and verify.

---

# 🌟 Why VedaAI Stands Out

<table>
<tr>
<td align="center" width="25%">

### 👁️

**Vision AI**

Understands real handwritten answer sheets.

</td>

<td align="center" width="25%">

### 🔗

**Smart Mapping**

Connects answers to questions even when students answer out of order.

</td>

<td align="center" width="25%">

### 🤖

**AI Grading**

Evaluates every question with marks and feedback.

</td>

<td align="center" width="25%">

### 🔍

**Visual Evidence**

Shows exactly which handwritten region was evaluated.

</td>
</tr>
</table>

---

# 🎯 Core Features

## 📄 01 — Intelligent Question Extraction

VedaAI preserves the structure of the original question paper.

### Detects

- 🔢 Question numbers
- 🔤 Sub-parts
- 📝 Question text
- 💯 Marks
- 🔀 Internal `OR` choices
- 📑 Original printed order

Example:

```text
11 (a)
11 (b)
12
13 (OR)
14
```

---

## ✍️ 02 — Handwritten Answer Detection

The system identifies handwritten responses and creates structured answer data.

```text
┌──────────────────────────────┐
│ ✍️ DETECTED ANSWER           │
├──────────────────────────────┤
│ Answer Label                 │
│ Page Number                  │
│ Bounding Box                 │
│ Handwriting Transcript       │
│ Confidence Information       │
└──────────────────────────────┘
```

Bounding boxes use normalized **0–1000 coordinates**, allowing the same coordinates to work across different display resolutions.

---

# 🔗 03 — Intelligent Answer Mapping

Students don't always answer questions in numerical order.

For example:

```text
Question Paper              Student Answer Sheet

11 (a)                      Ans 14
11 (b)                      Q11
12                          iv
13                          11 a)
14                          Ans 12
```

VedaAI normalizes answer labels and uses deterministic application logic to establish the mapping.

### Mapping Status

| Status | Meaning |
|---|---|
| 🟢 **Matched** | Answer successfully linked |
| 🟡 **Check** | Mapping requires verification |
| 🔴 **Unanswered** | No answer detected |
| 🔵 **Unmatched** | Answer doesn't correspond to a question |

Teachers can manually correct uncertain mappings.

---

# 🤖 04 — AI-Powered Grading

After mapping, each question-answer pair is evaluated.

### Evaluation Output

```text
┌──────────────────────────────┐
│       🤖 AI EVALUATION       │
├──────────────────────────────┤
│ Verdict                      │
│ Marks Awarded                │
│ Constructive Feedback        │
└──────────────────────────────┘
```

### Verdicts

- ✅ Correct
- 🟡 Partially Correct
- ❌ Incorrect
- ⚪ Unanswered

### Overall Evaluation

VedaAI can generate:

- 📊 Total Score
- 🏆 Grade
- 📝 Overall Summary
- 💪 Strengths
- 📈 Areas for Improvement

---

# 🔍 05 — Visual Evidence

### No Black-Box Score

Instead of simply displaying:

```text
Score: 78 / 100
```

VedaAI connects the evaluation back to the original handwritten answer.

```text
Teacher selects Question
          │
          ▼
Find mapped Answer
          │
          ▼
Open Correct Page
          │
          ▼
Highlight Answer Region
          │
          ▼
Visually Verify AI Evaluation
```

The interaction also works in reverse:

```text
Answer Region
      ↓
Find Linked Question
      ↓
Show Evaluation
```

This provides a direct visual connection between **AI reasoning output and source evidence**.

---

# 👩‍🏫 06 — Human-in-the-Loop

VedaAI does not assume that AI extraction is always perfect.

Teachers can intervene whenever required.

```text
             🤖 AI
              │
              ▼
        Initial Mapping
              │
       ┌──────┴──────┐
       ▼             ▼
    ✅ Clear       ⚠️ Uncertain
       │             │
       │             ▼
       │       👩‍🏫 Teacher
       │             │
       │       Manual Correction
       │             │
       └──────┬──────┘
              ▼
          🔄 Re-grade
```

### Teacher Controls

- 🔗 Link answer to question
- 🔓 Remove incorrect mapping
- 🔄 Change uncertain mapping
- ♻️ Regrade after correction

---

# 🚀 How VedaAI Works

```text
        📤 UPLOAD
           │
           ▼
┌──────────────────────┐
│ Question Paper       │
│ +                    │
│ Handwritten Answers  │
└──────────┬───────────┘
           │
           ▼
      📄 PDF → JPEG
       pdf.js
           │
           ▼
   👁️ Vision Extraction
           │
     ┌─────┴─────┐
     ▼           ▼
 Questions     Answers
     │           │
     └─────┬─────┘
           ▼
     🔗 Label Mapping
           │
           ▼
      🤖 AI Grading
           │
           ▼
   📊 Results & Feedback
           │
           ▼
     🔍 Visual Evidence
```

---

# ⚡ End-to-End Processing

```text
📤 Upload
   ↓
📄 Client-side Rasterization
   ↓
📝 Extract Questions
   ↓
✍️ Extract Answers
   ↓
🔗 Normalize & Map Labels
   ↓
🤖 Evaluate Question/Answer Pairs
   ↓
📊 Generate Marks & Feedback
   ↓
🔍 Highlight Source Evidence
   ↓
👩‍🏫 Teacher Verification
```

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       👤 Teacher     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   ⚛️ Next.js UI     │
                         │                     │
                         │ Upload              │
                         │ Results             │
                         │ Highlights          │
                         │ Remapping           │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js API       │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
       ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
       │ ❓ Question    │  │ ✍️ Answer      │  │ 🔗 Deterministic│
       │ Extraction     │  │ Extraction     │  │ Mapping         │
       └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   ▼
                         ┌─────────────────────┐
                         │      🤖 AI Grading  │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                ┌────────────────┐    ┌────────────────┐
                │ Google Gemini  │    │   OpenRouter   │
                └────────────────┘    └────────────────┘
```

---

# 🧠 Technical Highlights

## 1. 📄 Browser-Side PDF Rasterization

PDF pages are converted into JPEG images using **pdf.js**.

```text
PDF
 │
 ▼
pdf.js
 │
 ▼
JPEG Pages
 │
 ▼
Vision Model
```

This allows the AI to process the same page representation that the teacher sees.

---

## 2. 📦 Structured AI Output

Instead of relying on free-form model responses, extraction uses structured JSON.

```json
{
  "questionNumber": "11",
  "subPart": "a",
  "marks": 5,
  "text": "..."
}
```

This makes downstream processing more predictable.

---

## 3. 📐 Normalized Coordinates

Answer regions use a normalized coordinate system:

```text
0 ───────────────────────────── 1000
│                               │
│       Answer Region           │
│                               │
└───────────────────────────────┘
```

This allows bounding boxes to remain usable across different display sizes.

---

## 4. 🔗 Deterministic Mapping

The system intentionally separates AI extraction from answer-question mapping.

```text
🤖 AI
 │
 ├── Extract labels
 │
 ▼
⚙️ Application Logic
 │
 ├── Normalize labels
 │
 ├── Compare labels
 │
 └── Create mapping
 │
 ▼
🔗 Final Question → Answer Relationship
```

---

# 🔌 AI Provider Architecture

VedaAI supports multiple AI providers.

```text
                 VedaAI
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Google Gemini        OpenRouter
          │                   │
          └─────────┬─────────┘
                    ▼
            Unified AI Pipeline
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Extraction    Mapping     Grading
```

### Google Gemini

```text
gemini-2.5-flash
gemini-2.5-pro
```

### OpenRouter

Compatible vision models can be configured through the application.

---

# 🔐 Privacy & Data Model

VedaAI intentionally uses a lightweight architecture without a database.

```text
                  VedaAI
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Current Session          API Key
          │                     │
          ▼                     ▼
 Evaluation History       Browser Storage
          │
          ▼
      No Database
```

API keys configured through Settings are stored in browser `localStorage`.

> ⚠️ For real educational deployments, privacy, security, retention, and API-key handling should be independently reviewed for the target environment.

---

# 🧰 Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ Framework | Next.js 15 |
| 💙 Language | TypeScript |
| 🎨 Styling | Tailwind CSS v4 |
| 🧠 AI | Google Gemini / OpenRouter |
| 👁️ Vision | Multimodal Vision Models |
| 📄 PDF | pdf.js |
| 🔌 API | Next.js App Router API |
| 💾 State | In-memory session state |
| 🔐 Storage | Browser localStorage |
| ☁️ Deployment | Node.js / Vercel |

---

# 📂 Project Structure

```text
veda-ai-grader/
│
├── 📁 app/
│   ├── 📁 api/
│   │   ├── 📁 extract-questions/
│   │   ├── 📁 extract-answers/
│   │   └── 📁 grade/
│   │
│   └── ...
│
├── 📁 lib/
│   └── labels.ts
│
├── 📁 components/
│   └── ...
│
├── 📁 public/
│   └── sample-papers/
│
├── 📄 package.json
└── 📄 README.md
```

---

# ⚡ Getting Started

## 📋 Prerequisites

- Node.js **20+**
- VS Code
- Google Gemini or OpenRouter API key

---

## 1️⃣ Clone

```bash
git clone <your-repository-url>

cd veda-ai-grader
```

## 2️⃣ Install

```bash
npm install
```

## 3️⃣ Start

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔑 Configure AI

Open:

```text
Settings
```

Then:

```text
1. Paste API Key
      ↓
2. Test Connection
      ↓
3. Select Model
      ↓
4. Save
      ↓
5. Start Evaluation 🚀
```

Alternatively:

```env
OPENROUTER_API_KEY=your_key
```

or:

```env
GEMINI_API_KEY=your_key
```

---

# 🧪 Try the Demo

Use the bundled sample papers to test the complete pipeline.

```text
📄 Sample Paper
      ↓
📤 Upload
      ↓
👁️ Extract
      ↓
🔗 Map
      ↓
🤖 Grade
      ↓
📊 Results
      ↓
🔍 Visual Verification
```

You can also upload your own:

- 📄 Question paper
- ✍️ Handwritten answer sheet

---

# 📜 Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

# 🚀 Deployment

VedaAI can be deployed using a Node.js host or Vercel.

```text
💻 Local Development
        │
        ▼
     GitHub
        │
        ▼
   ☁️ Vercel
        │
        ▼
   🚀 Production
```

### Production

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
        ↓
🎉 Live Application
```

---

# 🏆 Engineering Highlights

<table>
<tr>
<td width="50%">

### 🧠 Artificial Intelligence

- Multimodal vision processing
- Handwriting transcription
- Structured JSON extraction
- Question-answer evaluation
- Multiple AI providers

</td>

<td width="50%">

### ⚙️ Backend Engineering

- Independent extraction APIs
- Deterministic mapping
- Modular grading pipeline
- Server-side API support

</td>
</tr>

<tr>
<td>

### 🎨 Frontend Engineering

- Interactive answer viewer
- Question/answer navigation
- Bounding-box highlighting
- Manual mapping controls
- Processing progress

</td>

<td>

### 🧪 Reliability

- Uncertain mappings surfaced
- Unanswered questions detected
- Unmatched answers separated
- Manual corrections supported
- Regrading after correction

</td>
</tr>
</table>

---

# 💡 The Core Idea

Traditional automated evaluation often begins with already-extracted text.

VedaAI starts with the actual handwritten paper:

```text
        ✍️ REAL HANDWRITTEN PAPER
                    │
                    ▼
              👁️ VISION AI
                    │
                    ▼
             📝 TRANSCRIPTION
                    │
                    ▼
             🔗 QUESTION MAPPING
                    │
                    ▼
                🤖 GRADING
                    │
                    ▼
             📊 SCORE + FEEDBACK
                    │
                    ▼
             🔍 VISUAL EVIDENCE
```

### The combination

```text
┌──────────────────────────────────────────┐
│                                          │
│       👁️ Vision AI                      │
│              +                           │
│       ⚙️ Deterministic Logic             │
│              +                           │
│       👩‍🏫 Human Verification             │
│              +                           │
│       🔍 Visual Evidence                 │
│                                          │
│              =                           │
│                                          │
│       🧠 Explainable Evaluation          │
│                                          │
└──────────────────────────────────────────┘
```

---

# 🔮 Future Roadmap

```text
[ ] 💾 Persistent evaluation history
[ ] 👩‍🏫 Teacher authentication
[ ] 🗄️ Database-backed evaluations
[ ] 🎓 Class & student management
[ ] 📄 Exportable evaluation reports
[ ] ✍️ Advanced handwriting models
[ ] 📋 Rubric-based grading
[ ] 🎯 Custom teacher grading criteria
[ ] 📚 Batch student evaluation
[ ] 📊 Class-level analytics
```

---

# 📌 Project Status

**VedaAI is a functional AI answer-sheet evaluation project built around a real handwritten-paper workflow.**

Current architecture:

```text
🗃️ No Database
        +
🔐 No Required Authentication
        +
📄 Client-side PDF Processing
        +
🧠 Multiple AI Providers
        +
👩‍🏫 Human Verification
```

This lightweight design demonstrates the complete evaluation pipeline while leaving room for future production-oriented capabilities.

---

# 🎯 Built For

### VedaAI Hiring Assignment

The project demonstrates:

- 🧠 AI / LLM integration
- 👁️ Computer vision workflows
- ✍️ Handwritten document processing
- ⚛️ Full-stack development
- ⚙️ Deterministic business logic
- 👩‍🏫 Human-in-the-loop AI
- 🎨 Interactive frontend engineering

---

# 🌟 Final Showcase

<p align="center">

## 🧠 VedaAI

### **From Handwritten Answers → Explainable AI Feedback**

<br/>

📄 **Read** &nbsp; • &nbsp;
🔗 **Map** &nbsp; • &nbsp;
🤖 **Grade** &nbsp; • &nbsp;
🔍 **Verify**

<br/><br/>

<strong>Built with Next.js • TypeScript • Tailwind CSS • Gemini • OpenRouter • pdf.js</strong>

</p>

---

<p align="center">

⭐ If you find VedaAI interesting, consider starring the repository.

<br/>

**Built to make AI evaluation more transparent, visual, and verifiable.**

</p>
