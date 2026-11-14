"""Turn complex questions into focused BM25 search queries using Mistral."""

from __future__ import annotations

import json
import logging
import os
from typing import Any

logger = logging.getLogger(__name__)

DEFAULT_MODEL = "mistral-small-latest"

DECOMPOSITION_PROMPT = """You are a query decomposition component for a NASA research retrieval system.

The research documents are written in English. The user's question may be in any
language (including Arabic).

First, translate the question into English if it is not already in English.
Then determine whether decomposition is needed.

If the question is simple and asks about one subject, return the English translation as a single query.
If the question contains multiple aspects, break it into 2-4 independent, focused English search queries.

Each query must preserve the original intent and contain meaningful English search terms.
Do not answer the question.
Do not invent facts.
Do not add unrelated topics.
Avoid duplicate queries.
Return valid JSON only, with exactly these keys:
{"requires_decomposition": true|false, "queries": ["query 1", "query 2"]}
"""


def _env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def _content_text(content: Any) -> str:
    """Normalize Mistral message content to plain text."""
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                parts.append(str(item.get("text", "")))
            else:
                parts.append(str(getattr(item, "text", "")))
        return "".join(parts)
    return str(content)


def _strip_code_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines:
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return text


def _create_client() -> Any | None:
    api_key = os.getenv("API_KEY")
    if not api_key:
        logger.warning("API_KEY is not configured; query decomposition will use the original question.")
        return None
    try:
        from agent.llm import LLMClient

        return LLMClient(
            api_key=api_key,
            model=os.getenv("MODEL_NAME", DEFAULT_MODEL),
            base_url=os.getenv("API_BASE_URL"),
        )
    except Exception as exc:  # pragma: no cover - depends on the installed SDK
        logger.warning("Could not create the LLM client for decomposition: %s", exc)
        return None


def _validated_queries(payload: Any, question: str, max_queries: int) -> list[str]:
    if not isinstance(payload, dict):
        return [question]

    queries = payload.get("queries")
    if not isinstance(queries, list):
        return [question]

    clean: list[str] = []
    seen: set[str] = set()
    for query in queries:
        if not isinstance(query, str):
            continue
        query = " ".join(query.split()).strip()
        if not query or query.lower() in seen:
            continue
        clean.append(query)
        seen.add(query.lower())
        if len(clean) >= max_queries:
            break

    if not clean:
        return [question]

    # The model's flag is authoritative: a "simple" answer must not be split.
    if payload.get("requires_decomposition") is False:
        return [question]

    if len(clean) < 2:
        return [question]

    return clean


def decompose_query(
    question: str,
    *,
    client: Any | None = None,
    model: str | None = None,
    enabled: bool | None = None,
    max_queries: int | None = None,
) -> list[str]:
    """Return one or more search queries for ``question``.

    Decomposition is optional. Greetings and simple questions fall back to the
    original question, and any Mistral or parsing failure also falls back
    instead of blocking retrieval.
    """
    question = " ".join((question or "").split()).strip()
    if not question:
        return []

    if enabled is None:
        enabled = _env_bool("ENABLE_QUERY_DECOMPOSITION", True)
    if not enabled:
        return [question]

    model = model or os.getenv("MODEL_NAME", DEFAULT_MODEL)
    max_queries = max_queries or _env_int("MAX_DECOMPOSITION_QUERIES", 4)
    max_queries = max(2, min(4, max_queries))

    if client is None:
        client = _create_client()
    if client is None:
        return [question]

    try:
        response = client.chat.complete(
            model=model,
            messages=[
                {"role": "system", "content": DECOMPOSITION_PROMPT},
                {"role": "user", "content": question},
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
        content = _content_text(response.choices[0].message.content)
        payload = json.loads(_strip_code_fence(content))
        return _validated_queries(payload, question, max_queries)
    except Exception as exc:
        logger.warning(
            "Query decomposition failed (%s); falling back to the original question.",
            type(exc).__name__,
        )
        return [question]
