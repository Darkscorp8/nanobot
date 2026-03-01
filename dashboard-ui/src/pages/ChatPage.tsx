import { useCallback, useMemo, useState } from "react";
import { useChat } from "../hooks/useChat";
import ChatWindow from "../components/ChatWindow";
import type { ChatMessage } from "../types";

export default function ChatPage() {
  const { messages: sseMessages, send } = useChat();
  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);

  // Derive streaming text and completed assistant messages from SSE events
  const { streaming, assistantMessages } = useMemo(() => {
    let streamingText = "";
    const completed: ChatMessage[] = [];

    for (const m of sseMessages) {
      switch (m.type) {
        case "start":
          streamingText = "";
          break;
        case "text_delta":
        case "tool_hint":
          streamingText += m.data + "\n";
          break;
        case "done":
          streamingText = "";
          completed.push({ role: "assistant", content: m.data });
          break;
        case "error":
          streamingText = "";
          completed.push({ role: "system", content: `Error: ${m.data}` });
          break;
      }
    }
    return { streaming: streamingText, assistantMessages: completed };
  }, [sseMessages]);

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

  const handleSend = useCallback(
    (text: string) => {
      setUserMessages((prev) => [...prev, { role: "user", content: text }]);
      void send(text);
    },
    [send],
  );

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Chat</h2>
      <ChatWindow
        messages={allMessages}
        onSend={handleSend}
        streaming={streaming}
        disabled={streaming.length > 0}
      />
    </div>
  );
}
