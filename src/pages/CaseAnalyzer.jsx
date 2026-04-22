import { useState } from "react";

export default function CaseAnalyzer() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Analyze pasted text
  const analyzeCase = async () => {
    if (!inputText) {
      alert("Please enter case text");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/cases/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResult("Error analyzing case");
    }

    setLoading(false);
  };

  // 🔹 Upload and analyze PDF
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/case/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Error uploading file");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>⚖️ Case Analyzer</h2>

      {/* TEXT INPUT */}
      <textarea
        rows="10"
        style={{ width: "100%", padding: "10px" }}
        placeholder="Paste your legal case text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeCase}>
        Analyze Text Case
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* FILE UPLOAD */}
      <h3>Upload PDF</h3>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadFile}>
        Upload & Analyze PDF
      </button>

      <br /><br />

      {/* LOADING */}
      {loading && <p>⏳ Analyzing...</p>}

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>📊 AI Analysis:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              whiteSpace: "pre-wrap",
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}