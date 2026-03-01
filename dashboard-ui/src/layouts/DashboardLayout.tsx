import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Moon, Sun } from "lucide-react";

interface Props {
  dark: boolean;
  onToggleDark: () => void;
}

export default function DashboardLayout({ dark, onToggleDark }: Props) {
  return (
    <div className="flex h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-end px-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <main className="flex-1 overflow-auto p-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
