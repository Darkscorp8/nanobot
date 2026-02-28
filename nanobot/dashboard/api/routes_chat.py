"""WebSocket chat route for live interaction from the dashboard."""

from __future__ import annotations

import json

from loguru import logger

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws")
async def chat_websocket(ws: WebSocket):
    """Accept a WebSocket connection and relay messages to the agent loop."""
    await ws.accept()
    agent_loop = ws.app.state.agent_loop

    if agent_loop is None:
        await ws.send_json({"type": "error", "data": "Agent loop not available"})
        await ws.close()
        return

    session_key = "dashboard:web"

    async def _on_progress(content: str, *, tool_hint: bool = False) -> None:
        try:
            msg_type = "tool_hint" if tool_hint else "text_delta"
            await ws.send_json({"type": msg_type, "data": content})
        except Exception:
            pass

    try:
        while True:
            raw = await ws.receive_text()
            try:
                payload = json.loads(raw)
                user_message = payload.get("message", raw)
            except (json.JSONDecodeError, TypeError):
                user_message = raw

            await ws.send_json({"type": "start", "data": ""})

            try:
                response = await agent_loop.process_direct(
                    user_message,
                    session_key=session_key,
                    on_progress=_on_progress,
                )
                await ws.send_json({"type": "done", "data": response or ""})
            except Exception as exc:
                logger.exception("Dashboard chat error")
                await ws.send_json({"type": "error", "data": str(exc)})
    except WebSocketDisconnect:
        logger.debug("Dashboard WS client disconnected")
    except Exception:
        logger.exception("Dashboard WS unexpected error")
