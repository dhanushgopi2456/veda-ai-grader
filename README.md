# 🎓 VedaAI — AI-Powered Answer Sheet Evaluation

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered%20Evaluation-7C3AED?style=for-the-badge&logo=google-scholar&logoColor=white" alt="AI-Powered Evaluation" />
  <img src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%7C%20OpenRouter-4285F4?style=for-the-badge" alt="AI Providers" />
</p>

<p align="center">
  <strong>Upload. Evaluate. Understand. Improve.</strong>
</p>

<p align="center">
  An AI-powered answer sheet evaluation platform that analyzes question papers and handwritten student responses, maps answers to their corresponding questions, and generates structured grading feedback with visual answer-region highlights.
</p>

<p align="center">
  Built for the <strong>VedaAI Hiring Assignment</strong>.
</p>

---

## 📌 Overview

**VedaAI** simplifies answer sheet evaluation by combining vision-capable language models, handwritten text transcription, label-based answer mapping, and AI-assisted grading in a single application.

Teachers can upload a question paper alongside a student's handwritten answer sheet. The system extracts the questions, identifies answer regions across pages, maps responses using question labels, and generates question-wise feedback and an overall performance summary.

The results interface connects every question to its corresponding answer region, making it easier to review the grading and verify the source of each evaluation.

### ✨ Key Highlights

- 📄 Question paper and handwritten answer sheet processing
- 🧠 AI-powered question extraction and answer transcription
- 🎯 Label-based answer mapping with manual correction
- 📝 Question-wise grading, marks, and constructive feedback
- 🖍️ Visual answer-region highlighting across multiple pages
- 📊 Overall score, grade, strengths, and improvement suggestions
- 🧪 Built-in sample papers for quick demonstrations
- 🔑 Support for Google Gemini and OpenRouter
- ⚡ Browser-based PDF rasterization
- 💾 Session-based evaluation history without a database

---

## 🚀 Features

### 📤 1. Question Paper & Answer Sheet Upload

Upload question papers and handwritten answer sheets using supported file formats.

- PDF documents
- JPG and JPEG images
- PNG images
- WEBP images
- Multiple files and pages, as supported by the application

The application provides staged processing progress to help users follow the evaluation workflow.

### 📚 2. Intelligent Question Extraction

Extracts questions from the uploaded question paper while preserving their original numbering and printed order.

Supported extraction scenarios include:

- Main questions and labelled sub-questions
- Separate entries for parts such as `11 (a)` and `11 (b)`
- Internal-choice questions containing `OR`
- Marks expressed as `[2]`, `(5 marks)`, or `3M`
- Structured question data for downstream answer mapping and grading

### ✍️ 3. Handwritten Answer Detection

Identifies answer regions on the student's answer sheet and produces bounding boxes using normalized coordinates.

Key capabilities:

- Answer-region localization on individual pages
- Multiple regions for answers spanning several pages
- Handwriting transcription for grading and review
- Page-aware coordinate tracking
- Visual association between extracted answers and their source locations

### 🔗 4. Intelligent Answer Mapping

Maps extracted answers to questions using labels rather than relying solely on their physical position.

Examples of supported label patterns include:

- `Q11`
- `Ans 4`
- `11 (a)`
- Roman numeral labels

Additional mapping features:

- Handles answers written out of question order
- Flags unanswered questions
- Lists unmatched answers separately
- Marks uncertain mappings for manual review
- Allows teachers to link or unlink answers using dropdown controls
- Automatically triggers regrading after mapping changes

### 📝 5. AI-Powered Grading & Feedback

Generates structured evaluation results for each question.

| Evaluation Component | Description |
|---|---|
| Verdict | Correct, partially correct, incorrect, or unanswered |
| Marks awarded | Score assigned to the response |
| Feedback | Constructive question-specific comments |
| Overall score | Aggregated marks across evaluated questions |
| Grade letter | Overall grade based on configured grading rules |
| Summary | Concise overview of the student's performance |
| Strengths | Areas where the student performed well |
| Improvements | Topics or answer elements requiring attention |

