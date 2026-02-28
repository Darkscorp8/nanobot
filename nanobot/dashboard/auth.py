"""Simple bearer-token authentication middleware."""

from __future__ import annotations

from typing import Callable

from loguru import logger


def add_auth_middleware(app, auth_token: str) -> None:
    """Attach token-based auth middleware when *auth_token* is non-empty."""
    if not auth_token:
        logger.debug("Dashboard auth token not set — skipping auth middleware")
        return

    try:
        from starlette.middleware.base import BaseHTTPMiddleware
        from starlette.requests import Request
        from starlette.responses import JSONResponse
    except ImportError:
        return

    class _TokenAuth(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next: Callable):
            # Allow WebSocket upgrades to pass (handled per-connection)
            if request.url.path.startswith("/api/"):
                token = request.headers.get("Authorization", "")
                if token != f"Bearer {auth_token}":
                    return JSONResponse({"detail": "Unauthorized"}, status_code=401)
            return await call_next(request)

    app.add_middleware(_TokenAuth)
