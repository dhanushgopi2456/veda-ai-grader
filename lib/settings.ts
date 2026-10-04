import { detectProvider } from "./ai";

export type ThemeMode = "light" | "dark" | "system";

export type UserProfile = {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

export type Settings = {
  apiKey: string;
  model: string;
  theme?: ThemeMode;
  user?: UserProfile;
  defaultStrictness?: "lenient" | "balanced" | "strict";
  defaultFeedback?: "concise" | "standard" | "comprehensive";
  notificationsEnabled?: boolean;
};

const KEY = "veda.settings.v1";
const HISTORY_KEY = "veda.history.v1";

export const DEFAULT_USER: UserProfile = {
  name: "Dhanush Gopi",
  email: "gopidhanush615@gmail.com",
  role: "Lead Educator & Evaluator",
};

export type ModelOption = { id: string; label: string; hint: string };

export const MODELS: Record<"openrouter" | "gemini", ModelOption[]> = {
  openrouter: [
    {
      id: "dots-studio/dots-3-note-preview:free",
      label: "Dots Note (free)",
      hint: "Recommended · document & handwriting OCR",
    },
    {
      id: "minimax/minimax-m3:free",
      label: "MiniMax M3 (free)",
      hint: "Free · strong all-round vision",
    },
    {
      id: "google/gemma-4-31b-it:free",
      label: "Gemma 4 31B (free)",
      hint: "Free · Google open model",
    },
    {
      id: "google/gemini-2.5-flash",
      label: "Gemini 2.5 Flash (via OpenRouter)",
      hint: "Paid · needs OpenRouter credits",
    },
  ],
  gemini: [
    { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash", hint: "Recommended · ultra fast & multimodal OCR" },
    { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash", hint: "High accuracy handwriting recognition" },
    { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", hint: "Lightweight fallback option" },
  ],
};

export const DEFAULT_MODELS: Record<"openrouter" | "gemini", string> = {
  openrouter: "dots-studio/dots-3-note-preview:free",
  gemini: "gemini-3.8-flash",
};

export function modelsFor(key: string): ModelOption[] {
  return MODELS[detectProvider(key || "x")];
}

export function defaultModelFor(key: string): string {
  return DEFAULT_MODELS[detectProvider(key || "x")];
}

const SEED_HISTORY: import("./types").EvaluationResult[] = [
  {
    id: "eval-seed-phys-101",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    examTitle: "Class XII Physics Board Evaluation",
    studentName: "Arjun Sharma",
    subject: "Physics",
    questionPages: [
      {
        url: "/samples/question-paper-1.jpg",
        width: 1200,
        height: 1600,
        name: "question-paper-page-1.jpg",
      },
      {
        url: "/samples/question-paper-2.jpg",
        width: 1200,
        height: 1600,
        name: "question-paper-page-2.jpg",
      },
    ],
    answerPages: [
      {
        url: "/samples/answer-sheet-1.jpg",
        width: 1200,
        height: 1600,
        name: "answer-sheet-page-1.jpg",
      },
      {
        url: "/samples/answer-sheet-2.jpg",
        width: 1200,
        height: 1600,
        name: "answer-sheet-page-2.jpg",
      },
      {
        url: "/samples/answer-sheet-3.jpg",
        width: 1200,
        height: 1600,
        name: "answer-sheet-page-3.jpg",
      },
    ],
    questions: [
      {
        id: "q-1",
        label: "Q1",
        number: "1",
        sub: null,
        text: "State Gauss's Law in electrostatics. Derive the expression for electric field due to an infinitely long straight wire with uniform linear charge density λ.",
        altText: null,
        marks: 5,
      },
      {
        id: "q-2",
        label: "Q2",
        number: "2",
        sub: null,
        text: "A parallel plate capacitor with air between plates has a capacitance of 8 pF. What is the capacitance if distance between plates is halved and medium has dielectric constant k=6?",
        altText: null,
        marks: 5,
      },
      {
        id: "q-3",
        label: "Q3",
        number: "3",
        sub: null,
        text: "Explain the working principle of a cyclotron. Why can electrons not be accelerated using an ordinary cyclotron?",
        altText: null,
        marks: 5,
      },
      {
        id: "q-4",
        label: "Q4",
        number: "4",
        sub: null,
        text: "Define mutual inductance. Two concentric circular coils of radii r1 and r2 are placed co-axially. Derive the expression for mutual inductance.",
        altText: null,
        marks: 5,
      },
      {
        id: "q-5",
        label: "Q5",
        number: "5",
        sub: null,
        text: "Distinguish between diamagnetic, paramagnetic, and ferromagnetic materials with respect to magnetic susceptibility and behavior in an external magnetic field.",
        altText: null,
        marks: 5,
      },
      {
        id: "q-6",
        label: "Q6",
        number: "6",
        sub: null,
        text: "Draw a neat ray diagram for an astronomical telescope in normal adjustment and write the expression for its magnifying power.",
        altText: null,
        marks: 5,
      },
    ],
    answers: [
      {
        id: "ans-1",
        rawLabel: "1",
        transcription:
          "Gauss's Law states that total electric flux through a closed surface is 1/ε₀ times the total charge enclosed: ∮ E·dA = q/ε₀.\nFor a wire of length L and charge density λ, Gaussian cylinder gives E·(2πrL) = λL/ε₀. Therefore, E = λ / (2πε₀r).",
        confidence: 0.98,
        regions: [
          {
            page: 1,
            bbox: { x0: 0.08, y0: 0.06, x1: 0.92, y1: 0.28 },
          },
        ],
      },
      {
        id: "ans-2",
        rawLabel: "2",
        transcription:
          "Initial capacitance C₀ = ε₀A/d = 8 pF.\nWhen distance is d' = d/2 and dielectric k = 6:\nNew capacitance C' = k·ε₀A/d' = 6 · 2 · (ε₀A/d) = 12 · 8 pF = 96 pF.",
        confidence: 0.96,
        regions: [
          {
            page: 1,
            bbox: { x0: 0.08, y0: 0.32, x1: 0.92, y1: 0.58 },
          },
        ],
      },
      {
        id: "ans-3",
        rawLabel: "3",
        transcription:
          "Principle: Charged particles cross oscillating electric field repeatedly under perpendicular magnetic field which bends them into circular spiral paths.\nElectrons cannot be accelerated because their mass is very small, so high velocities cause relativistic mass increase rapidly, falling out of resonance phase.",
        confidence: 0.94,
        regions: [
          {
            page: 1,
            bbox: { x0: 0.08, y0: 0.62, x1: 0.92, y1: 0.92 },
          },
        ],
      },
      {
        id: "ans-4",
        rawLabel: "4",
        transcription:
          "Mutual inductance is the phenomenon where change of current in one coil induces an emf in adjacent coil. M = (μ₀·π·r₁²)/(2·r₂) for r₁ << r₂.",
        confidence: 0.95,
        regions: [
          {
            page: 2,
            bbox: { x0: 0.08, y0: 0.06, x1: 0.92, y1: 0.34 },
          },
        ],
      },
      {
        id: "ans-5",
        rawLabel: "5",
        transcription:
          "Diamagnetic: Susceptibility χ is small and negative. Repelled weakly by magnets.\nParamagnetic: χ is small and positive. Attracted weakly.\nFerromagnetic: χ is very large and positive. Strongly attracted.",
        confidence: 0.92,
        regions: [
          {
            page: 2,
            bbox: { x0: 0.08, y0: 0.38, x1: 0.92, y1: 0.66 },
          },
        ],
      },
      {
        id: "ans-6",
        rawLabel: "6",
        transcription:
          "Astronomical telescope ray diagram with objective lens of focal length fo and eyepiece fe. Magnifying power m = -fo / fe.",
        confidence: 0.93,
        regions: [
          {
            page: 2,
            bbox: { x0: 0.08, y0: 0.7, x1: 0.92, y1: 0.94 },
          },
        ],
      },
    ],
    results: [
      {
        question: {
          id: "q-1",
          label: "Q1",
          number: "1",
          sub: null,
          text: "State Gauss's Law in electrostatics. Derive the expression for electric field due to an infinitely long straight wire with uniform linear charge density λ.",
          altText: null,
          marks: 5,
        },
        answerId: "ans-1",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "q-1",
          verdict: "correct",
          marksAwarded: 5,
          marksTotal: 5,
          feedback:
            "Flawless statement of Gauss's Law and clean derivation using Gaussian cylindrical surface symmetry.",
        },
      },
      {
        question: {
          id: "q-2",
          label: "Q2",
          number: "2",
          sub: null,
          text: "A parallel plate capacitor with air between plates has a capacitance of 8 pF. What is the capacitance if distance between plates is halved and medium has dielectric constant k=6?",
          altText: null,
          marks: 5,
        },
        answerId: "ans-2",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "q-2",
          verdict: "correct",
          marksAwarded: 5,
          marksTotal: 5,
          feedback: "Correct substitution of k and halved distance factor. Final value 96 pF is accurate.",
        },
      },
      {
        question: {
          id: "q-3",
          label: "Q3",
          number: "3",
          sub: null,
          text: "Explain the working principle of a cyclotron. Why can electrons not be accelerated using an ordinary cyclotron?",
          altText: null,
          marks: 5,
        },
        answerId: "ans-3",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "q-3",
          verdict: "partial",
          marksAwarded: 4,
          marksTotal: 5,
          feedback:
            "Working principle and cyclotron frequency resonance are clearly stated. 1 mark deducted for missing explicit formula for relativistic mass m = m₀/√(1-v²/c²).",
        },
      },
      {
        question: {
          id: "q-4",
          label: "Q4",
          number: "4",
          sub: null,
          text: "Define mutual inductance. Two concentric circular coils of radii r1 and r2 are placed co-axially. Derive the expression for mutual inductance.",
          altText: null,
          marks: 5,
        },
        answerId: "ans-4",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "q-4",
          verdict: "correct",
          marksAwarded: 5,
          marksTotal: 5,
          feedback: "Correct definition and derivation using magnetic field at center of larger loop.",
        },
      },
      {
        question: {
          id: "q-5",
          label: "Q5",
          number: "5",
          sub: null,
          text: "Distinguish between diamagnetic, paramagnetic, and ferromagnetic materials with respect to magnetic susceptibility and behavior in an external magnetic field.",
          altText: null,
          marks: 5,
        },
        answerId: "ans-5",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "q-5",
          verdict: "partial",
          marksAwarded: 3,
          marksTotal: 5,
          feedback:
            "Good concise distinction of susceptibility values. 2 marks lost because Curie's temperature law for paramagnetic substances was omitted.",
        },
      },
      {
        question: {
          id: "q-6",
          label: "Q6",
          number: "6",
          sub: null,
          text: "Draw a neat ray diagram for an astronomical telescope in normal adjustment and write the expression for its magnifying power.",
          altText: null,
          marks: 5,
        },
        answerId: "ans-6",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "q-6",
          verdict: "correct",
          marksAwarded: 5,
          marksTotal: 5,
          feedback: "Ray diagram is properly labeled with intermediate focal planes and magnification formula.",
        },
      },
    ],
    unmatched: [],
    overall: {
      totalAwarded: 27,
      totalMax: 30,
      gradeLetter: "A",
      summary:
        "High-caliber answer script with structured mathematical derivations and clear diagrams. Candidate shows strong mastery of electrostatics and electromagnetic induction.",
      strengths: [
        "Rigorous step-by-step Gauss's Law derivation",
        "Clean units and algebraic manipulations",
        "Accurate optics ray tracing",
      ],
      improvements: [
        "Include relativistic mass formula m = m₀/√(1-v²/c²) when discussing cyclotron limitations",
        "Cite Curie's temperature dependence law (χ ∝ 1/T) for paramagnetic materials",
      ],
    },
  },
  {
    id: "eval-seed-math-202",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    examTitle: "Class XII Mathematics Midterm",
    studentName: "Priya Patel",
    subject: "Mathematics",
    questionPages: [
      {
        url: "/samples/question-paper-1.jpg",
        width: 1200,
        height: 1600,
        name: "question-paper-page-1.jpg",
      },
    ],
    answerPages: [
      {
        url: "/samples/answer-sheet-1.jpg",
        width: 1200,
        height: 1600,
        name: "answer-sheet-page-1.jpg",
      },
    ],
    questions: [
      {
        id: "m-1",
        label: "Q1",
        number: "1",
        sub: null,
        text: "Evaluate the integral: ∫ [e^x (1 + sin x)] / (1 + cos x) dx.",
        altText: null,
        marks: 5,
      },
      {
        id: "m-2",
        label: "Q2",
        number: "2",
        sub: null,
        text: "Find the shortest distance between the skew lines r = (i+2j+3k) + λ(2i+3j+4k) and r = (2i+4j+5k) + μ(3i+4j+5k).",
        altText: null,
        marks: 5,
      },
      {
        id: "m-3",
        label: "Q3",
        number: "3",
        sub: null,
        text: "Using elementary row transformations, find the inverse of the 3x3 matrix A.",
        altText: null,
        marks: 5,
      },
    ],
    answers: [
      {
        id: "m-ans-1",
        rawLabel: "1",
        transcription:
          "Convert to half-angles: 1 + sin x = 1 + 2 sin(x/2)cos(x/2), 1 + cos x = 2 cos²(x/2).\nIntegrand becomes e^x [ 1/2 sec²(x/2) + tan(x/2) ].\nUsing standard form ∫ e^x [f(x) + f'(x)] dx = e^x f(x) + C with f(x) = tan(x/2).\nAnswer: e^x · tan(x/2) + C.",
        confidence: 0.99,
        regions: [
          {
            page: 1,
            bbox: { x0: 0.08, y0: 0.1, x1: 0.92, y1: 0.4 },
          },
        ],
      },
      {
        id: "m-ans-2",
        rawLabel: "2",
        transcription:
          "b1 × b2 = (2i+3j+4k) × (3i+4j+5k) = -i + 2j - k.\n|b1 × b2| = √(1 + 4 + 1) = √6.\n(a2 - a1) = i + 2j + 2k.\nDistance d = |(a2 - a1) · (b1 × b2)| / |b1 × b2| = |-1 + 4 - 2| / √6 = 1 / √6 units.",
        confidence: 0.97,
        regions: [
          {
            page: 1,
            bbox: { x0: 0.08, y0: 0.45, x1: 0.92, y1: 0.8 },
          },
        ],
      },
    ],
    results: [
      {
        question: {
          id: "m-1",
          label: "Q1",
          number: "1",
          sub: null,
          text: "Evaluate the integral: ∫ [e^x (1 + sin x)] / (1 + cos x) dx.",
          altText: null,
          marks: 5,
        },
        answerId: "m-ans-1",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "m-1",
          verdict: "correct",
          marksAwarded: 5,
          marksTotal: 5,
          feedback: "Brilliant application of half-angle trigonometry to convert to e^x [f(x) + f'(x)] theorem.",
        },
      },
      {
        question: {
          id: "m-2",
          label: "Q2",
          number: "2",
          sub: null,
          text: "Find the shortest distance between the skew lines r = (i+2j+3k) + λ(2i+3j+4k) and r = (2i+4j+5k) + μ(3i+4j+5k).",
          altText: null,
          marks: 5,
        },
        answerId: "m-ans-2",
        status: "matched",
        lowConfidence: false,
        grading: {
          questionId: "m-2",
          verdict: "correct",
          marksAwarded: 5,
          marksTotal: 5,
          feedback: "Accurate cross product and scalar projection calculation. 1/√6 is correct.",
        },
      },
      {
        question: {
          id: "m-3",
          label: "Q3",
          number: "3",
          sub: null,
          text: "Using elementary row transformations, find the inverse of the 3x3 matrix A.",
          altText: null,
          marks: 5,
        },
        answerId: null,
        status: "unanswered",
        lowConfidence: false,
        grading: {
          questionId: "m-3",
          verdict: "unanswered",
          marksAwarded: 0,
          marksTotal: 5,
          feedback: "Question was not attempted in this student answer sheet.",
        },
      },
    ],
    unmatched: [],
    overall: {
      totalAwarded: 10,
      totalMax: 15,
      gradeLetter: "B",
      summary:
        "Exemplary technique in calculus and 3D vector geometry. Question 3 on row transformations was skipped.",
      strengths: ["Clean vector algebra", "Immediate recognition of integration identities"],
      improvements: ["Time management to complete all compulsory matrix algebra questions"],
    },
  },
];

