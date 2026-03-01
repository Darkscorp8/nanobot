import { useEffect, useState } from "react";
import { getConfig, patchConfig } from "../hooks/useApi";

export default function SettingsPage() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Editable fields
  const [model, setModel] = useState("");
  const [temperature, setTemperature] = useState("0.1");
  const [maxTokens, setMaxTokens] = useState("8192");
  const [memoryWindow, setMemoryWindow] = useState("100");

  useEffect(() => {
    getConfig()
      .then((c) => {
        setConfig(c);
        const agents = c.agents as Record<string, unknown> | undefined;
        const defaults = agents?.defaults as Record<string, unknown> | undefined;
        if (defaults) {
          setModel(String(defaults.model ?? ""));
          setTemperature(String(defaults.temperature ?? "0.1"));
          setMaxTokens(String(defaults.maxTokens ?? "8192"));
          setMemoryWindow(String(defaults.memoryWindow ?? "100"));
        }
      })
      .catch((e) => setError(String(e)));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await patchConfig({
        model: model || undefined,
        temperature: parseFloat(temperature),
        max_tokens: parseInt(maxTokens, 10),
        memory_window: parseInt(memoryWindow, 10),
      });
      setSavedMsg(`Saved: ${res.changed.join(", ")}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <p className="text-slate-400">Loading configuration…</p>;

  const inputClass =
    "w-full px-2.5 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {savedMsg && <p className="text-green-500 mb-3">{savedMsg}</p>}

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 max-w-lg flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <b>Model</b>
          <input value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <b>Temperature</b>
          <input
            type="number"
            step="0.05"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <b>Max Tokens</b>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <b>Memory Window</b>
          <input
            type="number"
            value={memoryWindow}
            onChange={(e) => setMemoryWindow(e.target.value)}
            className={inputClass}
          />
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving…" : "Save & Reload"}
        </button>
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer font-semibold">Full Config (read-only, masked)</summary>
        <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-auto text-xs max-h-96 mt-2">
          {JSON.stringify(config, null, 2)}
        </pre>
      </details>
    </div>
  );
}
