import type { ChatMessage } from "../types";

const ROLE_CLASSES: Record<string, { bubble: string; align: string; label: string }> = {
  user: {
    bubble: "bg-blue-100 dark:bg-blue-900/40",
    align: "justify-end",
    label: "You",
  },
  assistant: {
    bubble: "bg-green-50 dark:bg-green-900/30",
    align: "justify-start",
    label: "Assistant",
  },
  tool: {
    bubble: "bg-yellow-50 dark:bg-yellow-900/30",
    align: "justify-start",
    label: "Tool",
  },
  system: {
    bubble: "bg-slate-100 dark:bg-slate-700/50",
    align: "justify-start",
    label: "System",
  },
};

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const style = ROLE_CLASSES[msg.role] ?? ROLE_CLASSES.system;
  return (
    <div className={`flex ${style.align} mb-2`}>
      <div
        className={`${style.bubble} rounded-xl px-3.5 py-2.5 max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap break-words`}
      >
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
          {style.label}
          {msg.name ? ` (${msg.name})` : ""}
        </div>
        {msg.content || <em className="text-slate-400">{"(no content)"}</em>}
        {msg.tool_calls && msg.tool_calls.length > 0 && (
          <pre className="text-xs mt-1 text-slate-600 dark:text-slate-300">
            {JSON.stringify(msg.tool_calls, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
