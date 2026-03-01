/** SSE-based chat hook. Sends messages via POST and streams the response. */

import { useCallback, useRef, useState } from "react";
import type { WSMessage } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (message: string) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev,
          { type: "error", data: `HTTP ${res.status}: ${res.statusText}` },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        // Process complete SSE lines
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const msg = JSON.parse(line.slice(6)) as WSMessage;
              setMessages((prev) => [...prev, msg]);
            } catch { /* ignore malformed */ }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          { type: "error", data: String(err) },
        ]);
      }
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, send, clearMessages };
}
