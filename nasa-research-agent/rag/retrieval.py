"""BM25 retrieval with Reciprocal Rank Fusion (RRF)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from rag.database import IndexData, derive_research_id, tokenize

DEFAULT_RRF_K = 60


@dataclass
class SearchResult:
    """One retrieved chunk."""

    id: str
    text: str
    source: str
    research_id: str
    chunk_index: int
    score: float
    bm25_score: float
    matched_queries: list[str]

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "text": self.text,
            "source": self.source,
            "research_id": self.research_id,
            "chunk_index": self.chunk_index,
            "score": round(self.score, 6),
            "bm25_score": round(self.bm25_score, 6),
            "matched_queries": self.matched_queries,
        }


def search_research(
    queries: list[str],
    top_k: int = 5,
    index: IndexData | None = None,
    rrf_k: int = DEFAULT_RRF_K,
) -> list[SearchResult]:
    """Search the index for every query and merge the rankings with RRF.

    Raw BM25 scores are not comparable across independent query runs, so the
    merged score is ``sum(1 / (rrf_k + rank))`` over the queries that retrieved
    a chunk. A chunk found by several sub-queries therefore ranks higher than a
    chunk found by only one, assuming similar ranks.
    """
    if index is None or index.is_empty:
        return []

    top_k = max(1, int(top_k))
    rrf_k = max(1, int(rrf_k))

    unique_queries: list[str] = []
    seen: set[str] = set()
    for query in queries:
        query = (query or "").strip()
        if query and query.lower() not in seen:
            unique_queries.append(query)
            seen.add(query.lower())

    if not unique_queries:
        return []

    fused_scores: dict[int, float] = {}
    best_bm25: dict[int, float] = {}
    matched_queries: dict[int, list[str]] = {}

    for query in unique_queries:
        tokens = tokenize(query)
        if not tokens:
            continue

        scores = index.bm25.get_scores(tokens)  # type: ignore[union-attr]
        ranked = sorted(
            ((position, float(score)) for position, score in enumerate(scores) if score > 0),
            key=lambda item: item[1],
            reverse=True,
        )[:top_k]

        for rank, (position, bm25_score) in enumerate(ranked, start=1):
            fused_scores[position] = fused_scores.get(position, 0.0) + 1.0 / (rrf_k + rank)
            best_bm25[position] = max(best_bm25.get(position, 0.0), bm25_score)
            matched_queries.setdefault(position, []).append(query)

    ordered = sorted(
        fused_scores.items(),
        key=lambda item: (
            -item[1],
            -best_bm25.get(item[0], 0.0),
            index.chunks[item[0]].get("id", ""),
        ),
    )[:top_k]

    results: list[SearchResult] = []
    for position, fused in ordered:
        chunk = index.chunks[position]
        metadata = chunk.get("metadata", {})
        source = metadata.get("source", "")
        results.append(
            SearchResult(
                id=chunk.get("id", ""),
                text=chunk.get("text", ""),
                source=source,
                research_id=metadata.get("research_id") or derive_research_id(source),
                chunk_index=int(metadata.get("chunk_index", 0)),
                score=fused,
                bm25_score=best_bm25.get(position, 0.0),
                matched_queries=matched_queries.get(position, []),
            )
        )
    return results


def _normalize_source(source: str) -> str:
    source = (source or "").strip().replace("\\", "/").rsplit("/", 1)[-1]
    if source and not source.lower().endswith(".md"):
        source += ".md"
    return source


def get_document(index: IndexData, source: str) -> list[dict[str, Any]]:
    """Return one document's chunks in their original order."""
    target = _normalize_source(source)
    if not target:
        return []

    target_lower = target.lower()
    target_stem = target_lower.removesuffix(".md")

    chunks = []
    for chunk in index.chunks:
        metadata = chunk.get("metadata", {})
        chunk_source = str(metadata.get("source", ""))
        if chunk_source.lower() == target_lower:
            chunks.append(chunk)
        elif derive_research_id(chunk_source).lower() == target_stem:
            chunks.append(chunk)

    chunks.sort(key=lambda chunk: int(chunk.get("metadata", {}).get("chunk_index", 0)))
    return chunks
