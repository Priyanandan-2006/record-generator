import PDFDocument from "pdfkit";
import { formatDisplayDate, normalizeText } from "../utils/recordData.js";

const PAGE_MARGIN = 56;
const PAGE_WIDTH = 595.28; // A4 width in PDF points
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const BOTTOM_LIMIT_OFFSET = 56;

function hasSpace(doc, height) {
  return doc.y + height <= doc.page.height - BOTTOM_LIMIT_OFFSET;
}

function addNewPage(doc) {
  doc.addPage();
  doc.y = PAGE_MARGIN;
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

  doc.moveDown(0.8);

  const lineY = doc.y;

  doc
    .strokeColor("#cdb89d")
    .lineWidth(1)
    .moveTo(PAGE_MARGIN, lineY)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, lineY)
    .stroke();

  doc.y = lineY + 16;

  drawMetaTable(doc, data);
}

function drawMetaTable(doc, data) {
  const firstColumnWidth = CONTENT_WIDTH * 0.5;
  const secondColumnWidth = CONTENT_WIDTH - firstColumnWidth;

  const dateHeight = getMetaHeight(
    doc,
    "Date",
    formatDisplayDate(data.date),
    firstColumnWidth - 24
  );

  const experimentHeight = getMetaHeight(
    doc,
    "Experiment Number",
    data.experimentNumber,
    secondColumnWidth - 24
  );

  const firstRowHeight = Math.max(dateHeight, experimentHeight, 42);

  const titleHeight = getMetaHeight(doc, "Title", data.title, CONTENT_WIDTH - 24);
  const secondRowHeight = Math.max(titleHeight, 42);
  const totalHeight = firstRowHeight + secondRowHeight;

  if (!hasSpace(doc, totalHeight + 20)) {
    addNewPage(doc);
  }

  const tableTop = doc.y;

  doc.rect(PAGE_MARGIN, tableTop, CONTENT_WIDTH, totalHeight).stroke("#cdb89d");

  doc
    .moveTo(PAGE_MARGIN + firstColumnWidth, tableTop)
    .lineTo(PAGE_MARGIN + firstColumnWidth, tableTop + firstRowHeight)
    .stroke("#cdb89d");

  doc
    .moveTo(PAGE_MARGIN, tableTop + firstRowHeight)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, tableTop + firstRowHeight)
    .stroke("#cdb89d");

  writeMetaCell(
    doc,
    "Date",
    formatDisplayDate(data.date),
    PAGE_MARGIN + 12,
    tableTop + 8,
    firstColumnWidth - 24
  );

  writeMetaCell(
    doc,
    "Experiment Number",
    data.experimentNumber,
    PAGE_MARGIN + firstColumnWidth + 12,
    tableTop + 8,
    secondColumnWidth - 24
  );

  writeMetaCell(
    doc,
    "Title",
    data.title,
    PAGE_MARGIN + 12,
    tableTop + firstRowHeight + 8,
    CONTENT_WIDTH - 24
  );

  doc.y = tableTop + totalHeight + 18;
}

function getMetaHeight(doc, label, value, width) {
  doc.font("Helvetica-Bold").fontSize(10);

  const labelHeight = doc.heightOfString(label, {
    width
  });

  doc.font("Helvetica").fontSize(11);

  const valueHeight = doc.heightOfString(normalizeText(value) || "N/A", {
    width,
    lineGap: 2
  });

  return labelHeight + valueHeight + 26;
}

function writeMetaCell(doc, label, value, x, y, width) {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#6f5b43")
    .text(label, x, y, {
      width
    });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#111827")
    .text(normalizeText(value) || "N/A", x, y + 14, {
      width,
      lineGap: 2
    });
}

function drawSectionHeading(doc, title) {
  const headingHeight = 34;

  if (!hasSpace(doc, headingHeight)) {
    addNewPage(doc);
  }

  const top = doc.y;

  doc
    .roundedRect(PAGE_MARGIN, top, CONTENT_WIDTH, headingHeight, 7)
    .fillAndStroke("#f4eadf", "#ddc9af");

  doc
    .fillColor("#6f4e37")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(title, PAGE_MARGIN + 14, top + 10, {
      width: CONTENT_WIDTH - 28
    });

  doc.y = top + headingHeight + 10;
}

function drawTextContent(doc, value) {
  const content = normalizeText(value) || "N/A";

  doc.font("Helvetica").fontSize(11).fillColor("#1f2937");

  const paragraphs = content.split("\n");

  for (const paragraph of paragraphs) {
    const text = paragraph.trim();

    if (!text) {
      if (!hasSpace(doc, 12)) {
        addNewPage(doc);
      }

      doc.moveDown(0.5);
      continue;
    }

    const textHeight = doc.heightOfString(text, {
      width: CONTENT_WIDTH - 28,
      lineGap: 3
    });

    if (
      textHeight < doc.page.height - PAGE_MARGIN * 2 &&
      !hasSpace(doc, textHeight + 8)
    ) {
      addNewPage(doc);
    }

    doc.text(text, PAGE_MARGIN + 14, doc.y, {
      width: CONTENT_WIDTH - 28,
      lineGap: 3
    });

    doc.moveDown(0.4);
  }
}

function drawCodeContent(doc, value) {
  const content = normalizeText(value) || "N/A";
  const lines = content.split("\n");

  doc.font("Courier").fontSize(8.5).fillColor("#111827");

  for (const line of lines) {
    const codeLine = line || " ";

    const lineHeight = doc.heightOfString(codeLine, {
      width: CONTENT_WIDTH - 28,
      lineGap: 1
    });

    if (!hasSpace(doc, lineHeight + 12)) {
      addNewPage(doc);
    }

    doc.text(codeLine, PAGE_MARGIN + 14, doc.y, {
      width: CONTENT_WIDTH - 28,
      lineGap: 1
    });

    doc.moveDown(0.15);
  }
}

function drawSection(doc, title, value, options = {}) {
  const minimumSpace = 60;

  if (!hasSpace(doc, minimumSpace)) {
    addNewPage(doc);
  }

  drawSectionHeading(doc, title);

  if (options.code) {
    drawCodeContent(doc, value);
  } else {
    drawTextContent(doc, value);
  }

  if (hasSpace(doc, 16)) {
    doc.moveDown(0.8);
  }
}

export function generateRecordPdf(data) {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: PAGE_MARGIN,
      bottom: PAGE_MARGIN,
      left: PAGE_MARGIN,
      right: PAGE_MARGIN
    },
    bufferPages: true
  });

  drawHeader(doc, data);
  drawSection(doc, "Aim", data.aim);
  drawSection(doc, "Algorithm", data.algorithm);
  drawSection(doc, "Code", data.code, { code: true });
  drawSection(doc, "Output", data.output);
  drawSection(doc, "Result", data.result);

  return doc;
}
