import type { ChatMessage } from "../types";

const ROLE_STYLES: Record<string, { bg: string; align: string; label: string }> = {
  user: { bg: "#dbeafe", align: "flex-end", label: "You" },
  assistant: { bg: "#f0fdf4", align: "flex-start", label: "Assistant" },
  tool: { bg: "#fef9c3", align: "flex-start", label: "Tool" },
  system: { bg: "#f1f5f9", align: "flex-start", label: "System" },
};

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const style = ROLE_STYLES[msg.role] ?? ROLE_STYLES.system;
  return (
    <div style={{ display: "flex", justifyContent: style.align, marginBottom: 8 }}>
      <div
        style={{
          background: style.bg,
          borderRadius: 10,
          padding: "0.6rem 0.9rem",
          maxWidth: "75%",
          fontSize: "0.88rem",
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748b", marginBottom: 2 }}>
          {style.label}
          {msg.name ? ` (${msg.name})` : ""}
        </div>
        {msg.content || <em style={{ color: "#94a3b8" }}>(no content)</em>}
        {msg.tool_calls && msg.tool_calls.length > 0 && (
          <pre style={{ fontSize: "0.75rem", marginTop: 4, color: "#475569" }}>
            {JSON.stringify(msg.tool_calls, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
