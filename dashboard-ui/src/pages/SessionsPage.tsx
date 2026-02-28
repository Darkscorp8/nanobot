import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSessions } from "../hooks/useApi";
import type { SessionInfo } from "../types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSessions()
      .then((d) => setSessions(d.sessions))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Sessions</h2>
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      <table
        style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8 }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
            <th style={{ padding: "0.6rem" }}>Session Key</th>
            <th style={{ padding: "0.6rem" }}>Created</th>
            <th style={{ padding: "0.6rem" }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "0.6rem" }}>
                <Link
                  to={`/sessions/${encodeURIComponent(s.key)}`}
                  style={{ color: "#4f46e5", textDecoration: "none" }}
                >
                  {s.key}
                </Link>
              </td>
              <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#64748b" }}>
                {s.created_at ? new Date(s.created_at).toLocaleString() : "—"}
              </td>
              <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#64748b" }}>
                {s.updated_at ? new Date(s.updated_at).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: "1rem", color: "#94a3b8", textAlign: "center" }}>
                No sessions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
