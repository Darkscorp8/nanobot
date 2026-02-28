"""Session list and history routes."""

from __future__ import annotations

from fastapi import APIRouter, Request, HTTPException

router = APIRouter()


@router.get("")
async def list_sessions(request: Request):
    """Return all sessions (metadata only)."""
    sm = request.app.state.session_manager
    sessions = sm.list_sessions()
    return {"sessions": sessions, "total": len(sessions)}


@router.get("/{session_key:path}")
async def get_session(request: Request, session_key: str):
    """Return messages for a specific session."""
    sm = request.app.state.session_manager
    session = sm.get_or_create(session_key)
    if not session.messages:
        raise HTTPException(status_code=404, detail="Session not found or empty")
    messages = []
    for m in session.messages:
        messages.append({
            "role": m.get("role", ""),
            "content": m.get("content", ""),
            "timestamp": m.get("timestamp", ""),
            "tool_calls": m.get("tool_calls"),
            "tool_call_id": m.get("tool_call_id"),
            "name": m.get("name"),
        })
    return {
        "key": session.key,
        "created_at": session.created_at.isoformat(),
        "updated_at": session.updated_at.isoformat(),
        "message_count": len(messages),
        "messages": messages,
    }


@router.delete("/{session_key:path}")
async def clear_session(request: Request, session_key: str):
    """Clear all messages from a session."""
    sm = request.app.state.session_manager
    session = sm.get_or_create(session_key)
    session.clear()
    sm.save(session)
    return {"status": "cleared", "key": session_key}
