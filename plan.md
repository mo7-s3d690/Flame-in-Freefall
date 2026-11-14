# NASA Research Agent — Implementation Plan

## 1. Goal

Build a functional NASA Research Agent inside the existing `Flame-in-Freefall` repository:

- Answers questions over 9 local NASA PSI Markdown research documents.
- Uses BM25 retrieval (no embeddings, no vector DB).
- Splits complex questions into sub-queries when needed.
- Uses the official Mistral API + `mistral-small-latest`.
- Exposes research tools through an MCP server (official Python SDK).
- Is callable through FastAPI.
- Connects to the existing JavaScript frontend in the final step.
- Answers with `PSI-XX` citations.
- Uses RAG only when the question needs research data (e.g. greetings bypass RAG).

## 2. Confirmed Decisions

| Item | Decision |
|---|---|
| Location | `Flame-in-Freefall/nasa-research-agent/` (isolated module inside the repo) |
| Python | System Python 3.11.9, no virtual environment |
| Dependencies | Installed globally with `pip install -r requirements.txt` |
| Documents | `C:\Users\DELL\Downloads\nasa\md` (not copied) |
| LLM | Mistral API, `MODEL_NAME=mistral-small-latest` |
| Retrieval | `rank-bm25` + local JSON index |
| API | `POST /api/v1/chat`, `GET /health` |
| Frontend | Not touched until the final connection step |
| Testing | Skipped as a full phase; one quick `pytest` smoke test |
| RAG gate | Mistral tool calling + system prompt rules |
| Citations | `[PSI-XX]` (derived from the source filename) |

### Known constraints

- `mistral-small-latest` tool-calling support must be verified with a live probe before wiring the agent.
- The absolute documents path only exists on this machine; teammates must set their own `DOCUMENTS_PATH`.
- Global pip installs can conflict with other projects; acceptable for V1.
- Existing `js/chat.js` uses a different request/response shape and is connected only in the final step.

## 3. Research Data

Documents: `PSI-20`, `PSI-21`, `PSI-22`, `PSI-23`, `PSI-25`, `PSI-68`, `PSI-99`, `PSI-100`, `PSI-107`.

Each document contains:

- H1 title.
- `| PSI ID | ... |` row.
- `| Research name | ... |` row.
- Tables, lists, numbers, units, URLs, DOIs.

The PSI ID equals the filename stem, so citations use `PSI-XX` directly.

## 4. Project Structure

