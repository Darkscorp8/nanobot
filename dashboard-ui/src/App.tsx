import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import routes from "./router";

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout dark={dark} onToggleDark={() => setDark((d) => !d)} />}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={<r.element />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
