import { NavLink } from "react-router-dom";
import routes from "../router";

export default function Sidebar() {
  return (
    <aside className="w-52 bg-gray-900 dark:bg-gray-950 text-gray-100 flex flex-col py-4 shrink-0">
      <div className="px-4 pb-4 font-bold text-lg">🐈 Nanobot</div>
      <nav className="flex flex-col gap-0.5">
        {routes
          .filter((r) => !r.hidden)
          .map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              end={r.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2 text-sm no-underline transition-colors border-l-[3px] ${
                  isActive
                    ? "text-indigo-400 bg-slate-800 border-indigo-400"
                    : "text-gray-300 hover:text-white hover:bg-slate-800 border-transparent"
                }`
              }
            >
              <r.icon size={18} />
              {r.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
