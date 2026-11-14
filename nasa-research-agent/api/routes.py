"""Chat API routes."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from agent.main import AgentError, AgentNotReady, run_agent
from api.schemas import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Answer a user message through the shared research agent."""
    logger.info("Chat request (conversation=%s)", request.conversation_id or "new")

    try:
        result = await run_agent(request.message, request.conversation_id)
    except AgentNotReady as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except AgentError as exc:
        logger.warning("Agent error: %s", type(exc).__name__)
        raise HTTPException(
            status_code=502,
            detail="The research agent is temporarily unavailable.",
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected chat error")
        raise HTTPException(status_code=500, detail="Unexpected server error.") from exc

    return ChatResponse(**result)
