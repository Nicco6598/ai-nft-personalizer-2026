"""
health.py  –  /health endpoint

Simple liveness check used by Render.com health-check pings
and by the frontend to confirm the API is reachable.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    version: str


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Returns API status. Used by hosting platforms and the frontend."""
    return HealthResponse(status="ok", version="0.1.0")
