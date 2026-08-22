import { generateRecordWordDocument } from "../backend/src/documents/generateRecordWordDocument.js";
import { getMissingFields, normalizeText } from "../backend/src/utils/recordData.js";

export default async function handler(req, res) {
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

  try {
    const fileName = `experiment-${normalizeText(req.body.experimentNumber)}.docx`;
    const wordBuffer = await generateRecordWordDocument(req.body);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.status(200).send(wordBuffer);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to generate Word."
    });
  }
}
