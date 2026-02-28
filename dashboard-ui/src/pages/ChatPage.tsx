import { useMemo, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import ChatWindow from "../components/ChatWindow";
import type { ChatMessage } from "../types";

export default function ChatPage() {
  const { connected, messages: wsMessages, send } = useWebSocket("/api/chat/ws");
  const [streaming, setStreaming] = useState("");

  const chatMessages = useMemo(() => {
    const out: ChatMessage[] = [];
    let currentAssistant = "";

    for (const m of wsMessages) {
      switch (m.type) {
        case "start":
          currentAssistant = "";
          setStreaming("");
          break;
        case "text_delta":
        case "tool_hint":
          currentAssistant += m.data + "\n";
          setStreaming(currentAssistant);
          break;
        case "done":
          setStreaming("");
          currentAssistant = "";
          out.push({ role: "assistant", content: m.data });
          break;
        case "error":
          setStreaming("");
          currentAssistant = "";
          out.push({ role: "system", content: `Error: ${m.data}` });
          break;
      }
    }
    return out;
  }, [wsMessages]);

  const handleSend = (text: string) => {
    // The WS messages list already contains all state, so we just append
    // user messages locally. The server will echo back the response.
    wsMessages.push({ type: "done", data: "" }); // no-op marker
    chatMessages.push({ role: "user", content: text });
    send(text);
  };

  // Combine user messages (local) with WS responses
  const allMessages = useMemo(() => {
    return chatMessages;
  }, [chatMessages]);

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
