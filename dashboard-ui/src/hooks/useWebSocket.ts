/** WebSocket hook for live chat. */

import { useCallback, useEffect, useRef, useState } from "react";
import type { WSMessage } from "../types";

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WSMessage[]>([]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}${url}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as WSMessage;
        setMessages((prev) => [...prev, msg]);
      } catch { /* ignore non-JSON */ }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const send = useCallback((message: string) => {
    wsRef.current?.send(JSON.stringify({ message }));
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { connected, messages, send, clearMessages };
}
