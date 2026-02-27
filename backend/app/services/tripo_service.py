import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

TRIPO_API_KEY = os.getenv("TRIPO_API_KEY")
BASE_URL = "https://api.tripo3d.ai/v2/openapi"

async def create_3d_task(image_content: bytes, model_version: str = "v2.0-20240919"):
    """
    Submits an image-to-3D task to Tripo AI.
    Returns the task_id.
    """
    async with httpx.AsyncClient() as client:
        # 1. Upload/Prepare might not be needed if we send directly, 
        # but Tripo usually wants a pre-signed URL or direct upload metadata.
        # For simplicity in V2, we can often send the image as a task parameter.
        
        headers = {
            "Authorization": f"Bearer {TRIPO_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Note: In a real production scenario, you'd upload the file to S3/Supabase first 
        # and give Tripo a URL. For this MVP, we'll assume direct processing if supported 
        # or mock the orchestrator.
        
        # Real Tripo V2 flow:
        # request => { "type": "image_to_3d", "file": { "type": "png", "data": "base64..." } }
        import base64
        image_b64 = base64.b64encode(image_content).decode("utf-8")
        
        payload = {
            "type": "image_to_3d",
            "model_version": model_version,
            "file": {
                "type": "png", # Simple assumption
                "data": image_b64
            }
        }
        
        response = await client.post(f"{BASE_URL}/task", headers=headers, json=payload)
        
        if response.status_code != 200:
            print(f"Tripo Error: {response.text}")
            return None
            
        data = response.json()
        return data.get("data", {}).get("task_id")

async def wait_for_task(task_id: str, timeout: int = 120):
    """
    Polls Tripo AI for task completion.
    """
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {TRIPO_API_KEY}"}
        
        start_time = asyncio.get_event_loop().time()
        while (asyncio.get_event_loop().time() - start_time) < timeout:
            response = await client.get(f"{BASE_URL}/task/{task_id}", headers=headers)
            if response.status_code == 200:
                data = response.json().get("data", {})
                status = data.get("status")
                
                if status == "success":
                    # Return the model URL (usually a GLB)
                    return data.get("output", {}).get("model")
                elif status == "failed":
                    print(f"Tripo Task Failed: {data.get('error')}")
                    return None
            
            await asyncio.sleep(5) # Poll every 5 seconds
            
        return None
