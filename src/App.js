import React, { useState } from "react";
import "./App.css";

function App() {
  const [log, setLog] = useState("");
  const [summary, setSummary] = useState("");
  const [parsed, setParsed] = useState(null);

  const handleSubmit = () => {
    // Parse syslog line using regex
    const pattern =
      /(?<date>\w+ +\d+ \d+:\d+:\d+) (?<host>\S+) (?<service>\S+)\[(?<pid>\d+)\]: (?<message>.+)/;
    const match = log.match(pattern);
    const parsedLog = match?.groups || {};
    setParsed(parsedLog);

    // Fake summary output (for demonstration)
    const fakeSummary = `Summary: Activity detected from service "${parsedLog.service || "unknown"}" with message: "${parsedLog.message || "none"}".`;
    setSummary(fakeSummary);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Syslog Analyzer</h1>

      <textarea
        rows={5}
        placeholder="Paste a syslog line here..."
        value={log}
        onChange={(e) => setLog(e.target.value)}
        style={{ width: "100%", padding: "1rem", fontSize: "1rem", marginBottom: "1rem", borderRadius: "5px", border: "1px solid #ccc" }}
      />

      <button
        onClick={handleSubmit}
        style={{ padding: "0.5rem 1.5rem", fontSize: "1rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Analyze
      </button>

      {summary && (
        <div style={{ marginTop: "2rem", backgroundColor: "#fef3c7", padding: "1rem", borderRadius: "5px" }}>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {parsed && (
        <div style={{ marginTop: "2rem", backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "5px" }}>
          <h2>Parsed Log</h2>
          <pre>{JSON.stringify(parsed, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
