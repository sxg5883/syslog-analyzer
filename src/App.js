// Import React and useState hook for managing component state
import React, { useState } from "react";

// Import global styles for the application
import "./App.css"; // We'll use this next

function App() {
  // State to store the raw log input from the textarea
  const [log, setLog] = useState("");

  // State to store the parsed log fields (timestamp, host, service, etc.)
  const [parsed, setParsed] = useState(null);

  // State to store a short summary of the log
  const [summary, setSummary] = useState("");

  // State to store recommended actions based on the log content
  const [recommendation, setRecommendation] = useState("");

  /**
   * Handles parsing and analyzing the syslog message entered by the user.
   */
  const handleSubmit = () => {
    // Regular expression to extract syslog fields: optional priority, timestamp, host, service, and message
    const pattern =
      /(?:<\d+>)?(?<timestamp>\w+\s+\d+\s+\d+:\d+:\d+)\s+(?<host>\S+)\s+(?<service>\S+):\s+(?<message>.+)/;

    // Attempt to match the provided log string against the regex pattern
    const match = log.match(pattern);

    // If match is found, use named capturing groups; otherwise, use an empty object
    const parsedLog = match?.groups || {};

    // Attempt to detect severity keywords from the message (error, warning, info, debug)
    const severityMatch = parsedLog.message?.match(/(error|warning|info|debug)/i);

    // Store detected severity in uppercase, or UNKNOWN if no match
    parsedLog.severity = severityMatch ? severityMatch[1].toUpperCase() : "UNKNOWN";

    // Save parsed log data to state
    setParsed(parsedLog);

    // Create a simple summary string based on parsed fields
    const fakeSummary = `Activity detected from service "${parsedLog.service}" with message: "${parsedLog.message}".`;
    setSummary(fakeSummary);

    // Determine recommended action based on message content patterns
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

    // Save recommendation to state
    setRecommendation(rec);
  };

  return (
    <div className="app">
      <h1>Syslog Analyzer</h1>

      {/* Textarea for user to paste a syslog message */}
      <textarea
        placeholder="Paste a syslog message here..."
        value={log}
        onChange={(e) => setLog(e.target.value)} // Update log state on user input
      />

      {/* Button to trigger log analysis */}
      <button onClick={handleSubmit}>Analyze</button>

      {/* Display summary section only if a summary exists */}
      {summary && (
        <div className="section">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {/* Display parsed fields section only if parsed data exists */}
      {parsed && (
        <div className="section">
          <h2>Parsed Fields</h2>
          <ul>
            <li><strong>Timestamp:</strong> {parsed.timestamp}</li>
            <li><strong>Host:</strong> {parsed.host}</li>
            <li><strong>Service:</strong> {parsed.service}</li>
            <li><strong>PID:</strong> {parsed.pid}</li> {/* May be undefined unless parsed in regex */}
            <li>
              <strong>Severity:</strong> 
              <span className={`severity ${parsed.severity.toLowerCase()}`}>
                {parsed.severity}
              </span>
            </li>
            <li><strong>Message:</strong> {parsed.message}</li>
          </ul>
        </div>
      )}

      {/* Display recommended action section only if recommendation exists */}
      {recommendation && (
        <div className="section action">
          <h2>Recommended Action</h2>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default App; // Export component so it can be rendered in index.js
