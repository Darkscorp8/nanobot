import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1.5rem 2rem",
          background: "#f8fafc",
          color: "#1e293b",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
