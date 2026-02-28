import type { AgentStatus } from "../types";

const STATUS_COLORS: Record<string, string> = {
  idle: "#22c55e",
  working: "#f59e0b",
  error: "#ef4444",
};

export default function AgentStatusCard({ status }: { status: AgentStatus }) {
  const color = STATUS_COLORS[status.status] ?? "#94a3b8";
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "1.25rem",
        background: "#fff",
        maxWidth: 360,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
        />
        <strong style={{ textTransform: "capitalize" }}>{status.status}</strong>
      </div>
      <div style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.8 }}>
        <div><b>Model:</b> {status.model}</div>
        <div><b>Provider:</b> {status.provider}</div>
        <div><b>Uptime:</b> {Math.round(status.uptime_seconds)}s</div>
        <div><b>Temperature:</b> {status.temperature}</div>
        <div><b>Max iterations:</b> {status.max_tool_iterations}</div>
      </div>
    </div>
  );
}
