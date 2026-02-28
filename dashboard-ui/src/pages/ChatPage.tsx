import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import ChatWindow from "../components/ChatWindow";
import type { ChatMessage } from "../types";

export default function ChatPage() {
  const { connected, messages: wsMessages, send } = useWebSocket("/api/chat/ws");
  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState("");
  const prevLenRef = useRef(0);

  // Derive chat messages from WS stream, interleaving user inputs
  useEffect(() => {
    let assistant = "";
    for (let i = prevLenRef.current; i < wsMessages.length; i++) {
      const m = wsMessages[i];
      switch (m.type) {
        case "start":
          assistant = "";
          setStreaming("");
          break;
        case "text_delta":
        case "tool_hint":
          assistant += m.data + "\n";
          setStreaming(assistant);
          break;
        case "done":
        case "error":
          setStreaming("");
          break;
      }
    }
    prevLenRef.current = wsMessages.length;
  }, [wsMessages]);

  const assistantMessages = useMemo(() => {
    const out: ChatMessage[] = [];
    for (const m of wsMessages) {
      if (m.type === "done") {
        out.push({ role: "assistant", content: m.data });
      } else if (m.type === "error") {
        out.push({ role: "system", content: `Error: ${m.data}` });
      }
    }
    return out;
  }, [wsMessages]);

  // Interleave: user msg, then assistant reply, user msg, then assistant reply…
  const allMessages = useMemo(() => {
    const merged: ChatMessage[] = [];
    const maxLen = Math.max(userMessages.length, assistantMessages.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < userMessages.length) merged.push(userMessages[i]);
      if (i < assistantMessages.length) merged.push(assistantMessages[i]);
    }
    return merged;
  }, [userMessages, assistantMessages]);

  const handleSend = useCallback((text: string) => {
    setUserMessages((prev) => [...prev, { role: "user", content: text }]);
    send(text);
  }, [send]);

  return (
    <div style={{ height: "calc(100vh - 3rem)" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>
        Chat{" "}
        <span style={{ fontSize: "0.75rem", color: connected ? "#22c55e" : "#ef4444" }}>
          {connected ? "● Connected" : "● Disconnected"}
        </span>
      </h2>
      <ChatWindow
        messages={allMessages}
        onSend={handleSend}
        streaming={streaming}
        disabled={!connected}
      />
    </div>
  );
}
