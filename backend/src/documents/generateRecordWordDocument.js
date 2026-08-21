import { formatDisplayDate, normalizeText } from "../utils/recordData.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderTextBlock(value, preserveWhitespace = false) {
  const content = escapeHtml(normalizeText(value) || "N/A").replaceAll(
    /\r?\n/g,
    "<br/>"
  );

  if (preserveWhitespace) {
    return `<p class="section-copy code-block">${content}</p>`;
  }

  return `<p class="section-copy">${content}</p>`;
}

export function generateRecordWordDocument(data) {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Experiment Record</title>
    <style>
      @page {
        size: A4;
        margin: 20mm;
      }

      body {
        font-family: Arial, sans-serif;
        color: #1f2937;
        line-height: 1.5;
      }

      h1 {
        margin: 0 0 12px;
        text-align: center;
        color: #17324d;
        font-size: 24px;
      }

      .divider {
        border: 0;
        border-top: 1px solid #cdb89d;
        margin: 0 0 18px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      td {
        border: 1px solid #cdb89d;
        padding: 10px 12px;
        vertical-align: top;
      }

      .label {
        font-size: 11px;
        font-weight: 700;
        color: #6f5b43;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .value {
        font-size: 12px;
      }

      .section-title {
        background: #f4eadf;
        border: 1px solid #ddc9af;
        border-radius: 6px;
        color: #6f4e37;
        font-size: 14px;
        font-weight: 700;
        margin: 16px 0 10px;
        padding: 9px 12px;
      }

      .section-copy {
        margin: 0 0 8px;
        font-size: 12px;
      }

      .code-block {
        font-family: "Courier New", monospace;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <h1>Experiment Record</h1>
    <hr class="divider" />

    <table>
      <tr>
        <td style="width: 50%;">
          <div class="label">Date</div>
          <div class="value">${escapeHtml(formatDisplayDate(data.date))}</div>
        </td>
        <td>
          <div class="label">Experiment Number</div>
          <div class="value">${escapeHtml(normalizeText(data.experimentNumber) || "N/A")}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="label">Title</div>
          <div class="value">${escapeHtml(normalizeText(data.title) || "N/A")}</div>
        </td>
      </tr>
    </table>

    <div class="section-title">Aim</div>
    ${renderTextBlock(data.aim)}

    <div class="section-title">Algorithm</div>
    ${renderTextBlock(data.algorithm)}

    <div class="section-title">Code</div>
    ${renderTextBlock(data.code, true)}

    <div class="section-title">Output</div>
    ${renderTextBlock(data.output)}

    <div class="section-title">Result</div>
    ${renderTextBlock(data.result)}
  </body>
</html>`;

  return Buffer.from(`\ufeff${html}`, "utf8");
}
