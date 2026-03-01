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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        {streaming && (
          <div className="flex justify-start mb-2">
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl px-3.5 py-2.5 max-w-[75%] text-sm whitespace-pre-wrap opacity-80">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                Assistant
              </div>
              {streaming}
              <span className="animate-blink">▌</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 py-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
