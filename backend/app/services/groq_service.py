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
        "You are an NFT metadata expert. You receive an image and must generate metadata for a 3D NFT collectible.\n"
        "Return ONLY a valid JSON object with exactly these keys: name, description, attributes.\n\n"

        "FIELD RULES:\n"
        "- name: 2-4 words, evocative title, Title Case. "
        "NO codes, NO underscores, NO serial numbers. "
        "Examples: 'Crimson Specter', 'Void Knight', 'Iron Lotus', 'Frozen Tundra', 'Laughing Plush'.\n"
        "- description: 1-2 sentences, poetic and visual. "
        "Capture the essence of what you see — shapes, colors, atmosphere, world.\n"
        "- attributes: exactly 5 items. Each has trait_type and value. "
        "Plain English, no tech jargon, no file formats, no software names.\n\n"

        "TRAIT SELECTION RULES (most important):\n"
        "Choose trait_types that are UNIVERSAL and make sense for ANY subject — a face, a landscape, "
        "a toy, an animal, an object, an abstract shape. NEVER use subject-specific traits.\n\n"

        "FORBIDDEN trait_types (too specific): Eyes, Hair, Skin, Face, Body, Background, Gender, Age, "
        "Species, Breed, Brand, Character, Person, Building, Architecture.\n\n"

        "REQUIRED — pick exactly 5 from this universal set, choosing the most meaningful for the image:\n"
        "  • Mood        — emotional tone (e.g. Melancholic, Fierce, Serene, Playful, Ominous)\n"
        "  • Palette     — dominant color story (e.g. Warm Ember, Arctic Blues, Neon Acid, Monochrome)\n"
        "  • Texture     — surface quality (e.g. Rough Stone, Soft Plush, Metallic Gloss, Organic Grain)\n"
        "  • Atmosphere  — the world this belongs to (e.g. Deep Ocean, Urban Decay, Sacred Forest, Void)\n"
        "  • Era         — time aesthetic (e.g. Ancient, Futuristic, Retro 80s, Medieval, Contemporary)\n"
        "  • Element     — dominant natural/symbolic force (e.g. Fire, Ice, Thunder, Earth, Shadow, Light)\n"
        "  • Form        — shape language (e.g. Angular, Organic, Fluid, Geometric, Chaotic)\n"
        "  • Rarity      — collectible tier (e.g. Common, Uncommon, Rare, Epic, Legendary, Mythic)\n"
        "  • Theme       — conceptual category (e.g. Nature, Warfare, Mythology, Technology, Whimsy)\n"
        "  • Finish      — material treatment (e.g. Matte, Glossy, Iridescent, Weathered, Crystalline)\n\n"

        "EXAMPLE output for a snowy mountain landscape:\n"
        "[{\"trait_type\": \"Mood\", \"value\": \"Desolate\"}, "
        "{\"trait_type\": \"Palette\", \"value\": \"Arctic White\"}, "
        "{\"trait_type\": \"Texture\", \"value\": \"Rough Stone\"}, "
        "{\"trait_type\": \"Atmosphere\", \"value\": \"High Altitude\"}, "
        "{\"trait_type\": \"Era\", \"value\": \"Timeless\"}]\n\n"

        "EXAMPLE output for a cartoon plush toy:\n"
        "[{\"trait_type\": \"Mood\", \"value\": \"Playful\"}, "
        "{\"trait_type\": \"Palette\", \"value\": \"Pastel Rainbow\"}, "
        "{\"trait_type\": \"Texture\", \"value\": \"Soft Plush\"}, "
        "{\"trait_type\": \"Theme\", \"value\": \"Whimsy\"}, "
        "{\"trait_type\": \"Rarity\", \"value\": \"Rare\"}]"
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
