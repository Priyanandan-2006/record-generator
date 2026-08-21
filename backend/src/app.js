import cors from "cors";
import express from "express";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();

app.use(
  cors({
    origin: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", pdfRoutes);

export default app;
