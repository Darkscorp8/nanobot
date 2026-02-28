import { NavLink } from "react-router-dom";
import routes from "../router";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        background: "#111827",
        color: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        padding: "1rem 0",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 1rem 1rem", fontWeight: 700, fontSize: "1.15rem" }}>
        🐈 Nanobot
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {routes
          .filter((r) => !r.hidden)
          .map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              end={r.path === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.55rem 1rem",
                color: isActive ? "#818cf8" : "#d1d5db",
                background: isActive ? "#1e293b" : "transparent",
                textDecoration: "none",
                fontSize: "0.9rem",
                borderLeft: isActive ? "3px solid #818cf8" : "3px solid transparent",
              })}
            >
              <r.icon size={18} />
              {r.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
