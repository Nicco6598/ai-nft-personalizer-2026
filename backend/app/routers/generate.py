"""
generate.py  –  /generate endpoint (stub)

Accepts a multipart form with:
  - image: UploadFile  (the user's 2D image)
  - style_prompt: str  (optional style description)

Returns a mock response for now. The Tripo AI + Groq integration
will be added in the next step of development.
"""

import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

from app.services.groq_service import generate_nft_metadata

router = APIRouter()


# ── Response schema ───────────────────────────────────────────────────────────

class NftAttribute(BaseModel):
    trait_type: str
    value: str


class NftMetadata(BaseModel):
    name: str
    description: str
    image: str
    model_url: str
    attributes: list[NftAttribute]


class GenerateResponse(BaseModel):
    task_id: str
    model_url: str
    metadata: NftMetadata


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/generate", response_model=GenerateResponse)
async def generate_nft(
    image: UploadFile = File(..., description="2D input image (PNG/JPG/WEBP)"),
    style_prompt: str = Form("", description="Optional style description"),
) -> GenerateResponse:
    """
    Generates a 3D NFT from a 2D image + dynamic metadata from Groq.
    """
    if image.content_type not in ("image/png", "image/jpeg", "image/webp"):
        raise HTTPException(
            status_code=422,
            detail="Unsupported image format. Use PNG, JPEG, or WEBP.",
        )

    task_id = str(uuid.uuid4())

    # 1. Generate Metadata using Groq
    ai_metadata = await generate_nft_metadata(style_prompt)

    # 2. TODO: Call Tripo AI API for 3D model
    mock_model_url = f"https://example.com/models/{task_id}.glb"
    
    # 3. Combine Metadata
    final_metadata = NftMetadata(
        name=ai_metadata.get("name", f"NFT_{task_id[:8]}"),
        description=ai_metadata.get("description", "A unique 3D generated asset."),
        image=f"https://example.com/thumbnails/{task_id}.png", # Will be IPFS/S3
        model_url=mock_model_url,
        attributes=[NftAttribute(**attr) for attr in ai_metadata.get("attributes", [])]
    )

    return GenerateResponse(
        task_id=task_id,
        model_url=mock_model_url,
        metadata=final_metadata,
    )

