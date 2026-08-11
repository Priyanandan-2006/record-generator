import cors from "cors";
import express from "express";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", pdfRoutes);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
