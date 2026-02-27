import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_nft_metadata(style_prompt: str = ""):
    """
    Generates creative NFT metadata (name, description, attributes) 
    using Groq Llama 3.3 70B.
    """
    
    system_prompt = (
        "You are an expert NFT creative director. Your task is to generate compelling, "
        "high-concept metadata for a 3D NFT based on a user's style preference. "
        "You must return the response in strict JSON format with the following keys: "
        "'name', 'description', 'attributes'. "
        "Attributes should be a list of objects with 'trait_type' and 'value'. "
        "Keep the tone technical, cybertech, and high-end."
    )
    
    user_message = (
        f"Generate metadata for an NFT with this style influence: {style_prompt or 'Futuristic Cybertech'}. "
        "Give it a unique serial-number-like name and 4 technical attributes."
    )
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Fallback metadata
        return {
            "name": "NEURAL_LINK_#001",
            "description": "A high-fidelity synthetic entity synthesized from raw data streams.",
            "attributes": [
                {"trait_type": "Origin", "value": "Neural Core"},
                {"trait_type": "Rarity", "value": "Unknown"},
                {"trait_type": "Type", "value": "Synthetic"},
                {"trait_type": "Material", "value": "Obsidian Glass"}
            ]
        }
