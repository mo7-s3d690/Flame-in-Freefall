# NASA Research Agent

An AI-assisted research agent for the **2026 NASA Space Apps Challenge: "Flame in Freefall"**.
It answers questions about NASA's microgravity combustion research using a local BM25
index over Markdown documents, exposed through FastAPI and a persistent JavaScript chat panel.

## Architecture

```
JavaScript frontend
        │
        ▼
FastAPI (api/main.py)  ──►  Agent (agent/main.py)  ──►  Mistral-compatible LLM
        │                          │
        │                          ▼
        │                    MCP client (stdio)
        │                          │
        │                          ▼
        │                    MCP server (mcp_server/server.py)
        │                          │
        │                          ├── search_nasa_research  ──► query decomposition
        │                          │                              └── BM25 retrieval (RRF)
        │                          └── get_research_document
        │
        ▼
BM25 index (data/bm25_index/index.json)  ◄──  scripts/ingest.py  ◄──  data/documents/*.md
```

Request lifecycle:

```
Frontend → FastAPI → Agent → Mistral decides whether research is needed
  → MCP tool call → query decomposition (when needed)
  → multiple BM25 searches → RRF merge + dedup
  → MCP result → Mistral final answer → FastAPI → Frontend
```

## Folder responsibilities

| Folder | Purpose |
|---|---|
| `agent/` | System prompt, query decomposition, Mistral/OpenAI-compatible orchestration |
| `rag/` | Markdown extraction, cleaning, chunking, BM25 database, ingestion, retrieval |
| `mcp_server/` | MCP server exposing `search_nasa_research` and `get_research_document` |
| `api/` | FastAPI app, routes, Pydantic schemas |
| `scripts/` | Document ingestion CLI |
| `data/bm25_index/` | Generated BM25 index (git-ignored) |
| `tests/` | Quick smoke tests |

## How Markdown extraction works

`rag/extraction.py` reads each `.md` file as UTF-8 and returns the text unchanged.
Headings, tables, lists, numbers, URLs and code blocks are preserved. Unreadable
files raise `ExtractionError` instead of being silently ignored.

## How cleaning works

`rag/cleaning.py` does the minimum:

- normalize `\r\n` / `\r` to `\n`
- remove trailing spaces (outside fenced code blocks)
- collapse three or more blank lines to two

It never changes the meaning of the source document.

## How chunking works

`rag/chunking.py` uses character windows with preferred break points:

1. paragraph break (`\n\n`)
2. sentence end
3. line break
4. whitespace
5. hard cut (last resort)

Markdown tables are atomic: a boundary is never placed inside a table, so a table
may make a chunk slightly longer than `CHUNK_SIZE`. Defaults: `CHUNK_SIZE=1000`,
`CHUNK_OVERLAP=150`.

## What BM25 is

BM25 (Okapi BM25) is a lexical ranking function. It scores a document by how
often the query terms appear in it, adjusted by document length and term rarity
(inverse document frequency). No embeddings, no vector database, no GPU.

## How BM25 indexing works

`rag/database.py` builds a `BM25Okapi` index from the tokenized corpus and saves
it to `data/bm25_index/index.json` together with the chunks, their tokens, source
metadata and a SHA-256 hash of every source document. On startup the saved tokens
are loaded and the BM25 object is rebuilt in memory. The index is not rebuilt
for every request.

## How the local index is saved and loaded

- Save: `scripts/ingest.py` calls `ingest_documents()`, which writes the index
  atomically (temp file + replace).
- Load: `load_index()` reads the JSON, validates it, and rebuilds `BM25Okapi`.
- Missing index: retrieval returns an empty list and `/health` reports `chunks: 0`.

## What query decomposition is

`agent/query_decomposition.py` uses the LLM to split a complex question into 2-4
focused sub-queries. A simple question is returned unchanged. Decomposition is
optional (`ENABLE_QUERY_DECOMPOSITION`) and falls back to the original question
on any failure.

## When decomposition is used

