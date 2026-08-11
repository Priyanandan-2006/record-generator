import PDFDocument from "pdfkit";

const PAGE_MARGIN = 56;
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2;

function normalizeText(value) {
  return String(value || "").trim();
}

function drawHeader(doc, data) {
  doc
    .fillColor("#17324d")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Experiment Record", PAGE_MARGIN, 52, {
      width: CONTENT_WIDTH,
      align: "center"
    });

  doc
    .moveDown(0.8)
    .strokeColor("#b5c7d9")
    .lineWidth(1)
    .moveTo(PAGE_MARGIN, doc.y)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, doc.y)
    .stroke();

  doc.moveDown(0.8);
  drawMetaTable(doc, data);
}

function drawMetaTable(doc, data) {
  const top = doc.y;
  const rowHeight = 32;
  const firstColumnWidth = CONTENT_WIDTH * 0.5;
  const secondColumnWidth = CONTENT_WIDTH - firstColumnWidth;

  doc.rect(PAGE_MARGIN, top, CONTENT_WIDTH, rowHeight * 2).stroke("#b5c7d9");
  doc
    .moveTo(PAGE_MARGIN + firstColumnWidth, top)
    .lineTo(PAGE_MARGIN + firstColumnWidth, top + rowHeight * 2)
    .stroke("#b5c7d9");
  doc
    .moveTo(PAGE_MARGIN, top + rowHeight)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, top + rowHeight)
    .stroke("#b5c7d9");

  writeMetaCell(doc, "Date", data.date, PAGE_MARGIN + 12, top + 8, firstColumnWidth - 24);
  writeMetaCell(
    doc,
    "Experiment Number",
    data.experimentNumber,
    PAGE_MARGIN + firstColumnWidth + 12,
    top + 8,
    secondColumnWidth - 24
  );
  writeMetaCell(doc, "Title", data.title, PAGE_MARGIN + 12, top + rowHeight + 8, CONTENT_WIDTH - 24);

  doc.y = top + rowHeight * 2 + 18;
}

function writeMetaCell(doc, label, value, x, y, width) {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#52677e")
    .text(label, x, y, { width });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#111827")
    .text(normalizeText(value) || "N/A", x, y + 12, { width });
}

function ensureSectionSpace(doc, estimatedHeight) {
  if (doc.y + estimatedHeight <= doc.page.height - PAGE_MARGIN) {
    return;
  }

  doc.addPage();
}

function drawSection(doc, title, value, options = {}) {
  const content = normalizeText(value) || "N/A";
  const estimatedHeight = doc.heightOfString(content, {
    width: CONTENT_WIDTH - 24,
    align: "left"
  }) + 58;

  ensureSectionSpace(doc, estimatedHeight);

  const sectionTop = doc.y;

  doc
    .roundedRect(PAGE_MARGIN, sectionTop, CONTENT_WIDTH, estimatedHeight, 10)
    .fillAndStroke("#f8fbfe", "#d7e2ee");

  doc
    .fillColor("#1f4467")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(title, PAGE_MARGIN + 14, sectionTop + 12, {
      width: CONTENT_WIDTH - 28
    });

  doc
    .fillColor("#1f2937")
    .font(options.code ? "Courier" : "Helvetica")
    .fontSize(options.code ? 9.5 : 11)
    .text(content, PAGE_MARGIN + 14, sectionTop + 34, {
      width: CONTENT_WIDTH - 28,
      align: "left"
    });

  doc.y = sectionTop + estimatedHeight + 14;
}

export function generateRecordPdf(data) {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: PAGE_MARGIN,
      bottom: PAGE_MARGIN,
      left: PAGE_MARGIN,
      right: PAGE_MARGIN
    }
  });

  drawHeader(doc, data);
  drawSection(doc, "Aim", data.aim);
  drawSection(doc, "Algorithm", data.algorithm);
  drawSection(doc, "Code", data.code, { code: true });
  drawSection(doc, "Output", data.output);
  drawSection(doc, "Result", data.result);

  return doc;
}