```
Flame-in-Freefall/nasa-research-agent/
├── agent/
│   ├── __init__.py
│   ├── main.py
│   ├── prompts.py
│   └── query_decomposition.py
├── rag/
│   ├── __init__.py
│   ├── extraction.py
│   ├── cleaning.py
│   ├── chunking.py
│   ├── ingestion.py
│   ├── database.py
│   └── retrieval.py
├── mcp_server/
│   ├── __init__.py
│   └── server.py
├── api/
│   ├── __init__.py
│   ├── main.py
│   ├── routes.py
│   └── schemas.py
├── scripts/
│   └── ingest.py
├── data/
│   └── bm25_index/
├── tests/
│   └── test_smoke.py
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## 5. RAG Pipeline

### 5.1 Extraction (`rag/extraction.py`)

- Read `.md` files with UTF-8.
- Preserve Markdown exactly: headings, tables, lists, URLs, numbers, code blocks.
- Empty file → warning.
- Unreadable file → recorded as a failure (not silently ignored).

### 5.2 Cleaning (`rag/cleaning.py`)

Minimal only:

- Normalize `\r\n` / `\r` to `\n`.
- Remove trailing spaces.
- Collapse 3+ blank lines to 2.
- Never alter tables, lists, URLs, numbers, or technical terms.

### 5.3 Chunking (`rag/chunking.py`)

- `CHUNK_SIZE=1000` characters, `CHUNK_OVERLAP=150`.
- Paragraph-first accumulation.
- Long paragraphs split on sentence boundaries.
- Tables are atomic (never split inside a table).
- Hard whitespace split only as a last resort.
- No text silently discarded.
- Each chunk stores:
  - `source` (filename)
  - `chunk_index`
  - stable `id` (`PSI-20_003`)

### 5.4 Tokenizer

Single tokenizer used at ingestion and query time:

```python
re.findall(r"[a-z0-9]+(?:[-/][a-z0-9]+)*", text.lower())
```

This keeps `o2`, `co2`, `ch4/n2`, `psi-20`.

### 5.5 Database (`rag/database.py`)

- Persist to `data/bm25_index/index.json`.
- Index file contains:
  - version
  - chunk configuration
  - document hashes
  - chunks (`id`, `text`, `tokens`, `metadata`)
- Load saved tokens and rebuild `BM25Okapi` once; cache in memory.
- Handle missing/empty index gracefully.
- Atomic save (temp file + replace).

### 5.6 Ingestion (`rag/ingestion.py`)

- Discover `*.md` under `DOCUMENTS_PATH`.
- Hash each file (SHA-256).
- Skip unchanged documents.
- Replace changed documents' chunks.
- Remove chunks for deleted documents.
- Rebuild all if chunk configuration changed.
- Report added/updated/skipped/failed counts.
- Fail loudly (non-zero exit) when files fail.

### 5.7 Retrieval (`rag/retrieval.py`)

`search_research(queries: list[str], top_k: int = 5)`

1. Tokenize each query.
2. BM25 search each query independently.
3. Discard zero-relevance results.
4. Merge with Reciprocal Rank Fusion:

```
score(d) = Σ 1 / (RRF_K + rank_q(d))      RRF_K = 60
```

5. Deduplicate by chunk ID.
6. Preserve `matched_queries`.
7. Return fewer than `top_k` rather than padding with irrelevant chunks.

## 6. Query Decomposition (`agent/query_decomposition.py`)

`decompose_query(question) -> list[str]`

- Called only inside the MCP search tool, so greetings never reach it.
- `ENABLE_QUERY_DECOMPOSITION=true` by default.
- If disabled → return `[question]`.
- Mistral JSON-mode call with a dedicated prompt.
- Output:

```json
{
  "requires_decomposition": true,
  "queries": ["...", "..."]
}
```

- Rules:
  - Simple question → return the original question.
  - Complex question → 2–4 focused sub-queries.
  - Max `MAX_DECOMPOSITION_QUERIES=4`.
  - Deduplicate.
  - Invalid JSON / API failure → fall back to `[question]`.
  - Never block the answer because decomposition failed.

## 7. MCP Server (`mcp_server/server.py`)

- Official MCP Python SDK, `@mcp.tool()`.
- Standalone: `python -m mcp_server.server`.
- Tools:

### `search_nasa_research(query: str, top_k: int = 5)`

1. Validate input.
2. Run decomposition.
3. BM25 search all sub-queries.
4. Merge + deduplicate with RRF.
5. Return chunks with `source`, `research_id`, `chunk_index`, `score`, `matched_queries`.

### `get_research_document(source: str)`

- Return all chunks for one document in original order.
- Accept `PSI-20` or `PSI-20.md`.
- Clear error when the document is missing.

Implementation rules:

- BM25 logic stays in `rag/`.
- Decomposition stays in `agent/query_decomposition.py`.
- No duplicated retrieval logic.
- Structured JSON-safe results.
- No secrets exposed.

## 8. Agent (`agent/`)

### `prompts.py`

System prompt defines:

- Identity: NASA fire-safety research assistant.
- Purpose and scope (9 PSI investigations).
- Tool rules:
  - Greetings, identity, capability, general conversation → answer directly, no tool.
  - Research/fire-safety questions → `search_nasa_research`.
  - Full-document questions → `get_research_document`.
- Evidence rules:
  - Never invent facts.
  - Cite `[PSI-XX]`.
  - Distinguish findings vs. hypotheses vs. gaps.
  - State insufficient evidence explicitly.
- Answer the original question, not the sub-queries.
- Do not expose tool internals.

### `main.py`

- `run_agent(message, conversation_id=None) -> dict`
- Uses the shared Mistral client and shared MCP session.
- Flow:
  1. Load conversation history.
  2. Call Mistral with system prompt + history + user message + MCP-derived tool schemas.
  3. If tool calls → execute via MCP.
  4. Feed results back to Mistral.
  5. Repeat up to `MAX_TOOL_ROUNDS=4`.
  6. Return final answer, deduplicated sources, `used_rag`, `conversation_id`.
- `used_rag=true` only when the research search tool was invoked.
- In-memory conversation store, bounded history (last ~12 messages).
- Handle unknown tools, MCP errors, Mistral errors safely.
- Async where supported by the SDK.

## 9. FastAPI (`api/`)

### Schemas

```json
// ChatRequest
{ "message": "string", "conversation_id": null }

