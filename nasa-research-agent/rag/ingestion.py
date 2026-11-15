"""Full ingestion pipeline: Markdown -> cleaned chunks -> persisted BM25 index."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from rag.chunking import chunk_text
from rag.cleaning import clean_text
from rag.database import (
    TOKENIZER_VERSION,
    derive_research_id,
    load_index,
    safe_stem,
    save_index,
    tokenize,
)
from rag.extraction import ExtractionError, extract_markdown


class IngestionError(RuntimeError):
    """Raised when ingestion cannot run at all."""


@dataclass
class IngestReport:
    """Summary of one ingestion run."""

    added: int = 0
    updated: int = 0
    skipped: int = 0
    removed: int = 0
    failed: int = 0
    chunks_total: int = 0
    documents_total: int = 0
    errors: list[dict[str, str]] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return self.failed == 0

    def summary(self) -> str:
        return (
            f"documents={self.documents_total} chunks={self.chunks_total} "
            f"added={self.added} updated={self.updated} skipped={self.skipped} "
            f"removed={self.removed} failed={self.failed}"
        )


def _make_chunks(source: str, text: str, chunk_size: int, chunk_overlap: int) -> list[dict[str, Any]]:
    """Chunk and tokenize one cleaned document."""
    research_id = derive_research_id(source)
    stem = safe_stem(source)
    records: list[dict[str, Any]] = []

    for piece in chunk_text(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap):
        records.append(
            {
                "id": f"{stem}_{piece.index:03d}",
                "text": piece.text,
                "tokens": tokenize(piece.text),
                "metadata": {
                    "source": source,
                    "research_id": research_id,
                    "chunk_index": piece.index,
                    "section": piece.section,
                },
            }
        )
    return records


def _group_by_source(chunks: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = {}
    for chunk in chunks:
        source = chunk.get("metadata", {}).get("source", "")
        if source:
            grouped.setdefault(source, []).append(chunk)
    return grouped


def ingest_documents(
    documents_path: str | Path,
    index_path: str | Path,
    chunk_size: int = 1000,
    chunk_overlap: int = 150,
    force: bool = False,
) -> IngestReport:
    """Ingest every ``*.md`` file in ``documents_path`` into the BM25 index.

    Unchanged files are skipped using a SHA-256 content hash. Changed files
    replace their previous chunks, and files that disappeared from disk are
    pruned. Failures are reported instead of being silently ignored.
    """
    documents_path = Path(documents_path)
    index_path = Path(index_path)

    if not documents_path.exists():
        raise IngestionError(f"Documents path does not exist: {documents_path}")

    files = sorted(documents_path.glob("*.md"))
    if not files:
        raise IngestionError(f"No Markdown files found in {documents_path}")

    existing = load_index(index_path)
    existing_by_source = _group_by_source(existing.chunks)

    config = {
        "chunk_size": int(chunk_size),
        "chunk_overlap": int(chunk_overlap),
        "tokenizer": TOKENIZER_VERSION,
    }
    rebuild = force or (bool(existing.chunks) and existing.config != config)

    report = IngestReport()
    new_documents: dict[str, dict[str, Any]] = {}
    new_chunks: list[dict[str, Any]] = []

    for path in files:
        source = path.name
        previous_chunks = existing_by_source.get(source, [])

        try:
            raw = path.read_bytes()
            digest = hashlib.sha256(raw).hexdigest()
            previous_meta = existing.documents.get(source)

            unchanged = (
                not rebuild
                and previous_meta is not None
                and previous_meta.get("sha256") == digest
                and bool(previous_chunks)
            )
            if unchanged:
                new_documents[source] = previous_meta
                new_chunks.extend(previous_chunks)
                report.skipped += 1
                continue

            text = extract_markdown(path)
            if not text.strip():
                raise ExtractionError("document is empty")

            cleaned = clean_text(text)
            records = _make_chunks(source, cleaned, chunk_size, chunk_overlap)
            if not records:
                raise ExtractionError("document produced no chunks")

            new_documents[source] = {"sha256": digest, "chunk_count": len(records)}
            new_chunks.extend(records)

            if previous_chunks:
                report.updated += 1
            else:
                report.added += 1

        except (ExtractionError, OSError, UnicodeError) as exc:
            report.failed += 1
            report.errors.append({"source": source, "error": str(exc)})

            # Keep previously indexed content rather than losing it.
            if previous_chunks:
                new_documents[source] = existing.documents.get(
                    source,
                    {"sha256": "", "chunk_count": len(previous_chunks)},
                )
                new_chunks.extend(previous_chunks)

    current_sources = {path.name for path in files}
    for source in existing.documents:
        if source not in current_sources:
            report.removed += 1

    save_index(index_path, new_documents, new_chunks, config)

    report.chunks_total = len(new_chunks)
    report.documents_total = len(new_documents)
    return report
