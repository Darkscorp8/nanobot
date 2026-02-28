/** Centralised route table — add a page in one line. */

import {
  Activity,
  MessageSquare,
  Bot,
  Send,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";

import StatusPage from "./pages/StatusPage";
import SessionsPage from "./pages/SessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import SubAgentsPage from "./pages/SubAgentsPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";

export interface RouteEntry {
  path: string;
  element: ComponentType;
  icon: ComponentType<{ size?: number }>;
  label: string;
  /** Hide from sidebar (e.g. detail pages). */
  hidden?: boolean;
}

const routes: RouteEntry[] = [
  { path: "/", element: StatusPage, icon: Activity, label: "Status" },
  { path: "/sessions", element: SessionsPage, icon: MessageSquare, label: "Sessions" },
  { path: "/sessions/:key", element: SessionDetailPage, icon: MessageSquare, label: "Session", hidden: true },
  { path: "/subagents", element: SubAgentsPage, icon: Bot, label: "Sub-Agents" },
  { path: "/chat", element: ChatPage, icon: Send, label: "Chat" },
  { path: "/settings", element: SettingsPage, icon: Settings, label: "Settings" },
];

export default routes;
