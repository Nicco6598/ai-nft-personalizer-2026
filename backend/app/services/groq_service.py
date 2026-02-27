import os
import json
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def generate_nft_metadata(
    style_prompt: str = "",
    image_bytes: bytes = b"",
    content_type: str = "image/jpeg",
):
    """
    Generates creative NFT metadata using Groq vision.
    Passes the actual image so the model describes what it sees.
    """

    system_prompt = (
        "You are an NFT creative director. You will receive an image and an optional style description.\n"
        "Look at the image carefully and generate metadata for a 3D NFT collectible based on it.\n"
        "Return ONLY a JSON object with exactly these keys: name, description, attributes.\n\n"
        "STRICT RULES:\n"
        "- name: 2-4 words, evocative title, Title Case. "
        "NO codes, NO underscores, NO serial numbers. "
        "Examples: 'Crimson Specter', 'Void Knight', 'Iron Lotus'.\n"
        "- description: 1-2 sentences, poetic and visual. "
        "Describe what you see in the image — shapes, colors, feeling, world.\n"
        "- attributes: exactly 4 items. Each has trait_type and value — plain English, no tech jargon.\n"
        "  ALLOWED trait_types: Style, Material, Mood, Era, Color Palette, Finish, Rarity, Element, Theme, Form.\n"
        "  FORBIDDEN: polygon count, rendering algorithms, file formats, software names, IDs.\n"
        "  Example: [{\"trait_type\": \"Style\", \"value\": \"Dark Fantasy\"}, "
        "{\"trait_type\": \"Material\", \"value\": \"Obsidian\"}, "
        "{\"trait_type\": \"Mood\", \"value\": \"Ominous\"}, "
        "{\"trait_type\": \"Era\", \"value\": \"Post-Apocalyptic\"}]"
    )

    style_note = (
        f" The user wants this style: \"{style_prompt.strip()}\"."
        if style_prompt.strip()
        else ""
    )
    user_text = f"Look at this image and generate NFT metadata for it.{style_note}"

    # Build messages — include image only if we have bytes
    messages: list = [{"role": "system", "content": system_prompt}]

    if image_bytes:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        messages.append({
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{content_type};base64,{b64}"},
                },
                {"type": "text", "text": user_text},
            ],
        })
        vision_model = "meta-llama/llama-4-scout-17b-16e-instruct"
    else:
        # Fallback: text-only if no image
        messages.append({"role": "user", "content": user_text})
        vision_model = "llama-3.3-70b-versatile"

    try:
        completion = client.chat.completions.create(
            model=vision_model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        return json.loads(completion.choices[0].message.content)

    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "name": "Neon Specter",
            "description": "A luminous 3D entity forged from light and shadow, pulsing with electric energy.",
            "attributes": [
                {"trait_type": "Style", "value": "Cyberpunk"},
                {"trait_type": "Material", "value": "Holographic Glass"},
                {"trait_type": "Mood", "value": "Intense"},
                {"trait_type": "Color Palette", "value": "Neon Teal & Lime"},
            ],
        }
