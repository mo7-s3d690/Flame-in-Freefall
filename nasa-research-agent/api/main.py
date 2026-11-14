"""FastAPI application with a shared BM25 index and MCP session."""

from __future__ import annotations

import logging
import os
import sys
from contextlib import AsyncExitStack, asynccontextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import AsyncIterator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from agent.main import AgentRuntime, set_runtime
from api.routes import router
from rag.database import load_index

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

logger = logging.getLogger(__name__)


@dataclass
class Settings:
    """Runtime configuration read from environment variables."""

    api_key: str | None
    model: str
    index_dir: Path
    cors_origins: list[str]
    max_tool_rounds: int

    @classmethod
    def from_env(cls) -> "Settings":
        index_value = os.getenv("BM25_INDEX_PATH", "data/bm25_index")
        index_path = Path(os.path.expandvars(index_value)).expanduser()
        if not index_path.is_absolute():
            index_path = PROJECT_ROOT / index_path

        origins_value = os.getenv("CORS_ORIGINS", "*")
        origins = [origin.strip() for origin in origins_value.split(",") if origin.strip()] or ["*"]

        try:
            max_tool_rounds = max(1, int(os.getenv("MAX_TOOL_ROUNDS", "4")))
        except ValueError:
            max_tool_rounds = 4

        return cls(
            api_key=os.getenv("API_KEY") or None,
            model=os.getenv("MODEL_NAME", "mistral-small-latest"),
            index_dir=index_path,
            cors_origins=origins,
            max_tool_rounds=max_tool_rounds,
        )


def _mcp_environment(settings: Settings) -> dict[str, str]:
    env = os.environ.copy()
    env["BM25_INDEX_PATH"] = str(settings.index_dir)
    env["MODEL_NAME"] = settings.model
    if settings.api_key:
        env["API_KEY"] = settings.api_key
    return env


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Load long-lived resources once for the whole application."""
    settings: Settings = app.state.settings

    index = load_index(settings.index_dir / "index.json")
    app.state.index = index
    logger.info(
        "Loaded BM25 index: %d documents, %d chunks",
        len(index.documents),
        len(index.chunks),
    )

    async with AsyncExitStack() as stack:
        parameters = StdioServerParameters(
            command=sys.executable,
            args=["-m", "mcp_server.server"],
            env=_mcp_environment(settings),
            cwd=str(PROJECT_ROOT),
        )

        read, write = await stack.enter_async_context(stdio_client(parameters))
        session = await stack.enter_async_context(ClientSession(read, write))
        await session.initialize()

        llm_client = None
        if settings.api_key:
            from agent.llm import LLMClient

            llm_client = LLMClient(
                api_key=settings.api_key,
                model=settings.model,
                base_url=os.getenv("API_BASE_URL"),
            )
        else:
            logger.warning("API_KEY is not set; chat requests will return 503 until it is configured.")

        runtime = AgentRuntime(
            client=llm_client,
            mcp_session=session,
            model=settings.model,
            max_tool_rounds=settings.max_tool_rounds,
        )
        await runtime.initialize()
        set_runtime(runtime)

        try:
            yield
        finally:
            set_runtime(None)


def create_app() -> FastAPI:
    """Create the FastAPI application."""
    app = FastAPI(
        title="NASA Research Agent",
        version="1.0.0",
        description="BM25 RAG agent over NASA PSI combustion research.",
        lifespan=lifespan,
    )
    app.state.settings = Settings.from_env()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=app.state.settings.cors_origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)

    @app.get("/health")
    async def health(request: Request) -> dict[str, object]:
        index = getattr(request.app.state, "index", None)
        return {
            "status": "ok",
            "documents": len(index.documents) if index is not None else 0,
            "chunks": len(index.chunks) if index is not None else 0,
            "model": request.app.state.settings.model,
        }

    return app


app = create_app()
