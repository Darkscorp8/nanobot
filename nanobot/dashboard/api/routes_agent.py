"""Agent status and sub-agent routes."""

from __future__ import annotations

from fastapi import APIRouter, Request

from nanobot.dashboard.server import get_uptime

router = APIRouter()


@router.get("/status")
async def agent_status(request: Request):
    """Return the current agent status."""
    agent_loop = request.app.state.agent_loop
    config = request.app.state.config

    status = "idle"
    if agent_loop is not None:
        running = getattr(agent_loop, "_running", False)
        active_count = sum(
            len(tasks) for tasks in getattr(agent_loop, "_active_tasks", {}).values()
        )
        if active_count > 0:
            status = "working"
        elif running:
            status = "idle"

    return {
        "status": status,
        "model": config.agents.defaults.model,
        "provider": config.get_provider_name() or "unknown",
        "uptime_seconds": round(get_uptime(), 1),
        "max_tool_iterations": config.agents.defaults.max_tool_iterations,
        "temperature": config.agents.defaults.temperature,
    }


@router.get("/subagents")
async def list_subagents(request: Request):
    """Return list of running sub-agents."""
    agent_loop = request.app.state.agent_loop
    if agent_loop is None:
        return {"subagents": [], "total": 0}

    mgr = getattr(agent_loop, "subagents", None)
    if mgr is None:
        return {"subagents": [], "total": 0}

    running = []
    for task_id, task in list(mgr._running_tasks.items()):
        running.append({
            "id": task_id,
            "done": task.done(),
        })

    return {"subagents": running, "total": len(running)}
