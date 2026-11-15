"""Pydantic request and response schemas for the chat API."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ChatRequest(BaseModel):
    """One user message."""

    model_config = ConfigDict(extra="ignore")

    message: str = Field(min_length=1, max_length=8000)
    conversation_id: str | None = Field(default=None, max_length=100)

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("message must not be blank")
        return value

    @field_validator("conversation_id")
    @classmethod
    def normalize_conversation_id(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class SourceRef(BaseModel):
    """A citation pointing at one research investigation."""

    research_id: str
    source: str | None = None
    chunk_index: int | None = Field(default=None, ge=0)


class ChatResponse(BaseModel):
    """The agent's answer and its evidence references."""

    answer: str
    sources: list[SourceRef] = Field(default_factory=list)
    used_rag: bool
    conversation_id: str
