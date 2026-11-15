"""Local BM25 index storage.

The index is a JSON file containing the chunks, their tokens and the content
hash of every source document. ``BM25Okapi`` itself is rebuilt from the saved
tokens when the application starts, which avoids serializing Python objects.
"""

from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from rank_bm25 import BM25Okapi

INDEX_VERSION = 1
TOKENIZER_VERSION = "v1"
EMPTY_TOKEN = "__empty__"

_TOKEN_PATTERN = re.compile(r"[a-z0-9]+(?:[-/][a-z0-9]+)*")
_STEM_PATTERN = re.compile(r"[^A-Za-z0-9_-]+")


class IndexFormatError(RuntimeError):
    """Raised when the persisted index is invalid."""


def tokenize(text: str) -> list[str]:
    """Tokenize text with the single tokenizer used for indexing and search."""
    return _TOKEN_PATTERN.findall((text or "").lower())


def derive_research_id(source: str) -> str:
    """Return the PSI identifier encoded in the source filename."""
    return Path(source).stem


def safe_stem(source: str) -> str:
    """Return a filename stem safe for use in stable chunk IDs."""
    return _STEM_PATTERN.sub("_", Path(source).stem)


@dataclass
class IndexData:
    """In-memory view of the persisted BM25 index."""

    chunks: list[dict[str, Any]] = field(default_factory=list)
    documents: dict[str, dict[str, Any]] = field(default_factory=dict)
    config: dict[str, Any] = field(default_factory=dict)
    bm25: BM25Okapi | None = None

    @property
    def is_empty(self) -> bool:
        return not self.chunks or self.bm25 is None


def build_bm25(chunks: list[dict[str, Any]]) -> BM25Okapi | None:
    """Build a BM25Okapi index from stored chunks."""
    if not chunks:
        return None
    corpus = [chunk.get("tokens") or [EMPTY_TOKEN] for chunk in chunks]
    return BM25Okapi(corpus)


def load_index(index_path: str | Path) -> IndexData:
    """Load an index from disk, returning an empty index when it does not exist."""
    path = Path(index_path)
    if not path.exists():
        return IndexData()

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise IndexFormatError(f"Could not load BM25 index at {path}: {exc}") from exc

    if not isinstance(payload, dict):
        raise IndexFormatError(f"Invalid BM25 index at {path}: expected a JSON object")

    chunks = payload.get("chunks") or []
    documents = payload.get("documents") or {}
    config = payload.get("config") or {}

    if not isinstance(chunks, list) or not isinstance(documents, dict):
        raise IndexFormatError(f"Invalid BM25 index at {path}: wrong field types")

    return IndexData(
        chunks=chunks,
        documents=documents,
        config=config,
        bm25=build_bm25(chunks),
    )


def save_index(
    index_path: str | Path,
    documents: dict[str, dict[str, Any]],
    chunks: list[dict[str, Any]],
    config: dict[str, Any],
) -> None:
    """Persist the index atomically."""
    path = Path(index_path)
    path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "version": INDEX_VERSION,
        "config": config,
        "documents": documents,
        "chunks": chunks,
    }

    temporary = path.with_name(path.name + ".tmp")
    try:
        temporary.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink(missing_ok=True)
