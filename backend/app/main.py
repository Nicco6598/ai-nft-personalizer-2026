"""
main.py  –  FastAPI application entry point

Registers all routers and configures CORS to allow the
Next.js frontend (localhost:3000 in dev, Vercel in prod) to call the API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, generate

app = FastAPI(
    title="AI NFT Personalizer 2026 – Backend",
    description="FastAPI backend for image-to-3D NFT generation using Tripo AI + Groq.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# In production, replace "*" with your Vercel deployment URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: lock down to Vercel URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(generate.router, tags=["Generate"])
