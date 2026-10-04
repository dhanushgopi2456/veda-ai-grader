import type { EvaluationResult } from "./types";

export function generateReportHtml(result: EvaluationResult): string {
  const student = result.studentName || "Student";
  const subject = result.subject || "Subject";
  const examTitle = result.examTitle || "Exam Evaluation Report";
  const dateStr = new Date(result.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const pct =
    result.overall && result.overall.totalMax > 0
      ? Math.round((result.overall.totalAwarded / result.overall.totalMax) * 100)
      : 0;
  const gradeLetter = result.overall?.gradeLetter || "—";
  const totalAwarded = result.overall?.totalAwarded ?? 0;
  const totalMax = result.overall?.totalMax ?? 0;

  const rowsHtml = result.results
    .map((r, idx) => {
      const ans = r.answerId ? result.answers.find((a) => a.id === r.answerId) : null;
      const verdict = r.grading?.verdict || r.status;
      const verdictColor =
        verdict === "correct"
          ? "#059669"
          : verdict === "partial"
          ? "#d97706"
          : verdict === "incorrect"
          ? "#e11d48"
          : "#6b7280";
      const verdictLabel =
        verdict === "correct"
          ? "Correct"
          : verdict === "partial"
          ? "Partially Correct"
          : verdict === "incorrect"
          ? "Incorrect"
          : "Not Attempted";

      return `
      <tr style="border-bottom: 1px solid #e5e7eb; page-break-inside: avoid;">
        <td style="padding: 12px 10px; font-weight: 700; color: #111827; vertical-align: top;">${r.question.label || `Q${idx + 1}`}</td>
        <td style="padding: 12px 10px; color: #374151; vertical-align: top; max-width: 280px;">
          <div style="font-weight: 600; font-size: 13px; color: #1f2937;">${escapeHtml(r.question.text)}</div>
          ${r.question.altText ? `<div style="font-style: italic; color: #6b7280; font-size: 11px; margin-top: 4px;">OR: ${escapeHtml(r.question.altText)}</div>` : ""}
        </td>
        <td style="padding: 12px 10px; vertical-align: top; font-family: monospace; font-size: 12px; background: #fafafa; border-radius: 6px; color: #1f2937; max-width: 240px;">
          ${ans ? escapeHtml(ans.transcription || "[No handwritten text transcribed]") : '<span style="color: #9ca3af; font-style: italic;">[Not attempted]</span>'}
        </td>
        <td style="padding: 12px 10px; text-align: center; vertical-align: top; font-weight: 700; font-size: 14px; white-space: nowrap;">
          <span style="color: #111827;">${r.grading?.marksAwarded ?? 0}</span>
          <span style="color: #9ca3af; font-size: 12px; font-weight: 400;"> / ${r.question.marks ?? r.grading?.marksTotal ?? 5}</span>
        </td>
        <td style="padding: 12px 10px; text-align: center; vertical-align: top;">
          <span style="display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: ${verdictColor}; background: ${verdictColor}15; border: 1px solid ${verdictColor}40;">
            ${verdictLabel}
          </span>
        </td>
        <td style="padding: 12px 10px; vertical-align: top; font-size: 12px; color: #4b5563; line-height: 1.4;">
          ${escapeHtml(r.grading?.feedback || "—")}
        </td>
      </tr>
      `;
    })
    .join("");

  const strengthsHtml =
    result.overall?.strengths && result.overall.strengths.length > 0
      ? `
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 0.05em;">Key Strengths</h3>
      <ul style="margin: 0; padding-left: 18px; color: #047857; font-size: 12px; line-height: 1.5;">
        ${result.overall.strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
      </ul>
    </div>
    `
      : "";

  const improvementsHtml =
    result.overall?.improvements && result.overall.improvements.length > 0
      ? `
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">Areas for Improvement</h3>
      <ul style="margin: 0; padding-left: 18px; color: #b45309; font-size: 12px; line-height: 1.5;">
        ${result.overall.improvements.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>
    </div>
    `
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VedaAI Evaluation Report - ${escapeHtml(student)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #f9fafb;
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      color: #ea580c;
      letter-spacing: -0.02em;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      margin: 6px 0 2px 0;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    .meta-item label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 2px;
    }
    .meta-item value {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      display: block;
    }
    .score-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 14px;
      margin-bottom: 24px;
    }
    .score-box {
      font-size: 38px;
      font-weight: 800;
      line-height: 1;
    }
    .score-label {
      font-size: 13px;
      opacity: 0.9;
      margin-top: 4px;
    }
    .grade-badge {
      font-size: 32px;
      font-weight: 900;
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 24px;
      border-radius: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }
    th {
      background: #f3f4f6;
      color: #4b5563;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 700;
      padding: 10px;
      letter-spacing: 0.05em;
      text-align: left;
    }
    .action-bar {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #374151;
    }
    .btn-primary {
      background: #ea580c;
      color: white;
      border: none;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 0; max-width: 100%; }
      .action-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">VedaAI Evaluation Report</div>
        <div class="title">${escapeHtml(examTitle)}</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Automated Handwriting Recognition &amp; Rubric Evaluation</div>
      </div>
      <div style="text-align: right; font-size: 12px; color: #6b7280;">
        <div><strong>Date:</strong> ${escapeHtml(dateStr)}</div>
        <div style="margin-top: 4px;"><strong>Subject:</strong> ${escapeHtml(subject)}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <label>Student Candidate</label>
        <value>${escapeHtml(student)}</value>
      </div>
      <div class="meta-item">
        <label>Subject / Topic</label>
        <value>${escapeHtml(subject)}</value>
      </div>
      <div class="meta-item">
        <label>Questions Count</label>
        <value>${result.questions.length} Items</value>
      </div>
      <div class="meta-item">
        <label>Overall Grade</label>
        <value>Grade ${escapeHtml(gradeLetter)} (${pct}%)</value>
      </div>
    </div>

    <div class="score-banner">
      <div>
        <div class="score-box">${totalAwarded} <span style="font-size: 20px; font-weight: 400; opacity: 0.85;">/ ${totalMax}</span></div>
        <div class="score-label">Total Score Awarded (${pct}%)</div>
      </div>
      <div class="grade-badge">
        Grade ${escapeHtml(gradeLetter)}
      </div>
    </div>

    ${strengthsHtml}
    ${improvementsHtml}

    <h3 style="font-size: 15px; font-weight: 700; color: #111827; margin: 24px 0 8px 0;">Itemized Question &amp; Handwriting Evaluation</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 48px;">No.</th>
          <th>Question</th>
          <th>Handwritten Answer</th>
          <th style="text-align: center; width: 70px;">Marks</th>
          <th style="text-align: center; width: 110px;">Verdict</th>
          <th style="width: 220px;">AI Examiner Feedback</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="action-bar">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print or Save as PDF</button>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function downloadEvaluationReport(result: EvaluationResult): void {
  try {
    const student = (result.studentName || "student").toLowerCase().replace(/[^a-z0-9]/g, "-");
    const subject = (result.subject || "exam").toLowerCase().replace(/[^a-z0-9]/g, "-");
    const date = new Date(result.createdAt).toISOString().split("T")[0];
    const htmlContent = generateReportHtml(result);

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `veda-report-${student}-${subject}-${date}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Also attempt native print if permitted
    try {
      window.print();
    } catch {}
  } catch (err) {
    console.error("Failed to download evaluation report", err);
  }
}
