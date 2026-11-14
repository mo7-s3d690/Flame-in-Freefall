"""Minimal, meaning-preserving text cleaning for Markdown documents."""

from __future__ import annotations

import re


def clean_text(text: str) -> str:
    """Normalize whitespace without changing the meaning of the document.

    - ``\\r\\n`` and ``\\r`` become ``\\n``.
    - Trailing spaces are removed outside fenced code blocks.
    - Runs of three or more blank lines become two.
    - Content, numbers, tables, URLs and Markdown markers are preserved.
    """
    if not text:
        return ""

    text = text.replace("\r\n", "\n").replace("\r", "\n")

    cleaned_lines: list[str] = []
    in_fence = False
    for line in text.split("\n"):
        stripped = line.lstrip()
        if stripped.startswith("```"):
            in_fence = not in_fence
            cleaned_lines.append(line)
            continue
        cleaned_lines.append(line if in_fence else line.rstrip())

    text = "\n".join(cleaned_lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip("\n") + "\n"
