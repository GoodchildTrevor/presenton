import os
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


def _get_models_whitelist() -> list[str] | None:
    """Return list of model names from MODELS_FOR_USERS env, or None if not set / empty."""
    raw = os.environ.get("MODELS_FOR_USERS", "").strip()
    if not raw:
        return None
    return [m.strip() for m in raw.split(",") if m.strip()]


def _get_default_model() -> str | None:
    """Return OLLAMA_MODEL env value, or None if not set."""
    return os.environ.get("OLLAMA_MODEL", "").strip() or None


async def get_available_or_suggested_models() -> List[OllamaModelMetadata]:
    """
    Return list of Ollama models available to users:
    - If MODELS_FOR_USERS is set: only those models that are actually pulled in Ollama.
      Models listed in MODELS_FOR_USERS but not pulled are silently skipped.
    - If MODELS_FOR_USERS is empty / not set: all pulled models are returned.

    The model from OLLAMA_MODEL env is placed first in the list (acts as default).
    """
    try:
        pulled = await list_pulled_ollama_models()
    except Exception:
        return []

    pulled_names: Dict[str, OllamaModelMetadata] = {
        m.name: OllamaModelMetadata(
            label=m.name,
            value=m.name,
            size=_format_size(m.size) if m.size else "Unknown",
        )
        for m in pulled
    }

    whitelist = _get_models_whitelist()

    if whitelist is not None:
        # Keep only whitelisted models that are actually pulled
        candidates = [
            pulled_names[name]
            for name in whitelist
            if name in pulled_names
        ]
    else:
        candidates = list(pulled_names.values())

    # Put default model first
    default_model = _get_default_model()
    if default_model and default_model in pulled_names:
        candidates = [
            pulled_names[default_model],
            *[m for m in candidates if m.value != default_model],
        ]

    return candidates


# Legacy stubs — kept for import compatibility
SUGGESTED_MODELS: List[OllamaModelMetadata] = []
SUPPORTED_OLLAMA_MODELS: Dict[str, OllamaModelMetadata] = {}
