import React, { useState } from "react";
import "./App.css"; // We'll use this next

function App() {
  const [log, setLog] = useState("");
  const [parsed, setParsed] = useState(null);
  const [summary, setSummary] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const handleSubmit = () => {
    const pattern =
  /(?:<\d+>)?(?<timestamp>\w+\s+\d+\s+\d+:\d+:\d+)\s+(?<host>\S+)\s+(?<service>\S+):\s+(?<message>.+)/;


    const match = log.match(pattern);
    const parsedLog = match?.groups || {};
    const severityMatch = parsedLog.message?.match(/(error|warning|info|debug)/i);
    parsedLog.severity = severityMatch ? severityMatch[1].toUpperCase() : "UNKNOWN";

    setParsed(parsedLog);

    const fakeSummary = `Activity detected from service "${parsedLog.service}" with message: "${parsedLog.message}".`;
    setSummary(fakeSummary);

    let rec = "";
    if (/failed password/i.test(parsedLog.message)) {
      rec = "Possible brute-force attack. Block the source IP or enable fail2ban.";
    } else if (/invalid user/i.test(parsedLog.message)) {
      rec = "Check for unauthorized login attempts and tighten access.";
    } else if (/port scan/i.test(parsedLog.message)) {
      rec = "Run a network scan. Limit ports using a firewall.";
    } else {
      rec = "Review full logs or escalate to a security analyst.";
    }

    setRecommendation(rec);
  };

  return (
    <div className="app">
      <h1>Syslog Analyzer</h1>

      <textarea
        placeholder="Paste a syslog message here..."
        value={log}
        onChange={(e) => setLog(e.target.value)}
      />

      <button onClick={handleSubmit}>Analyze</button>

      {summary && (
        <div className="section">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {parsed && (
        <div className="section">
          <h2>Parsed Fields</h2>
          <ul>
            <li><strong>Timestamp:</strong> {parsed.timestamp}</li>
            <li><strong>Host:</strong> {parsed.host}</li>
            <li><strong>Service:</strong> {parsed.service}</li>
            <li><strong>PID:</strong> {parsed.pid}</li>
            <li><strong>Severity:</strong> <span className={`severity ${parsed.severity.toLowerCase()}`}>{parsed.severity}</span></li>
            <li><strong>Message:</strong> {parsed.message}</li>
          </ul>
        </div>
      )}

      {recommendation && (
        <div className="section action">
          <h2>Recommended Action</h2>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default App;

