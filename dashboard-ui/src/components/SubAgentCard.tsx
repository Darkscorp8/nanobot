import type { SubAgent } from "../types";

export default function SubAgentCard({ agent }: { agent: SubAgent }) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 flex items-center gap-2.5">
      <span
        className={`w-2 h-2 rounded-full inline-block ${agent.done ? "bg-slate-400" : "bg-green-500"}`}
      />
      <code className="text-sm">{agent.id}</code>
      <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
        {agent.done ? "completed" : "running"}
      </span>
    </div>
  );
}