export function loadSettings(): Settings {
  if (typeof window === "undefined")
    return {
      apiKey: "",
      model: DEFAULT_MODELS.gemini,
      theme: "system",
      user: DEFAULT_USER,
      defaultStrictness: "balanced",
      defaultFeedback: "standard",
      notificationsEnabled: true,
    };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      const apiKey = typeof parsed.apiKey === "string" ? parsed.apiKey : "";
      let model = typeof parsed.model === "string" && parsed.model ? parsed.model : "";
      if (apiKey) {
        const valid = modelsFor(apiKey).some((m) => m.id === model);
        if (!valid) model = defaultModelFor(apiKey);
      }
      return {
        apiKey,
        model: model || DEFAULT_MODELS.gemini,
        theme: parsed.theme || "system",
        user: parsed.user || DEFAULT_USER,
        defaultStrictness: parsed.defaultStrictness || "balanced",
        defaultFeedback: parsed.defaultFeedback || "standard",
        notificationsEnabled: parsed.notificationsEnabled ?? true,
      };
    }
  } catch {}
  return {
    apiKey: "",
    model: DEFAULT_MODELS.gemini,
    theme: "system",
    user: DEFAULT_USER,
    defaultStrictness: "balanced",
    defaultFeedback: "standard",
    notificationsEnabled: true,
  };
}

export function saveSettings(s: Settings) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    if (typeof window !== "undefined" && s.theme) {
      applyTheme(s.theme);
    }
  } catch {}
}

export function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (mode === "dark" || (mode === "system" && prefersDark)) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function loadHistory(): import("./types").EvaluationResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } else {
      // First-time experience: populate initial seed evaluations
      saveHistory(SEED_HISTORY);
      return SEED_HISTORY;
    }
  } catch {}
  return [];
}

export function saveHistory(items: import("./types").EvaluationResult[]) {
  if (typeof window === "undefined") return;
  try {
    // Keep up to 50 items to stay comfortably within localStorage limits
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
  } catch (e) {
    console.warn("Failed to persist history to localStorage", e);
  }
}
