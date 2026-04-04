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
    """Get supported Ollama models dynamically from the Ollama instance.
    
    Returns a dictionary of models that are currently pulled/available in Ollama.
    Falls back to popular model suggestions if Ollama is not available.
    """
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
        # Return empty dict if Ollama is not available
        return {}


async def get_supported_ollama_models_list() -> List[OllamaModelMetadata]:
    """Get list of supported Ollama models."""
    models_dict = await get_supported_ollama_models()
    return list(models_dict.values())

SUGGESTED_MODELS = [
    OllamaModelMetadata(label="Llama 3.2:3b", value="llama3.2:3b", size="2GB"),
]


async def get_available_or_suggested_models() -> List[OllamaModelMetadata]:
    """Get available models, or suggested models if none are pulled."""
    models = await get_supported_ollama_models_list()
    if not models:
        return SUGGESTED_MODELS
    return models


SUPPORTED_OLLAMA_MODELS: Dict[str, OllamaModelMetadata] = {}