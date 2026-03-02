"""
main.py  –  FastAPI application entry point

Registers all routers and configures CORS to allow the
Next.js frontend (localhost:3000 in dev, Vercel in prod) to call the API.
"""

import os
import time
from collections import defaultdict

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import health, generate

# Expose /docs and /redoc only when explicitly enabled (safe default: off)
_ENABLE_DOCS = os.getenv("ENABLE_DOCS", "true").lower() == "true"

app = FastAPI(
    title="AI NFT Personalizer 2026 – Backend",
    description="FastAPI backend for image-to-3D NFT generation using Tripo AI + Groq.",
    version="0.1.0",
    docs_url="/docs" if _ENABLE_DOCS else None,
    redoc_url="/redoc" if _ENABLE_DOCS else None,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# Default: localhost only. Set CORS_ORIGINS in .env for production.
# NEVER use "*" together with allow_credentials=True (spec violation + CSRF risk).
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# allow_credentials is only safe when origins are explicitly listed (not wildcard)
_allow_credentials = "*" not in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=_allow_credentials,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

# ── Rate limiting ─────────────────────────────────────────────────────────────
# Simple in-memory sliding window: max RATE_LIMIT requests per WINDOW seconds per IP.
RATE_LIMIT = int(os.getenv("RATE_LIMIT_REQUESTS", "5"))
WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))

_request_log: dict[str, list[float]] = defaultdict(list)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/generate":
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - WINDOW

        # Purge old timestamps
        _request_log[ip] = [t for t in _request_log[ip] if t > window_start]

        if len(_request_log[ip]) >= RATE_LIMIT:
            retry_after = int(WINDOW - (now - _request_log[ip][0]))
            return JSONResponse(
                status_code=429,
                content={"detail": f"Too many requests. Try again in {retry_after}s."},
                headers={"Retry-After": str(max(retry_after, 1))},
            )

        _request_log[ip].append(now)

    return await call_next(request)


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(generate.router, tags=["Generate"])
