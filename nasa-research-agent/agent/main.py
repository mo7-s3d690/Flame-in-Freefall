"""Mistral agent orchestration with MCP research tools."""

from __future__ import annotations

import json
import logging
import os
import uuid
from typing import Any

from agent.prompts import SYSTEM_PROMPT
from rag.database import derive_research_id

logger = logging.getLogger(__name__)

DEFAULT_MODEL = "mistral-small-latest"
DEFAULT_MAX_TOOL_ROUNDS = 4
MAX_HISTORY_MESSAGES = 12
MAX_CONVERSATIONS = 500


class AgentError(RuntimeError):
    """Raised when the agent cannot complete a request."""


class AgentNotReady(AgentError):
    """Raised when the shared runtime or API key is missing."""


_conversations: dict[str, list[dict[str, str]]] = {}
_runtime: "AgentRuntime | None" = None


def _content_text(content: Any) -> str:
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                parts.append(str(item.get("text", "")))
            else:
                parts.append(str(getattr(item, "text", "")))
        return "".join(parts)
    return str(content)


def _parse_arguments(arguments: Any) -> dict[str, Any]:
    if isinstance(arguments, dict):
        return arguments
    if isinstance(arguments, str) and arguments.strip():
        try:
            parsed = json.loads(arguments)
            return parsed if isinstance(parsed, dict) else {}
        except json.JSONDecodeError:
            logger.warning("Mistral returned invalid tool arguments; using an empty object.")
    return {}


def _assistant_tool_message(message: Any, tool_calls: list[Any]) -> dict[str, Any]:
    calls = []
    for position, tool_call in enumerate(tool_calls):
        function = getattr(tool_call, "function", None)
        arguments = getattr(function, "arguments", None)
        if not isinstance(arguments, str):
            arguments = json.dumps(arguments or {})
        calls.append(
            {
                "id": getattr(tool_call, "id", None) or f"call_{position}",
                "type": "function",
                "function": {
                    "name": getattr(function, "name", "") or "",
                    "arguments": arguments,
                },
            }
        )
    return {
        "role": "assistant",
        "content": _content_text(getattr(message, "content", None)),
        "tool_calls": calls,
    }


def _tool_payload(result: Any) -> Any:
    """Extract a JSON-safe payload from an MCP CallToolResult."""
    structured = getattr(result, "structuredContent", None)
    if structured is None:
        structured = getattr(result, "structured_content", None)
    if isinstance(structured, dict):
        if set(structured.keys()) == {"result"} and isinstance(structured["result"], dict):
            return structured["result"]
        return structured

    parts: list[str] = []
    for block in getattr(result, "content", None) or []:
        if isinstance(block, dict):
            text = block.get("text")
        else:
            text = getattr(block, "text", None)
        if text:
            parts.append(text)

    raw = "\n".join(parts).strip()
    if not raw:
        if getattr(result, "isError", False) or getattr(result, "is_error", False):
            return {"error": "The research tool returned an error."}
        return {"error": "The research tool returned an empty result."}

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def _collect_sources(payload: Any, sources: dict[str, dict[str, Any]]) -> None:
    if not isinstance(payload, dict):
        return
    for item in payload.get("results", []) or []:
        if not isinstance(item, dict):
            continue
        source = item.get("source")
        if not source:
            continue
        research_id = item.get("research_id") or derive_research_id(str(source))
        # Deduplicate by research id: only the investigation name is useful to the user.
        sources[str(research_id)] = {"research_id": str(research_id)}


def _tool_specs(tools: list[Any]) -> list[dict[str, Any]]:
    specs = []
    for tool in tools:
        schema = getattr(tool, "inputSchema", None)
        if not schema:
            schema = getattr(tool, "input_schema", None)
        if not isinstance(schema, dict):
            schema = {"type": "object", "properties": {}}
        specs.append(
            {
                "type": "function",
                "function": {
                    "name": getattr(tool, "name", ""),
                    "description": getattr(tool, "description", "") or "",
                    "parameters": schema,
                },
            }
        )
    return specs


def _remember(conversation_id: str, message: str, answer: str) -> None:
    history = _conversations.get(conversation_id, [])
    history.extend(
        [
            {"role": "user", "content": message},
            {"role": "assistant", "content": answer},
        ]
    )
    _conversations[conversation_id] = history[-MAX_HISTORY_MESSAGES:]

    while len(_conversations) > MAX_CONVERSATIONS:
        oldest = next(iter(_conversations))
        _conversations.pop(oldest, None)


