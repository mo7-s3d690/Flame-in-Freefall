"""Ingest Markdown research documents into the local BM25 index."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from dotenv import load_dotenv

load_dotenv(PROJECT_ROOT / ".env")

from rag.database import IndexFormatError  # noqa: E402
from rag.ingestion import IngestionError, ingest_documents  # noqa: E402


def _resolve(value: str) -> Path:
    path = Path(os.path.expandvars(value)).expanduser()
    return path if path.is_absolute() else PROJECT_ROOT / path


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Ingest NASA Markdown research into a BM25 index.")
    parser.add_argument(
        "--documents",
        default=os.getenv("DOCUMENTS_PATH", "data/documents"),
        help="Directory containing .md files (default: DOCUMENTS_PATH).",
    )
    parser.add_argument(
        "--index",
        default=os.getenv("BM25_INDEX_PATH", "data/bm25_index"),
        help="Index directory (default: BM25_INDEX_PATH).",
    )
    parser.add_argument("--chunk-size", type=int, default=_env_int("CHUNK_SIZE", 1000))
    parser.add_argument("--overlap", type=int, default=_env_int("CHUNK_OVERLAP", 150))
    parser.add_argument("--force", action="store_true", help="Rebuild every document.")
    args = parser.parse_args(argv)

    documents_path = _resolve(args.documents)
    index_file = _resolve(args.index) / "index.json"

    try:
        report = ingest_documents(
            documents_path=documents_path,
            index_path=index_file,
            chunk_size=args.chunk_size,
            chunk_overlap=args.overlap,
            force=args.force,
        )
    except (IngestionError, IndexFormatError) as exc:
        print(f"Ingestion failed: {exc}", file=sys.stderr)
        return 1

    print(f"Ingested: {report.summary()}")
    for error in report.errors:
        print(f"  FAILED {error['source']}: {error['error']}", file=sys.stderr)

    return 0 if report.ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
