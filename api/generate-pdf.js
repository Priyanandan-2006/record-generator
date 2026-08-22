import { generateRecordPdf } from "../backend/src/pdf/generateRecordPdf.js";
import { getMissingFields, normalizeText } from "../backend/src/utils/recordData.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

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
}
