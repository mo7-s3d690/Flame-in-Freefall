"""Read Markdown research documents without losing their content."""

from __future__ import annotations

from pathlib import Path


class ExtractionError(RuntimeError):
    """Raised when a Markdown document cannot be read."""


def extract_markdown(path: str | Path) -> str:
    """Return the UTF-8 text of a Markdown document.

    The original Markdown is preserved as-is: headings, tables, lists, URLs,
    numbers and code blocks are not modified here. Cleaning happens later and
    is intentionally minimal.
    """
    path = Path(path)
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise ExtractionError(f"{path.name} is not valid UTF-8") from exc
    except OSError as exc:
        raise ExtractionError(f"Could not read {path.name}: {exc}") from exc
