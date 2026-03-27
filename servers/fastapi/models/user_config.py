from typing import Optional
from pydantic import BaseModel


class UserConfig(BaseModel):
    LLM: Optional[str] = None

    # Ollama
    OLLAMA_URL: Optional[str] = None
    OLLAMA_MODEL: Optional[str] = None

    # Image Provider
    DISABLE_IMAGE_GENERATION: Optional[bool] = None
    IMAGE_PROVIDER: Optional[str] = None

    # FLUX
    FLUX_URL: Optional[str] = None

    # Reasoning
    TOOL_CALLS: Optional[bool] = None
    DISABLE_THINKING: Optional[bool] = None
    EXTENDED_REASONING: Optional[bool] = None

    # Web Search
    WEB_GROUNDING: Optional[bool] = None