// ChatResponse
{
  "answer": "string",
  "sources": [{ "source": "PSI-20.md", "chunk_index": 0, "research_id": "PSI-20" }],
  "used_rag": true,
  "conversation_id": "conv-123"
}
```

### Routes

- `POST /api/v1/chat` → `run_agent`
- `GET /health` → status + index chunk count
- Validation errors → 422
- Upstream/MCP/Mistral failures → 502
- Unexpected errors → 500
- No API keys or internal exceptions in responses

### Lifespan

- Load env config.
- Load BM25 index once.
- Open the MCP stdio session once via `AsyncExitStack`.
- Create one shared agent runtime.
- Clean shutdown of the MCP session.

Run:

```bash
uvicorn api.main:app --reload --port 8000
```

## 10. Frontend Connection (final step only)

`js/chat.js` stays untouched until the end.

Final changes:

- `POST http://localhost:8000/api/v1/chat` with `{ message, conversation_id }`.
- Store and reuse `conversation_id` in `sessionStorage`.
- Render `sources` using `research_id` (`PSI-XX`) + chunk index.
- Keep loading state, error handling, Enter-to-send, and Clear.
- Optionally include page/environment context in the message.

The Mistral API key stays only in the Python backend.

## 11. Environment

`.env.example`:

```
API_KEY=your_mistral_api_key
MODEL_NAME=mistral-small-latest

DOCUMENTS_PATH=C:\Users\DELL\Downloads\nasa\md
BM25_INDEX_PATH=./data/bm25_index

CHUNK_SIZE=1000
CHUNK_OVERLAP=150
TOP_K=5

MAX_DECOMPOSITION_QUERIES=4
ENABLE_QUERY_DECOMPOSITION=true

CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
MAX_TOOL_ROUNDS=4
RRF_K=60
```

`.gitignore`:

```
.env
__pycache__/
*.pyc
.pytest_cache/
data/bm25_index/
```

No virtual environment entries needed.

## 12. Dependencies

```
mistralai
mcp
fastapi
uvicorn[standard]
rank-bm25
python-dotenv
pydantic
pytest
httpx
```

Pin versions after installation.

Forbidden: OpenAI SDK, OpenRouter, ChromaDB, Sentence Transformers, embeddings, PyTorch, LangChain, LlamaIndex, PDFs.

## 13. Testing (quick only)

Single file: `tests/test_smoke.py`.

- Ingestion builds an index from temporary Markdown files.
- Reloading the index works.
- Retrieval returns a known chunk.
- Multi-query results deduplicate.
- Malformed decomposition output falls back to the original question.
- API `/health` responds.
- API `/chat` validates and returns the expected shape with a mocked agent.

Run:

```bash
pytest -q
```

No integration test suite, no real Mistral calls in tests.

## 14. Implementation Order

1. Scaffold folders and files.
2. Install dependencies with global pip.
3. Verify `mistral-small-latest` tool calling with a small probe.
4. Extraction → cleaning → chunking.
5. BM25 database → ingestion → retrieval.
6. Query decomposition.
7. MCP server + tools.
8. Prompts + agent.
9. FastAPI + lifespan + CORS.
10. Quick pytest smoke test.
11. Ingest the 9 real PSI documents.
12. Start API and verify:
    - `"who are you?"` → `used_rag: false`
    - Research question → `used_rag: true` and `[PSI-XX]` citations.
13. README with commands and architecture.
14. Final step: connect `js/chat.js` to `/api/v1/chat`.

## 15. Verification Commands

```bash
cd Flame-in-Freefall/nasa-research-agent

pip install -r requirements.txt

python scripts/ingest.py

python -m mcp_server.server

uvicorn api.main:app --reload --port 8000

pytest -q
```

Health check:

```bash
curl http://localhost:8000/health
```

Chat check:

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Who are you?\"}"
```

Research check:

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What did PSI-20 find about burning without airflow?\"}"
```
