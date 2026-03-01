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
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/sessions")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer text-base"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold m-0">Session: {key}</h2>
        <button
          onClick={handleClear}
          className="ml-auto px-3 py-1.5 rounded-md border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer text-xs transition-colors"
        >
          Clear
        </button>
      </div>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 max-h-[70vh] overflow-y-auto">
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        {messages.length === 0 && (
          <p className="text-slate-400 text-center text-sm">No messages.</p>
        )}
      </div>
    </div>
  );
}
