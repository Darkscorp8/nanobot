import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSessions } from "../hooks/useApi";
import type { SessionInfo } from "../types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSessions()
      .then((d) => setSessions(d.sessions))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sessions</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-left">
              <th className="px-3 py-2.5 text-sm font-semibold">Session Key</th>
              <th className="px-3 py-2.5 text-sm font-semibold">Created</th>
              <th className="px-3 py-2.5 text-sm font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.key} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-3 py-2.5">
                  <Link
                    to={`/sessions/${encodeURIComponent(s.key)}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline no-underline"
                  >
                    {s.key}
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                  {s.created_at ? new Date(s.created_at).toLocaleString() : "—"}
                </td>
                <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                  {s.updated_at ? new Date(s.updated_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-slate-400 text-center text-sm">
                  No sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
