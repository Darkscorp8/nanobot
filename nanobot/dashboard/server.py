"""FastAPI application for the nanobot web dashboard."""

from __future__ import annotations

import time
from pathlib import Path
from typing import TYPE_CHECKING

from loguru import logger

if TYPE_CHECKING:
    from nanobot.agent.loop import AgentLoop
    from nanobot.config.schema import Config
    from nanobot.session.manager import SessionManager


_START_TIME: float = 0.0


def get_uptime() -> float:
    """Return seconds since the dashboard was started."""
    return time.time() - _START_TIME


def create_dashboard_app(
    config: Config,
    session_manager: SessionManager,
    agent_loop: AgentLoop | None = None,
):
    """Create and configure the FastAPI dashboard application.

    All imports from ``fastapi`` are deferred so the module can be imported
    even when the ``dashboard`` extra is not installed.
    """
    try:
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        from fastapi.staticfiles import StaticFiles
    except ImportError as exc:
        raise RuntimeError(
            "Dashboard dependencies are not installed. "
            "Install them with: pip install nanobot-ai[dashboard]"
        ) from exc

    global _START_TIME
    _START_TIME = time.time()

    app = FastAPI(title="Nanobot Dashboard", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Store references for use in route handlers
    app.state.config = config
    app.state.session_manager = session_manager
    app.state.agent_loop = agent_loop

    # --- Auth middleware (simple bearer token) ---
    from nanobot.dashboard.auth import add_auth_middleware

    add_auth_middleware(app, config.dashboard.auth_token)

    # --- API routes ---
    from nanobot.dashboard.api.routes_agent import router as agent_router
    from nanobot.dashboard.api.routes_chat import router as chat_router
    from nanobot.dashboard.api.routes_config import router as config_router
    from nanobot.dashboard.api.routes_sessions import router as sessions_router

    app.include_router(agent_router, prefix="/api/agent", tags=["agent"])
    app.include_router(sessions_router, prefix="/api/sessions", tags=["sessions"])
    app.include_router(config_router, prefix="/api/config", tags=["config"])
    app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

    # --- Static files (built React frontend) ---
    static_dir = Path(__file__).parent / "static"
    if static_dir.is_dir() and any(static_dir.iterdir()):
        app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")

    logger.info("Dashboard app created")
    return app


async def start_dashboard(app, host: str, port: int) -> None:
    """Run the dashboard inside an existing asyncio event loop."""
    try:
        import uvicorn
    except ImportError as exc:
        raise RuntimeError(
            "Dashboard dependencies are not installed. "
            "Install them with: pip install nanobot-ai[dashboard]"
        ) from exc

    config = uvicorn.Config(app, host=host, port=port, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()
