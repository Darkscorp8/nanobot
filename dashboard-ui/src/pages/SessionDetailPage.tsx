import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSession, deleteSession } from "../hooks/useApi";
import MessageBubble from "../components/MessageBubble";
import type { ChatMessage } from "../types";

export default function SessionDetailPage() {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!key) return;
    getSession(key)
      .then((d) => setMessages(d.messages))
      .catch((e) => setError(String(e)));
  }, [key]);

  const handleClear = async () => {
    if (!key) return;
    if (!confirm("Clear this session?")) return;
    await deleteSession(key);
    navigate("/sessions");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
        <button onClick={() => navigate("/sessions")} style={{ cursor: "pointer", background: "none", border: "none", fontSize: "1rem" }}>
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>Session: {key}</h2>
        <button
          onClick={handleClear}
          style={{
            marginLeft: "auto",
            padding: "0.4rem 0.8rem",
            borderRadius: 6,
            border: "1px solid #fca5a5",
            color: "#ef4444",
            background: "#fff",
            cursor: "pointer",
            fontSize: "0.82rem",
          }}
        >
          Clear
        </button>
      </div>
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "1rem",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        {messages.length === 0 && (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>No messages.</p>
        )}
      </div>
    </div>
  );
}