Only inside the MCP `search_nasa_research` tool, i.e. only when the agent decides
research retrieval is needed. Greetings and general conversation never trigger it.

## How multiple BM25 results are merged

Each sub-query is searched independently. The ranked lists are merged with
**Reciprocal Rank Fusion**:

```
score(d) = sum over queries of 1 / (RRF_K + rank_q(d))     (RRF_K = 60)
```

A chunk found by several sub-queries ranks higher than one found by a single
query. Results are deduplicated by stable chunk ID, and `matched_queries` is
preserved.

## What Reciprocal Rank Fusion does

RRF combines rankings from independent searches without comparing raw scores,
which are not comparable across queries. It only needs the rank position of each
result, so it is robust and needs no extra model.

## How MCP connects the Agent to research tools

The MCP server (`mcp_server/server.py`) runs over stdio and exposes two tools:

- `search_nasa_research(query, top_k)` — decomposition + BM25 + RRF
- `get_research_document(source)` — all chunks of one document, in order

FastAPI opens one MCP session in its lifespan and reuses it for every request.
The agent converts the MCP tool schemas into LLM tool schemas and executes calls
through the session.

## How tool calling works

The agent sends the system prompt, conversation history and user message to the
LLM with the MCP tool schemas. The LLM either answers directly (greetings,
general chat) or requests a tool call. The agent executes the tool through MCP,
feeds the result back, and lets the LLM produce the final answer. Tool rounds are
limited (`MAX_TOOL_ROUNDS=4`) to prevent infinite loops.

## How FastAPI connects to JavaScript

- `POST /api/v1/chat` accepts `{ "message", "conversation_id" }` and returns
  `{ "answer", "sources", "used_rag", "conversation_id" }`.
- `GET /health` reports status, document count and chunk count.
- CORS is configured for local development origins.

## Installation

```bash
cd Flame-in-Freefall/nasa-research-agent
pip install -r requirements.txt
```

No virtual environment is required; dependencies are installed with the system
Python (3.11+).

## Configure .env

Copy `.env.example` to `.env` and set at least:

```
API_KEY=your_api_key
API_BASE_URL=https://openrouter.ai/api/v1
MODEL_NAME=deepseek/deepseek-v4.1-flash-1017
DOCUMENTS_PATH=C:\Users\DELL\Downloads\nasa\md
```

## Ingest documents

```bash
python scripts/ingest.py
```

This reads every `*.md` in `DOCUMENTS_PATH`, chunks them, and writes
`data/bm25_index/index.json`. Re-running skips unchanged files.

## Start the MCP server (standalone)

```bash
python -m mcp_server.server
```

## Start FastAPI

```bash
uvicorn api.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Test the API

```bash
curl http://localhost:8000/health

curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Who are you?"}'

curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What did PSI-20 find about burning without airflow?"}'
```

The first request returns `used_rag: false`. The second returns `used_rag: true`
with `[PSI-20]` citations and source references.

## Run tests

```bash
pytest -q
```

## Add or update research documents

1. Place a new `PSI-XX.md` file in the documents directory.
2. Run `python scripts/ingest.py`.
3. Changed files are re-chunked; unchanged files are skipped; removed files are
   pruned from the index.

## JavaScript integration example

```javascript
async function sendMessage(message, conversationId = null) {
  const response = await fetch("http://localhost:8000/api/v1/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });
  if (!response.ok) throw new Error("Agent request failed");
  const result = await response.json();
  console.log(result.answer);
  console.log(result.sources);
  console.log(result.used_rag);
  console.log(result.conversation_id);
  return result;
}
```

Store and reuse `result.conversation_id` to keep a conversation across requests.

## Notes

- The API key lives only in the Python backend. Never expose it in JavaScript.
- `data/bm25_index/` is git-ignored; each developer runs ingestion once.
- The frontend (`js/chat.js`) still uses the original `/api/chat` contract and will
  be connected to `/api/v1/chat` in the final integration step.
