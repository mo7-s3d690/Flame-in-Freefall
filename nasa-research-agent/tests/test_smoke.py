"""Quick smoke tests for the NASA Research Agent."""

from __future__ import annotations

import json

from fastapi.testclient import TestClient

from agent.query_decomposition import decompose_query
from rag.database import load_index
from rag.ingestion import ingest_documents
from rag.retrieval import get_document, search_research


def _write_documents(directory):
    (directory / "PSI-20.md").write_text(
        "# ACME BRE\n\n"
        "## Findings\n\n"
        "Flames persisted in microgravity without airflow in oxygen-enriched air. "
        "Quiescent burning was observed. "
        "The burner used methane and ethylene.\n\n"
        "## Safety\n\n"
        "Halting ventilation may not extinguish a fire in an oxygen-enriched cabin.\n",
        encoding="utf-8",
    )
    (directory / "PSI-100.md").write_text(
        "# SAFFIRE-III\n\n"
        "## Findings\n\n"
        "The experiment measured large-scale flame growth in low gravity at 30 cm/s flow.\n",
        encoding="utf-8",
    )
    (directory / "PSI-68.md").write_text(
        "# FLEX-2\n\n"
        "## Findings\n\n"
        "Droplet combustion and radiative extinction were studied in microgravity.\n",
        encoding="utf-8",
    )


def test_ingestion_reingestion_and_retrieval(tmp_path):
    documents = tmp_path / "documents"
    documents.mkdir()
    _write_documents(documents)
    index_file = tmp_path / "bm25_index" / "index.json"

    report = ingest_documents(documents, index_file)
    assert report.documents_total == 3
    assert report.chunks_total >= 3
    assert report.failed == 0

    index = load_index(index_file)
    assert index.bm25 is not None

    results = search_research(["quiescent burning microgravity"], index=index)
    assert results
    assert results[0].research_id == "PSI-20"

    document = get_document(index, "PSI-20")
    assert document
    assert all(chunk["metadata"]["source"] == "PSI-20.md" for chunk in document)

    second = ingest_documents(documents, index_file)
    assert second.skipped == 3
    assert second.chunks_total == report.chunks_total


class _FakeMessage:
    def __init__(self, content: str) -> None:
        self.content = content


class _FakeChoice:
    def __init__(self, content: str) -> None:
        self.message = _FakeMessage(content)


class _FakeResponse:
    def __init__(self, content: str) -> None:
        self.choices = [_FakeChoice(content)]


class _FakeChat:
    def __init__(self, content: str) -> None:
        self._content = content

    def complete(self, **_kwargs):
        return _FakeResponse(self._content)


class _FakeClient:
    def __init__(self, content: str) -> None:
        self.chat = _FakeChat(content)


def test_decomposition_and_fallback():
    payload = json.dumps(
        {
            "requires_decomposition": True,
            "queries": ["ancient water on Mars", "NASA missions studying Mars water"],
        }
    )
    assert decompose_query(
        "How did NASA find water on Mars and which missions helped?",
        client=_FakeClient(payload),
        model="test-model",
        enabled=True,
    ) == ["ancient water on Mars", "NASA missions studying Mars water"]

    assert decompose_query(
        "What is Perseverance?",
        client=_FakeClient("not json"),
        model="test-model",
        enabled=True,
    ) == ["What is Perseverance?"]

    assert decompose_query(
        "Who are you?",
        enabled=False,
    ) == ["Who are you?"]


def test_api_health_and_chat(monkeypatch, tmp_path):
    monkeypatch.setenv("BM25_INDEX_PATH", str(tmp_path / "bm25_index"))

    import api.main as api_main
    import api.routes as api_routes

    app = api_main.create_app()

    async def fake_run_agent(message: str, conversation_id: str | None = None):
        return {
            "answer": f"Echo: {message}",
            "sources": [],
            "used_rag": False,
            "conversation_id": conversation_id or "conv-test",
        }

    monkeypatch.setattr(api_routes, "run_agent", fake_run_agent)

    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json()["status"] == "ok"

        response = client.post("/api/v1/chat", json={"message": "Who are you?"})
        assert response.status_code == 200
        body = response.json()
        assert body["answer"] == "Echo: Who are you?"
        assert body["used_rag"] is False
        assert body["conversation_id"] == "conv-test"

        invalid = client.post("/api/v1/chat", json={"message": "   "})
        assert invalid.status_code == 422
