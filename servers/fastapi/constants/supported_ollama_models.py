from typing import Dict, List

from models.ollama_model_metadata import OllamaModelMetadata
from utils.ollama import list_pulled_ollama_models


def _format_size(size_bytes: int) -> str:
    """Format size in bytes to human readable string."""
    if size_bytes >= 1e12:
        return f"{size_bytes / 1e12:.1f}TB"
    elif size_bytes >= 1e9:
        return f"{size_bytes / 1e9:.1f}GB"
    elif size_bytes >= 1e6:
        return f"{size_bytes / 1e6:.1f}MB"
    elif size_bytes >= 1e3:
        return f"{size_bytes / 1e3:.1f}KB"
    return f"{size_bytes}B"


async def get_supported_ollama_models() -> Dict[str, OllamaModelMetadata]:
    """Get supported Ollama models dynamically from the Ollama instance."""
    try:
        pulled_models = await list_pulled_ollama_models()
        return {
            model.name: OllamaModelMetadata(
                label=model.name,
                value=model.name,
                size=_format_size(model.size) if model.size else "Unknown",
            )
            for model in pulled_models
        }
    except Exception:
        return {}


async def get_supported_ollama_models_list() -> List[OllamaModelMetadata]:
    """Get list of supported Ollama models."""
    models_dict = await get_supported_ollama_models()
    return list(models_dict.values())


async def get_available_or_suggested_models() -> List[OllamaModelMetadata]:
    """Get available models from Ollama, or empty list if none are pulled."""
    return await get_supported_ollama_models_list()


SUGGESTED_MODELS: List[OllamaModelMetadata] = []

SUPPORTED_OLLAMA_MODELS: Dict[str, OllamaModelMetadata] = {}
