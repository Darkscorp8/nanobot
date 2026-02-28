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

  if (!config) return <p>Loading configuration…</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Settings</h2>
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      {savedMsg && <p style={{ color: "#22c55e" }}>{savedMsg}</p>}

      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "1.25rem",
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.88rem" }}>
          <b>Model</b>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ padding: "0.45rem 0.6rem", borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.88rem" }}>
          <b>Temperature</b>
          <input
            type="number"
            step="0.05"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            style={{ padding: "0.45rem 0.6rem", borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.88rem" }}>
          <b>Max Tokens</b>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
            style={{ padding: "0.45rem 0.6rem", borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.88rem" }}>
          <b>Memory Window</b>
          <input
            type="number"
            value={memoryWindow}
            onChange={(e) => setMemoryWindow(e.target.value)}
            style={{ padding: "0.45rem 0.6rem", borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.55rem 1rem",
            borderRadius: 8,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.9rem",
            alignSelf: "flex-start",
          }}
        >
          {saving ? "Saving…" : "Save & Reload"}
        </button>
      </div>

      <details style={{ marginTop: "1.5rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Full Config (read-only, masked)</summary>
        <pre
          style={{
            background: "#1e293b",
            color: "#e2e8f0",
            padding: "1rem",
            borderRadius: 8,
            overflow: "auto",
            fontSize: "0.78rem",
            maxHeight: 400,
            marginTop: "0.5rem",
          }}
        >
          {JSON.stringify(config, null, 2)}
        </pre>
      </details>
    </div>
  );
}
