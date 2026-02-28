import type { SubAgent } from "../types";

export default function SubAgentCard({ agent }: { agent: SubAgent }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "0.75rem 1rem",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: agent.done ? "#94a3b8" : "#22c55e",
          display: "inline-block",
        }}
      />
      <code style={{ fontSize: "0.85rem" }}>{agent.id}</code>
      <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#64748b" }}>
        {agent.done ? "completed" : "running"}
      </span>
    </div>
  );
}
