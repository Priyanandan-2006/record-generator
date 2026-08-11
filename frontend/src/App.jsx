import { useState } from "react";
import RecordForm from "./components/RecordForm";
import RecordPreview from "./components/RecordPreview";

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  experimentNumber: "",
  title: "",
  aim: "",
  algorithm: "",
  code: "",
  output: "",
  result: ""
};

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData(initialForm);
    setError("");
  };

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to generate PDF.");
      }

      const pdfBlob = await response.blob();
      const fileUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = `experiment-${formData.experimentNumber || "record"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(fileUrl);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Lab Record PDF Generator</p>
          <h1>Build polished experiment records in a single click.</h1>
          <p className="hero-text">
            Fill out the experiment details, preview the structure live, and
            export a professional A4 PDF from the Node.js backend.
          </p>
        </div>
      </header>

      <main className="content-grid">
        <RecordForm
          formData={formData}
          isGenerating={isGenerating}
          error={error}
          onChange={handleChange}
          onGenerate={handleGeneratePdf}
          onReset={handleReset}
        />
        <RecordPreview formData={formData} />
      </main>
    </div>
  );
}
