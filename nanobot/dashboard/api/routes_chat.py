"""SSE chat route for live interaction from the dashboard."""

from __future__ import annotations

import asyncio
import json

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from loguru import logger
from pydantic import BaseModel

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/send")
async def chat_send(request: Request, body: ChatRequest):
    """Accept a chat message and stream the agent response as SSE."""
    agent_loop = request.app.state.agent_loop

    if agent_loop is None:
        async def _error():
            yield f"data: {json.dumps({'type': 'error', 'data': 'Agent loop not available'})}\n\n"
        return StreamingResponse(_error(), media_type="text/event-stream")

    session_key = "dashboard:web"
    queue: asyncio.Queue[dict | None] = asyncio.Queue()

    async def _on_progress(content: str, *, tool_hint: bool = False) -> None:
        msg_type = "tool_hint" if tool_hint else "text_delta"
        await queue.put({"type": msg_type, "data": content})

    async def _process() -> None:
        try:
            response = await agent_loop.process_direct(
                body.message,
                session_key=session_key,
                on_progress=_on_progress,
            )
            await queue.put({"type": "done", "data": response or ""})
        except Exception as exc:
            logger.exception("Dashboard chat error")
            await queue.put({"type": "error", "data": str(exc)})
        finally:
            await queue.put(None)

    async def event_stream():
        yield f"data: {json.dumps({'type': 'start', 'data': ''})}\n\n"
        task = asyncio.create_task(_process())
        try:
            while True:
                item = await queue.get()
                if item is None:
                    break
                yield f"data: {json.dumps(item)}\n\n"
        finally:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    return StreamingResponse(event_stream(), media_type="text/event-stream")
