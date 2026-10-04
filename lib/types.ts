export type Bbox = { x0: number; y0: number; x1: number; y1: number };

export type Region = { page: number; bbox: Bbox };

export type Question = {
  id: string;
  label: string;
  number: string;
  sub: string | null;
  text: string;
  altText: string | null;
  marks: number | null;
};

export type AnswerExtraction = {
  id: string;
  rawLabel: string;
  transcription: string;
  confidence: number;
  regions: Region[];
};

export type Verdict = "correct" | "partial" | "incorrect" | "unanswered";

export type QuestionGrading = {
  questionId: string;
  verdict: Verdict;
  marksAwarded: number;
  marksTotal: number;
  feedback: string;
};

export type OverallFeedback = {
  totalAwarded: number;
  totalMax: number;
  gradeLetter: string;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export type MatchStatus = "matched" | "unanswered" | "unmatched";

export type QuestionResult = {
  question: Question;
  answerId: string | null;
  status: MatchStatus;
  lowConfidence: boolean;
  grading: QuestionGrading | null;
};

export type PageImage = {
  url: string;
  width: number;
  height: number;
  name: string;
};

export type EvaluationConfig = {
  strictness: "lenient" | "balanced" | "strict";
  partialMarking: boolean;
  handwritingForgiving: boolean;
  feedbackLevel: "concise" | "standard" | "comprehensive";
  subject: string;
  studentName: string;
  totalMarksOverride?: number | null;
  customInstructions?: string;
};

export type EvaluationResult = {
  id: string;
  createdAt: number;
  examTitle: string;
  questionPages: PageImage[];
  answerPages: PageImage[];
  questions: Question[];
  answers: AnswerExtraction[];
  results: QuestionResult[];
  unmatched: AnswerExtraction[];
  overall: OverallFeedback | null;
  studentName?: string;
  subject?: string;
  evalConfig?: EvaluationConfig;
};

export type Stage =
  | "dashboard"
  | "new-evaluation"
  | "upload"
  | "processing"
  | "results"
  | "history"
  | "analytics"
  | "settings";

export type StepKey = "prepare" | "questions" | "answers" | "mapping" | "grading";

export type StepState = "pending" | "active" | "done" | "error";

export type ApiErrorPayload = { error?: string };
