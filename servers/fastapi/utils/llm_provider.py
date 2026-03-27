from fastapi import HTTPException

from enums.llm_provider import LLMProvider
from utils.get_env import (
    get_llm_provider_env,
    get_ollama_model_env,
)


def get_llm_provider():
    try:
        return LLMProvider(get_llm_provider_env())
    except:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid LLM provider. Please select ollama",
        )


def is_ollama_selected():
    return get_llm_provider() == LLMProvider.OLLAMA


def get_model():
    selected_llm = get_llm_provider()
    if selected_llm == LLMProvider.OLLAMA:
        return get_ollama_model_env()
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid LLM provider. Please select ollama",
        )
