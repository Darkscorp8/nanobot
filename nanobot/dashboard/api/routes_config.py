"""Configuration read/write routes."""

from __future__ import annotations

from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter()

_SECRET_FIELD_NAMES = {
    "api_key", "apiKey", "token", "secret", "password",
    "app_secret", "appSecret", "access_token", "accessToken",
    "auth_token", "authToken", "bot_token", "botToken",
    "app_token", "appToken", "client_secret", "clientSecret",
    "imap_password", "imapPassword", "smtp_password", "smtpPassword",
    "encrypt_key", "encryptKey", "verification_token", "verificationToken",
    "claw_token", "clawToken", "bridge_token", "bridgeToken",
}


def _mask_secrets(obj, key: str = ""):
    """Recursively mask API keys and secrets in a dict."""
    if isinstance(obj, dict):
        return {k: _mask_secrets(v, k) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_mask_secrets(i, key) for i in obj]
    if isinstance(obj, str) and len(obj) > 4 and key in _SECRET_FIELD_NAMES:
        return obj[:4] + "***"
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
