import { Router } from "express";
import { generateRecordWordDocument } from "../documents/generateRecordWordDocument.js";
import { generateRecordPdf } from "../pdf/generateRecordPdf.js";
import { getMissingFields, normalizeText } from "../utils/recordData.js";

const router = Router();

router.post("/generate-pdf", (req, res) => {
  const missingFields = getMissingFields(req.body);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`
    });
  }

  const fileName = `experiment-${normalizeText(req.body.experimentNumber)}.pdf`;
  const pdfStream = generateRecordPdf(req.body);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  pdfStream.pipe(res);
  pdfStream.end();
});

router.post("/generate-word", async (req, res) => {
  const missingFields = getMissingFields(req.body);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`
    });
  }

  try {
    const fileName = `experiment-${normalizeText(req.body.experimentNumber)}.docx`;
    const wordBuffer = await generateRecordWordDocument(req.body);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.send(wordBuffer);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to generate Word."
    });
  }
});

export default router;
