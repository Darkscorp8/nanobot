import { useEffect, useState } from "react";
import { getSubAgents } from "../hooks/useApi";
import SubAgentCard from "../components/SubAgentCard";
import type { SubAgent } from "../types";

export default function SubAgentsPage() {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = () =>
      getSubAgents()
        .then((d) => active && setAgents(d.subagents))
        .catch((e) => active && setError(String(e)));
    load();
    const id = setInterval(load, 3000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Sub-Agents</h2>
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {agents.map((a) => (
          <SubAgentCard key={a.id} agent={a} />
        ))}
        {agents.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No sub-agents running.</p>
        )}
      </div>
    </div>
  );
}
