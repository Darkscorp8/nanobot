/** Shared TypeScript types for the dashboard. */

export interface AgentStatus {
  status: "idle" | "working" | "error";
  model: string;
  provider: string;
  uptime_seconds: number;
  max_tool_iterations: number;
  temperature: number;
}

export interface SubAgent {
  id: string;
  done: boolean;
}

export interface SessionInfo {
  key: string;
  created_at: string;
  updated_at: string;
  path?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp?: string;
  tool_calls?: Record<string, unknown>[];
  tool_call_id?: string;
  name?: string;
}

export interface SessionDetail {
  key: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  messages: ChatMessage[];
}

export interface WSMessage {
  type: "start" | "text_delta" | "tool_hint" | "done" | "error";
  data: string;
}