AI-generated marks and feedback should be reviewed by a teacher before finalizing official grades.

### 🖍️ 6. Interactive Results & Visual Highlights

The results screen presents grading feedback alongside the original answer sheet.

- Question cards display verdicts, marks, and feedback.
- Answer regions are highlighted with color-coded bounding boxes.
- Selecting a question scrolls to and visually emphasizes its associated answer.
- Selecting an answer region navigates to its corresponding question.
- Multiple regions can be associated with one answer.
- Manual mapping changes help teachers correct uncertain matches.

This makes the evaluation process easier to inspect and helps users connect AI feedback to the original handwritten response.

### 🗂️ 7. Session-Based Evaluation History

- Keeps completed evaluations available during the current session.
- Makes it easier to revisit results while using the application.
- Requires no database configuration.

**Storage limitation:** Evaluation history is held in memory and is not intended to persist across server restarts or independent sessions.

### 🧪 8. Built-In Sample Papers

Use the sample evaluation workflow to explore the application without preparing your own documents first.

The sample flow is useful for:

- Demonstrating the end-to-end pipeline
- Exploring grading and feedback
- Testing question-to-answer mapping
- Reviewing visual highlights
- Validating UI interactions during development

---

## 🏗️ System Architecture

VedaAI uses a staged pipeline that separates document preparation, extraction, mapping, grading, and result visualization.

```text
┌───────────────────────────────────┐
│       Teacher / User               │
│  Upload Question Paper + Answers  │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│     Browser-Based Processing      │
│ PDF Rasterization using pdf.js     │
│ Image Preparation and Page Order  │
└─────────────────┬─────────────────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
┌──────────────────┐ ┌──────────────────┐
│ Question          │ │ Handwritten      │
│ Extraction        │ │ Answer Extraction│
│ Vision LLM        │ │ Vision LLM       │
└─────────┬────────┘ └─────────┬────────┘
          │                    │
          │                    ▼
          │          ┌──────────────────┐
          │          │ Answer Regions   │
          │          │ + Transcription  │
          │          └─────────┬────────┘
          │                    │
          └──────────┬─────────┘
                     ▼
          ┌──────────────────────┐
          │ Label-Based Mapping  │
          │ lib/labels.ts        │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │ AI Grading           │
          │ /api/grade           │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │ Results Dashboard    │
          │ Scores + Feedback    │
          │ Interactive Highlights│
          └──────────────────────┘
```

### Processing Pipeline

| Stage | Endpoint / Component | Responsibility |
|---|---|---|
| 1 | Browser / pdf.js | Rasterize PDF pages and prepare images |
| 2 | `/api/extract-questions` | Extract structured questions and marks |
| 3 | `/api/extract-answers` | Detect answer regions and transcribe handwriting |
| 4 | `lib/labels.ts` | Match answers to questions using labels |
| 5 | `/api/grade` | Generate question-level grading and overall feedback |
| 6 | Results UI | Display marks, feedback, and interactive highlights |

### Why Browser-Based PDF Processing?

PDF pages are rasterized in the browser before being sent for AI analysis.

This approach helps provide:

- Consistent page ordering
- Predictable page numbering
- Direct alignment between displayed pages and normalized highlight coordinates
- Reduced need for server-side PDF processing
- Control over image dimensions and payload sizes

The backend receives prepared image data rather than relying on server-side PDF page rendering.

---

## 🤖 AI Providers

VedaAI supports two AI provider options.

<details>
<summary><strong>Google Gemini</strong></summary>

