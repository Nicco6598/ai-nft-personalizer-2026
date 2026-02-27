import asyncio

# ---------------------------------------------------------------------------
# Mock 3D service – returns a placeholder GLB for local development.
# Replace this file with a real provider (Meshy, Tripo, etc.) when ready.
# ---------------------------------------------------------------------------

_MOCK_GLB_URL = (
    "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf"
)


async def create_3d_task(image_content: bytes, content_type: str = "image/jpeg") -> str | None:
    """Returns a fake task_id immediately (no external API call)."""
    await asyncio.sleep(0)  # keep it a proper coroutine
    return "mock-task-local-dev"


async def wait_for_task(task_id: str, timeout: int = 300) -> str | None:
    """Simulates Tripo AI processing time (~5s) so the frontend progress bar completes."""
    await asyncio.sleep(5)
    return _MOCK_GLB_URL