class AgentRuntime:
    """Shared agent resources: one Mistral client and one MCP session."""

    def __init__(
        self,
        client: Any | None,
        mcp_session: Any,
        model: str | None = None,
        max_tool_rounds: int | None = None,
    ) -> None:
        self.client = client
        self.mcp = mcp_session
        self.model = model or os.getenv("MODEL_NAME", DEFAULT_MODEL)
        self.max_tool_rounds = max(1, int(max_tool_rounds or os.getenv("MAX_TOOL_ROUNDS", DEFAULT_MAX_TOOL_ROUNDS)))
        self.tools: list[dict[str, Any]] = []

    async def initialize(self) -> None:
        """Load the MCP tool schemas once at application startup."""
        result = await self.mcp.list_tools()
        self.tools = _tool_specs(list(getattr(result, "tools", []) or []))
        logger.info("Loaded %d MCP research tools", len(self.tools))

    async def _complete(self, messages: list[dict[str, Any]], *, use_tools: bool) -> Any:
        if self.client is None:
            raise AgentNotReady("The LLM is not configured. Add API_KEY to the .env file.")

        kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2,
        }
        if use_tools and self.tools:
            kwargs["tools"] = self.tools
            kwargs["tool_choice"] = "auto"

        return await self.client.chat.complete_async(**kwargs)

    async def _execute_tool(self, name: str, arguments: dict[str, Any]) -> Any:
        try:
            result = await self.mcp.call_tool(name, arguments)
        except Exception as exc:
            logger.warning("MCP tool %s failed: %s", name, type(exc).__name__)
            return {"error": f"The research tool failed: {type(exc).__name__}"}
        return _tool_payload(result)

    async def run(self, message: str, conversation_id: str | None = None) -> dict[str, Any]:
        """Answer one user message, using research tools when Mistral asks for them."""
        message = (message or "").strip()
        if not message:
            raise AgentError("Message cannot be empty.")
        if self.client is None:
            raise AgentNotReady("The LLM is not configured. Add API_KEY to the .env file.")

        conversation_id = conversation_id or f"conv-{uuid.uuid4().hex[:12]}"
        history = list(_conversations.get(conversation_id, []))

        messages: list[dict[str, Any]] = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(history[-MAX_HISTORY_MESSAGES:])
        messages.append({"role": "user", "content": message})

        used_rag = False
        sources: dict[str, dict[str, Any]] = {}
        answer = ""

        try:
            for _ in range(self.max_tool_rounds):
                response = await self._complete(messages, use_tools=True)
                assistant = response.choices[0].message
                tool_calls = list(getattr(assistant, "tool_calls", None) or [])

                if not tool_calls:
                    answer = _content_text(getattr(assistant, "content", None)).strip()
                    break

                messages.append(_assistant_tool_message(assistant, tool_calls))

                for tool_call in tool_calls:
                    function = getattr(tool_call, "function", None)
                    name = getattr(function, "name", "") or ""
                    arguments = _parse_arguments(getattr(function, "arguments", None))

                    if name == "search_nasa_research":
                        used_rag = True

                    payload = await self._execute_tool(name, arguments)
                    if name == "search_nasa_research":
                        _collect_sources(payload, sources)

                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": getattr(tool_call, "id", None) or name,
                            "name": name,
                            "content": payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False),
                        }
                    )

            if not answer:
                # Tool budget exhausted: force a final answer from the evidence collected.
                response = await self._complete(messages, use_tools=False)
                answer = _content_text(response.choices[0].message.content).strip()

        except AgentNotReady:
            raise
        except Exception as exc:
            logger.exception("Agent run failed")
            raise AgentError("The assistant could not complete the request.") from exc

        if not answer:
            answer = "I could not produce an answer from the available research evidence."

        # Keep only the investigations actually cited in the answer. This avoids
        # dumping every retrieved document as a "source" when only a few are used.
        cited = {
            research_id
            for research_id in sources
            if research_id in answer or f"[{research_id}" in answer
        }
        if cited:
            filtered_sources = [sources[rid] for rid in sources if rid in cited]
        else:
            filtered_sources = list(sources.values())

        _remember(conversation_id, message, answer)

        return {
            "answer": answer,
            "sources": filtered_sources,
            "used_rag": used_rag,
            "conversation_id": conversation_id,
        }


def set_runtime(runtime: AgentRuntime | None) -> None:
    """Register the shared runtime created by the FastAPI lifespan."""
    global _runtime
    _runtime = runtime


def get_runtime() -> AgentRuntime | None:
    return _runtime


async def run_agent(message: str, conversation_id: str | None = None) -> dict[str, Any]:
    """Run the shared agent. Used by the API layer."""
    if _runtime is None:
        raise AgentNotReady("The agent runtime is not initialized.")
    return await _runtime.run(message, conversation_id)
