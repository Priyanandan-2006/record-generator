const fields = [
  { name: "date", label: "Date", type: "date" },
  { name: "experimentNumber", label: "Experiment Number", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "aim", label: "Aim", type: "textarea" },
  { name: "algorithm", label: "Algorithm", type: "textarea" },
  { name: "code", label: "Code", type: "textarea", className: "code-field" },
  { name: "output", label: "Output", type: "textarea" },
  { name: "result", label: "Result", type: "textarea" }
];

export default function RecordForm({
  formData,
  isGenerating,
  error,
  onChange,
  onGenerate,
  onReset
}) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>Experiment Details</h2>
        <p>Every field is included in the exported A4 PDF.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onGenerate();
        }}
      >
        <div className="form-grid">
          {fields.map((field) => (
            <label
              key={field.name}
              className={field.type === "textarea" ? "field full-width" : "field"}
            >
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={onChange}
                  rows={field.name === "code" ? 10 : 5}
                  className={field.className || ""}
                  required
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={onChange}
                  required
                />
              )}
            </label>
          ))}
        </div>

        {error ? <p className="error-banner">{error}</p> : null}

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={isGenerating}>
            {isGenerating ? "Generating PDF..." : "Generate PDF"}
          </button>
          <button type="button" className="secondary-button" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