Use an API key from [Google AI Studio](https://aistudio.google.com/apikey).

Example configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The application can use supported Gemini vision models, including the configured `gemini-2.5-flash` and `gemini-2.5-pro` models.

</details>

<details>
<summary><strong>OpenRouter</strong></summary>

Create an API key at [OpenRouter](https://openrouter.ai/keys).

Example configuration:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

OpenRouter provides access to multiple model providers through a common API. Model availability, pricing, and free-tier limits may change.

</details>

### Configure Your AI Provider

1. Open VedaAI in your browser.
2. Navigate to **Settings**.
3. Enter your Gemini or OpenRouter API key.
4. Use the **Test** action to verify connectivity.
5. Select an available model.
6. Save the configuration.
7. Upload documents or run the sample evaluation.

The application can also read a provider key from a supported server-side environment variable.

### API Key Handling

When configured through the browser UI, the key is stored in `localStorage`.

Keep in mind:

- `localStorage` is accessible to JavaScript running on the same origin.
- Browser-stored keys are not equivalent to server-side secrets.
- Keys must never be committed to the repository.
- Requests are sent to the configured AI provider for processing.
- When a server-side key is configured, verify the application's provider-selection and key-precedence behavior.

For shared or public production deployments, consider server-side key management and appropriate access controls.

---

## 💻 Running Locally in VS Code

### Prerequisites

Install the following tools:

| Tool | Purpose | Link |
|---|---|---|
| Node.js 20+ | JavaScript runtime | [Download](https://nodejs.org/) |
| npm | Dependency management | Included with Node.js |
| Visual Studio Code | Code editor | [Download](https://code.visualstudio.com/) |
| Gemini or OpenRouter API key | AI inference | [Gemini](https://aistudio.google.com/apikey) / [OpenRouter](https://openrouter.ai/keys) |

Recommended VS Code extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense

### Step 1: Open the Project

1. Launch Visual Studio Code.
2. Select **File → Open Folder**.
3. Choose the `veda-ai-grader` project directory.
4. Open a new integrated terminal.

### Step 2: Install Dependencies

From the project root:

```bash
npm install
```

If the repository contains a committed, compatible `package-lock.json`, you can use `npm ci` for a reproducible installation.

### Step 3: Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal. The expected address is:

**http://localhost:3000**

If the application starts on another port, use the address shown by the terminal.

### Step 4: Configure the AI Key

1. Open **Settings** in the sidebar or use the settings icon.
2. Paste your Gemini or OpenRouter API key.
3. Click **Test**.
4. Select an available model.
5. Save your configuration.

### Step 5: Run an Evaluation

Choose one of the following:

**Option A — Sample evaluation**

- Select **Try it with sample papers**.
- Follow the processing stages.
- Inspect the extracted questions, answer mappings, and grading feedback.

**Option B — Upload your own documents**

- Upload a question paper.
- Upload the corresponding handwritten answer sheet.
- Select **Get Feedback**.
- Review the extracted questions and mapped responses.
- Correct uncertain mappings when needed.
- Inspect marks, feedback, and highlighted answer regions.

---

## 🧰 Useful Development Commands

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production build |
| `npm start` | Start the production application |
| `npm run lint` | Run ESLint checks |

### Common Troubleshooting

| Issue | Suggested Solution |
|---|---|
| Port already in use | Try `npm run dev -- -p 3001` |
| Missing API key | Configure a valid key in Settings |
| Invalid API key | Verify the key and selected provider |
| HTTP 429 / rate limit | Wait before retrying or select another available model |
| AI output is malformed | Retry the request and verify the model supports the expected structured output |
| Handwriting is misread | Review the transcription and compare it with the source image |
| Answer is mapped incorrectly | Use the manual remapping controls |
| Highlight appears inaccurate | Verify page ordering and the detected bounding box |
| Large PDF fails | Reduce file size or page dimensions and retry |
| Production build fails | Check the Node.js version, dependencies, and build logs |

---

## 🌐 Deployment

VedaAI is built with Next.js App Router and can be deployed to compatible Node.js hosting platforms.

### Option 1 — Deploy to Vercel

1. Push the project to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Import the repository.
4. Confirm the framework is detected as Next.js.
5. Configure environment variables if using a server-side AI key.
6. Deploy the application.
7. Test sample evaluations and actual document uploads.

### Option 2 — Deploy to a Node.js Host

Install dependencies and build the application:

```bash
npm ci
npm run build
npm start
```

Confirm that the host uses the Node.js version required by the project and correctly routes requests to the Next.js server.

### Environment Variables

Optional server-side provider configuration:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Use the variable names supported by your implementation. Configure secrets in the hosting provider's environment settings rather than committing them to Git.

### Deployment Characteristics

- No database is required by the described architecture.
- Evaluation history is session-based and in memory.
- Users can provide their own provider key through the UI.
- Server-side provider keys can be configured when supported by the application.
- AI functionality depends on provider access, model availability, request limits, and valid credentials.

**Important:** Verify the deployment's environment configuration, API routes, request-size limits, and AI provider behavior before making it publicly accessible.

---

## 🔒 Privacy, Reliability & Responsible Grading

VedaAI is designed to support educators, not replace their judgment.

### Document Processing

- PDF rasterization happens in the browser.
- Prepared document images are sent for AI processing.
- Handwritten transcription and grading may contain errors.
- Document contents may be processed by the configured AI provider.

### Grading Reliability

AI-generated evaluations can be incorrect, especially when:

- Handwriting is unclear
- Diagrams or mathematical notation are complex
- Answers continue across multiple pages
- Internal choices are ambiguous
- The expected answer requires specialized subject knowledge

Teachers should verify uncertain mappings, marks, and feedback before using results for official grading.

### Production Considerations

For public deployments, consider:

- API request rate limiting
- Upload and image-size limits
- Server-side API key protection
- Appropriate error handling and logging
- Privacy notices for uploaded student documents
- Access controls and retention policies where necessary

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| Next.js App Router | Application framework and API routes |
| React | Interactive user interface |
| TypeScript | Type safety and maintainable code |
| Tailwind CSS v4 | Styling and responsive UI |
| Google Gemini | Vision-based extraction and grading |
| OpenRouter | Multi-provider AI integration |
| pdf.js | Browser-based PDF rasterization |
| JSON-schema-constrained output | Structured AI responses |
| Browser localStorage | AI key and settings storage |

### Architecture Principles

- **Structured extraction:** Convert unstructured document content into predictable question and answer data.
- **Deterministic mapping:** Use application-side label matching instead of relying exclusively on AI-generated associations.
- **Visual traceability:** Connect grading results to the original answer regions.
- **Human oversight:** Allow teachers to review uncertain mappings and AI-generated grades.
- **Minimal infrastructure:** Avoid a database requirement for the current session-based design.

---

## 🔮 Future Improvements

Potential enhancements for future versions include:

- Persistent evaluation history
- Teacher accounts and secure authentication
- Exportable grading reports in PDF format
- Batch processing for multiple students
- Configurable rubrics and subject-specific grading
- Better mathematical expression recognition
- Improved diagram and table understanding
- Confidence scoring and review queues
- Comparison of original answers with marking schemes
- Class-level analytics and progress tracking

These are possible future extensions, not claims about existing functionality.

---

## 👨‍💻 Built For

**VedaAI Hiring Assignment**

The project demonstrates the integration of AI vision models, document processing, deterministic answer mapping, grading workflows, and interactive result visualization in a full-stack web application.

---

## 🌟 Support the Project

If you find VedaAI useful, consider giving the repository a star.

<p align="center">
  <strong>🎓 Smarter Evaluation. Clearer Feedback. Better Learning.</strong>
  <br/><br/>
  Built with ❤️ using Next.js, TypeScript, and AI.
  <br/><br/>
  ⭐ <strong>Star the repository if you like the project</strong>
</p>
