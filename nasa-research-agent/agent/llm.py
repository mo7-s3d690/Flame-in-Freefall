"""OpenAI-compatible LLM client (works with OpenRouter, DeepSeek, and others)."""

from __future__ import annotations

import json
import logging
import os
from types import SimpleNamespace
from typing import Any

import httpx

logger = logging.getLogger(__name__)


class _FunctionCall:
    def __init__(self, name: str, arguments: Any) -> None:
        self.name = name
        self.arguments = arguments if isinstance(arguments, str) else json.dumps(arguments or {})


class _ToolCall:
    def __init__(self, tool_id: str, function: _FunctionCall) -> None:
        self.id = tool_id
        self.function = function


class _Message:
    def __init__(self, content: Any, tool_calls: list[_ToolCall] | None) -> None:
        self.content = content
        self.tool_calls = tool_calls


class _Choice:
    def __init__(self, message: _Message) -> None:
        self.message = message


class _Response:
    def __init__(self, data: dict[str, Any]) -> None:
        choice = (data.get("choices") or [{}])[0]
        message = choice.get("message", {}) or {}
        tool_calls = None
        raw_calls = message.get("tool_calls")
        if raw_calls:
            tool_calls = []
            for call in raw_calls:
                function = call.get("function", {}) or {}
                tool_calls.append(
                    _ToolCall(
                        tool_id=call.get("id", ""),
                        function=_FunctionCall(
                            name=function.get("name", ""),
                            arguments=function.get("arguments", "{}"),
                        ),
                    )
                )
        self.choices = [_Choice(_Message(message.get("content"), tool_calls))]


class LLMClient:
    """Minimal OpenAI-compatible chat client using httpx."""

    def __init__(
        self,
        api_key: str,
        model: str,
        base_url: str | None = None,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.base_url = (base_url or os.getenv("API_BASE_URL", "https://openrouter.ai/api/v1")).rstrip("/")
        self.chat = self

    def _headers(self) -> dict[str, str]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        # OpenRouter recommends these for ranking/analytics (optional).
        referer = os.getenv("OPENROUTER_REFERER")
        title = os.getenv("OPENROUTER_TITLE")
        if referer:
            headers["HTTP-Referer"] = referer
        if title:
            headers["X-Title"] = title
        return headers

    def _build_body(
        self,
        model: str | None,
        messages: list[dict[str, Any]] | None,
        tools: list[dict[str, Any]] | None,
        tool_choice: Any,
        temperature: float | None,
        response_format: Any,
        **kwargs: Any,
    ) -> dict[str, Any]:
        body: dict[str, Any] = {
            "model": model or self.model,
            "messages": messages or [],
        }
        if temperature is not None:
            body["temperature"] = temperature
        if tools:
            body["tools"] = tools
            body["tool_choice"] = tool_choice or "auto"
        if response_format:
            body["response_format"] = response_format
        # Pass through a few common optional fields.
        for key in ("top_p", "max_tokens", "stop", "seed"):
            if key in kwargs and kwargs[key] is not None:
                body[key] = kwargs[key]
        return body

    def complete(
        self,
        *,
        model: str | None = None,
        messages: list[dict[str, Any]] | None = None,
        tools: list[dict[str, Any]] | None = None,
        tool_choice: Any = None,
        temperature: float | None = 0.2,
        response_format: Any = None,
        **kwargs: Any,
    ) -> _Response:
        body = self._build_body(model, messages, tools, tool_choice, temperature, response_format, **kwargs)
        with httpx.Client(timeout=120) as client:
            response = client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json=body,
            )
            response.raise_for_status()
            return _Response(response.json())

    async def complete_async(
        self,
        *,
        model: str | None = None,
        messages: list[dict[str, Any]] | None = None,
        tools: list[dict[str, Any]] | None = None,
        tool_choice: Any = None,
        temperature: float | None = 0.2,
        response_format: Any = None,
        **kwargs: Any,
    ) -> _Response:
        body = self._build_body(model, messages, tools, tool_choice, temperature, response_format, **kwargs)
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json=body,
            )
            response.raise_for_status()
            return _Response(response.json())
