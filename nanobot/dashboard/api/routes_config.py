"""Configuration read/write routes."""

from __future__ import annotations

import re

from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter()

_SECRET_RE = re.compile(
    r"(sk-|xoxb-|xapp-|Bearer |token |secret |password )"
    r"[A-Za-z0-9_\-]{4}([A-Za-z0-9_\-]+)",
    re.IGNORECASE,
)


def _mask_secrets(obj):
    """Recursively mask API keys and secrets in a dict."""
    if isinstance(obj, dict):
        return {k: _mask_secrets(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_mask_secrets(i) for i in obj]
    if isinstance(obj, str) and len(obj) > 8:
        if _SECRET_RE.search(obj):
            return obj[:8] + "***"
    return obj


class ConfigPatch(BaseModel):
    """Partial config update (safe fields only)."""

    model: str | None = None
    temperature: float | None = None
    max_tokens: int | None = None
    memory_window: int | None = None


@router.get("")
async def get_config(request: Request):
    """Return current configuration with secrets masked."""
    config = request.app.state.config
    data = config.model_dump(by_alias=True)
    return _mask_secrets(data)


@router.patch("")
async def patch_config(request: Request, patch: ConfigPatch):
    """Update safe configuration fields and persist to disk."""
    from nanobot.config.loader import load_config, save_config

    config = load_config()
    changed = []
    if patch.model is not None:
        config.agents.defaults.model = patch.model
        changed.append("model")
    if patch.temperature is not None:
        config.agents.defaults.temperature = patch.temperature
        changed.append("temperature")
    if patch.max_tokens is not None:
        config.agents.defaults.max_tokens = patch.max_tokens
        changed.append("max_tokens")
    if patch.memory_window is not None:
        config.agents.defaults.memory_window = patch.memory_window
        changed.append("memory_window")

    if changed:
        save_config(config)
        # Update in-memory config reference
        request.app.state.config = config

    return {"status": "ok", "changed": changed}
