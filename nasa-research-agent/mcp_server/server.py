"""MCP server exposing NASA research search tools over stdio."""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

from agent.query_decomposition import decompose_query  # noqa: E402
from rag.database import IndexData, load_index  # noqa: E402
from rag.retrieval import get_document, search_research  # noqa: E402

logger = logging.getLogger(__name__)

mcp = FastMCP("nasa-research-agent")

_index: IndexData | None = None
_mistral_client: Any | None = None


def _resolve_path(value: str) -> Path:
    path = Path(os.path.expandvars(value)).expanduser()
    return path if path.is_absolute() else PROJECT_ROOT / path


def _index_path() -> Path:
    return _resolve_path(os.getenv("BM25_INDEX_PATH", "data/bm25_index"))


def get_index() -> IndexData:
    """Load the BM25 index once and reuse it for every tool call."""
    global _index
    if _index is None:
        _index = load_index(_index_path() / "index.json")
        logger.info("Loaded BM25 index with %d chunks", len(_index.chunks))
    return _index


def _get_client() -> Any | None:
    global _mistral_client
    if _mistral_client is None:
        api_key = os.getenv("API_KEY")
        if not api_key:
            return None
        try:
            from agent.llm import LLMClient

            _mistral_client = LLMClient(
                api_key=api_key,
                model=os.getenv("MODEL_NAME", "mistral-small-latest"),
                base_url=os.getenv("API_BASE_URL"),
            )
        except Exception as exc:  # pragma: no cover - depends on the installed SDK
            logger.warning("Could not create the LLM client: %s", exc)
            return None
    return _mistral_client


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


@mcp.tool()
def search_nasa_research(query: str, top_k: int = 5) -> dict[str, Any]:
    """Search the NASA PSI combustion research collection.

    Args:
        query: The user's full research question.
        top_k: Maximum number of evidence chunks to return (1-20).

    The tool decomposes complex questions into focused sub-queries, runs BM25
    search for each, and merges the ranked lists with Reciprocal Rank Fusion.
    """
    query = " ".join((query or "").split()).strip()
    if not query:
        return {"query": "", "queries": [], "count": 0, "results": [], "error": "query must not be empty"}

    try:
        top_k = max(1, min(20, int(top_k)))
    except (TypeError, ValueError):
        top_k = 5

    try:
        index = get_index()
    except Exception as exc:
        logger.exception("Could not load the BM25 index")
        return {"query": query, "queries": [query], "count": 0, "results": [], "error": f"The BM25 index could not be loaded: {type(exc).__name__}"}

    if index.is_empty:
        return {
            "query": query,
            "queries": [query],
            "count": 0,
            "results": [],
            "error": "The BM25 index is empty. Run `python scripts/ingest.py` first.",
        }

    queries = decompose_query(
        query,
        client=_get_client(),
        model=os.getenv("MODEL_NAME"),
        enabled=_env_bool("ENABLE_QUERY_DECOMPOSITION", True),
        max_queries=_env_int("MAX_DECOMPOSITION_QUERIES", 4),
    )

    try:
        results = search_research(
            queries,
            top_k=top_k,
            index=index,
            rrf_k=_env_int("RRF_K", 60),
        )
    except Exception as exc:
        logger.exception("BM25 retrieval failed")
        return {"query": query, "queries": queries, "count": 0, "results": [], "error": f"Retrieval failed: {type(exc).__name__}"}

    return {
        "query": query,
        "queries": queries,
        "count": len(results),
        "results": [result.to_dict() for result in results],
    }


@mcp.tool()
def get_research_document(source: str) -> dict[str, Any]:
    """Return one complete indexed research document in its original chunk order.

    Args:
        source: Document name such as ``PSI-20`` or ``PSI-20.md``.
    """
    source = (source or "").strip()
    if not source:
        return {"error": "source must not be empty"}

    try:
        index = get_index()
    except Exception as exc:
        logger.exception("Could not load the BM25 index")
        return {"error": f"The BM25 index could not be loaded: {type(exc).__name__}"}

    chunks = get_document(index, source)
    if not chunks:
        return {"error": f"No indexed document named '{source}'."}

    metadata = chunks[0].get("metadata", {})
    return {
        "source": metadata.get("source", source),
        "research_id": metadata.get("research_id", ""),
        "chunk_count": len(chunks),
        "chunks": [
            {
                "chunk_index": int(chunk.get("metadata", {}).get("chunk_index", 0)),
                "text": chunk.get("text", ""),
            }
            for chunk in chunks
        ],
    }


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
