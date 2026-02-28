import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import routes from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={<r.element />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
