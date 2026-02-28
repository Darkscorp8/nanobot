/** REST API helpers. */

const BASE = "/api";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export function getAgentStatus() {
  return fetchJSON<import("../types").AgentStatus>("/agent/status");
}

export function getSubAgents() {
  return fetchJSON<{ subagents: import("../types").SubAgent[]; total: number }>("/agent/subagents");
}

export function getSessions() {
  return fetchJSON<{ sessions: import("../types").SessionInfo[]; total: number }>("/sessions");
}

export function getSession(key: string) {
  return fetchJSON<import("../types").SessionDetail>(`/sessions/${encodeURIComponent(key)}`);
}

export function deleteSession(key: string) {
  return fetchJSON<{ status: string }>(`/sessions/${encodeURIComponent(key)}`, { method: "DELETE" });
}

export function getConfig() {
  return fetchJSON<Record<string, unknown>>("/config");
}

export function patchConfig(patch: Record<string, unknown>) {
  return fetchJSON<{ status: string; changed: string[] }>("/config", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
