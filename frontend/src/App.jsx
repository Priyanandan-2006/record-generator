import { useState } from "react";
import RecordForm from "./components/RecordForm";
import RecordPreview from "./components/RecordPreview";
import recordifyMark from "./assets/recordify-mark.svg";

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

const apiBaseUrl = import.meta.env.VITE_API_URL || "";

function getExportConfig(format) {
  if (format === "word") {
    return {
      endpoint: "generate-word",
      extension: "doc",
      label: "Word"
    };
  }

  return {
    endpoint: "generate-pdf",
    extension: "pdf",
    label: "PDF"
  };
}

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

  const handleGenerateDocument = async (format) => {
    setIsGenerating(true);
    setError("");

    try {
      const exportConfig = getExportConfig(format);
      const response = await fetch(`${apiBaseUrl}/api/${exportConfig.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to generate ${exportConfig.label}.`);
      }

      const fileBlob = await response.blob();
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = `experiment-${formData.experimentNumber || "record"}.${exportConfig.extension}`;
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
          <div className="brand-row">
            <img className="brand-mark" src={recordifyMark} alt="Recordify logo" />
            <p className="eyebrow">Recordify</p>
          </div>
          <h1>Build polished experiment records with Recordify.</h1>
        </div>
      </header>

      <main className="content-grid">
        <RecordForm
          formData={formData}
          isGenerating={isGenerating}
          error={error}
          onChange={handleChange}
          onGenerate={handleGenerateDocument}
          onReset={handleReset}
        />
        <RecordPreview formData={formData} />
      </main>
    </div>
  );
}
