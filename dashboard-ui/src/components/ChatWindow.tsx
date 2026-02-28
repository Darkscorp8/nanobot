import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  streaming?: string;
  disabled?: boolean;
}

export default function ChatWindow({ messages, onSend, streaming, disabled }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        {streaming && (
          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 10,
              padding: "0.6rem 0.9rem",
              fontSize: "0.88rem",
              whiteSpace: "pre-wrap",
              maxWidth: "75%",
              opacity: 0.8,
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748b", marginBottom: 2 }}>
              Assistant
            </div>
            {streaming}
            <span style={{ animation: "blink 1s steps(2) infinite" }}>▌</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0.5rem 0" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
          placeholder="Type a message…"
          style={{
            flex: 1,
            padding: "0.6rem 0.8rem",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: 8,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
