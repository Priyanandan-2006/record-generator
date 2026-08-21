const sections = [
  { title: "Aim", key: "aim" },
  { title: "Algorithm", key: "algorithm" },
  { title: "Code", key: "code", preserveWhitespace: true },
  { title: "Output", key: "output" },
  { title: "Result", key: "result" }
];

function formatDisplayDate(dateValue) {
  if (!dateValue) {
    return "DD/MM/YYYY";
  }

  const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return dateValue;
  }

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export default function RecordPreview({ formData }) {
  return (
    <section className="panel preview-panel">
      <div className="panel-heading">
        <h2>Live Preview</h2>
        <p>Layout reference for the generated A4 record.</p>
      </div>

      <article className="preview-sheet">
        <div className="preview-topline">
          <div>
            <p className="preview-label">Date</p>
            <p>{formatDisplayDate(formData.date)}</p>
          </div>
          <div>
            <p className="preview-label">Experiment No.</p>
            <p>{formData.experimentNumber || "Not set"}</p>
          </div>
        </div>

        <div className="preview-title-block">
          <p className="preview-label">Title</p>
          <h3>{formData.title || "Experiment title appears here"}</h3>
        </div>

        {sections.map((section) => (
          <section key={section.key} className="preview-section">
            <p className="preview-label">{section.title}</p>
            <p
              className={
                section.preserveWhitespace ? "preview-copy preview-code" : "preview-copy"
              }
            >
              {formData[section.key] || `${section.title} content will appear here.`}
            </p>
          </section>
        ))}
      </article>
    </section>
  );
}
