"""Paragraph-aware chunking that preserves the source text.

The chunker uses character windows and moves each boundary to a preferred
break point:

1. paragraph break (``\\n\\n``)
2. sentence end
3. line break
4. whitespace
5. hard cut (last resort)

Markdown tables are treated as atomic blocks: a chunk boundary is never placed
inside a table. A table may therefore make a chunk slightly longer than
``chunk_size`` rather than being split.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 150

_SENTENCE_END = re.compile(r"[.!?](?=\s)")


@dataclass(frozen=True)
class TextChunk:
    """One chunk of a document, with its zero-based position."""

    text: str
    index: int
    section: str = ""


def _table_ranges(text: str) -> list[tuple[int, int]]:
    """Return ``(start, end)`` offsets of contiguous Markdown table blocks."""
    ranges: list[tuple[int, int]] = []
    offset = 0
    start: int | None = None

    for line in text.splitlines(keepends=True):
        is_table_line = line.lstrip().startswith("|")
        if is_table_line and start is None:
            start = offset
        elif not is_table_line and start is not None:
            ranges.append((start, offset))
            start = None
        offset += len(line)

    if start is not None:
        ranges.append((start, offset))
    return ranges


def _range_containing(position: int, ranges: list[tuple[int, int]]) -> tuple[int, int] | None:
    for start, end in ranges:
        if start < position < end:
            return start, end
    return None


def _find_break(text: str, start: int, end: int, minimum_end: int) -> int:
    """Move ``end`` backwards to a natural boundary when possible."""
    window_start = max(start + 1, minimum_end)

    paragraph = text.rfind("\n\n", window_start, end)
    if paragraph != -1:
        return paragraph

    sentence_end = -1
    for match in _SENTENCE_END.finditer(text, window_start, end):
        sentence_end = match.end()
    if sentence_end != -1:
        return sentence_end

    newline = text.rfind("\n", window_start, end)
    if newline != -1:
        return newline

    space = text.rfind(" ", window_start, end)
    if space != -1:
        return space

    return end


def _nearest_heading(text: str, position: int) -> str:
    """Return the nearest Markdown heading preceding ``position``."""
    heading = ""
    for match in re.finditer(r"(?m)^(#{1,6})\s+(.+?)\s*$", text[:position]):
        heading = match.group(2).strip()
    return heading


def _next_start(text: str, start: int, end: int, overlap: int, tables: list[tuple[int, int]]) -> int:
    """Compute the next window start while making forward progress."""
    candidate = max(0, end - overlap)

    table = _range_containing(candidate, tables)
    if table is not None and table[0] > start:
        candidate = table[0]

    # Do not begin in the middle of a word when a nearby space exists.
    if 0 < candidate < len(text) and not text[candidate - 1].isspace() and not text[candidate].isspace():
        space = text.find(" ", candidate, min(end, candidate + 40))
        if space != -1:
            candidate = space + 1

    if candidate <= start:
        candidate = end
    return candidate


def chunk_text(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[TextChunk]:
    """Split ``text`` into overlapping, paragraph-aware chunks."""
    if not text or not text.strip():
        return []

    chunk_size = max(100, int(chunk_size))
    chunk_overlap = max(0, int(chunk_overlap))
    if chunk_overlap >= chunk_size:
        chunk_overlap = chunk_size // 2

    if len(text) <= chunk_size:
        stripped = text.strip()
        return [TextChunk(stripped, 0, _nearest_heading(text, 0))] if stripped else []

    tables = _table_ranges(text)
    chunks: list[TextChunk] = []
    start = 0
    length = len(text)

    while start < length:
        end = min(start + chunk_size, length)

        if end < length:
            end = _find_break(text, start, end, start + max(1, chunk_size // 2))

            table = _range_containing(end, tables)
            if table is not None:
                end = table[1]
                end = min(end, length)

        piece = text[start:end].strip()
        if piece:
            chunks.append(TextChunk(piece, len(chunks), _nearest_heading(text, start)))

        if end >= length:
            break

        start = _next_start(text, start, end, chunk_overlap, tables)

    return chunks
