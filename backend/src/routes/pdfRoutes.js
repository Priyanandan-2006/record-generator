import { Router } from "express";
import { generateRecordPdf } from "../pdf/generateRecordPdf.js";

const router = Router();

const requiredFields = [
  "date",
  "experimentNumber",
  "title",
  "aim",
  "algorithm",
  "code",
  "output",
  "result"
];

router.post("/generate-pdf", (req, res) => {
  const missingFields = requiredFields.filter((field) => {
    const value = req.body?.[field];
    return typeof value !== "string" || !value.trim();
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`
    });
  }

  const fileName = `experiment-${req.body.experimentNumber}.pdf`;
  const pdfStream = generateRecordPdf(req.body);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  pdfStream.pipe(res);
  pdfStream.end();
});

export default router;
