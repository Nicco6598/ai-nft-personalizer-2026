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
    [STUB] Generates a 3D NFT from a 2D image + optional style prompt.

    Current behaviour: validates input and returns mock data.
    Next step: integrate Tripo AI image-to-3D and Groq style enhancement.
    """
    # Basic validation
    if image.content_type not in ("image/png", "image/jpeg", "image/webp"):
        raise HTTPException(
            status_code=422,
            detail="Unsupported image format. Use PNG, JPEG, or WEBP.",
        )

    task_id = str(uuid.uuid4())

    # TODO: Call Tripo AI API to convert image → 3D model
    # TODO: Call Groq API with style_prompt to enhance metadata description
    # TODO: Upload resulting .glb to Supabase Storage / Pinata

    mock_model_url = f"https://example.com/models/{task_id}.glb"
    mock_metadata = NftMetadata(
        name=f"AI NFT #{task_id[:8].upper()}",
        description=(
            f"A unique 3D NFT generated from your image. "
            f"Style: {style_prompt or 'default'}."
        ),
        image=f"https://example.com/thumbnails/{task_id}.png",
        model_url=mock_model_url,
        attributes=[
            NftAttribute(trait_type="Style", value=style_prompt or "Original"),
            NftAttribute(trait_type="Generator", value="Tripo AI"),
            NftAttribute(trait_type="Enhancer", value="Groq Llama 3.3 70B"),
            NftAttribute(trait_type="Chain", value="Sepolia Testnet"),
        ],
    )

    return GenerateResponse(
        task_id=task_id,
        model_url=mock_model_url,
        metadata=mock_metadata,
    )
