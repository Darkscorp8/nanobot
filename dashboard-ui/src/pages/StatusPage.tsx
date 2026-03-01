import { useEffect, useState } from "react";
import { getAgentStatus } from "../hooks/useApi";
import AgentStatusCard from "../components/AgentStatusCard";
import type { AgentStatus } from "../types";

export default function StatusPage() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = () =>
      getAgentStatus()
        .then((s) => active && setStatus(s))
        .catch((e) => active && setError(String(e)));
    load();
    const id = setInterval(load, 5000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {status ? <AgentStatusCard status={status} /> : <p className="text-slate-400">Loading…</p>}
    </div>
  );
}
