import type { AgentStatus } from "../types";

const STATUS_DOT: Record<string, string> = {
  idle: "bg-green-500",
  working: "bg-amber-400",
  error: "bg-red-500",
};

export default function AgentStatusCard({ status }: { status: AgentStatus }) {
  const dotClass = STATUS_DOT[status.status] ?? "bg-slate-400";
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full inline-block ${dotClass}`} />
        <strong className="capitalize">{status.status}</strong>
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-300 leading-7">
        <div><b>Model:</b> {status.model}</div>
        <div><b>Provider:</b> {status.provider}</div>
        <div><b>Uptime:</b> {Math.round(status.uptime_seconds)}s</div>
        <div><b>Temperature:</b> {status.temperature}</div>
        <div><b>Max iterations:</b> {status.max_tool_iterations}</div>
      </div>
    </div>
  );
}
