from enums.image_provider import ImageProvider
from enums.llm_provider import LLMProvider
from utils.get_env import (
    get_can_change_keys_env,
    get_flux_url_env,
    get_ollama_model_env,
)
from utils.llm_provider import is_ollama_selected
from utils.ollama import pull_ollama_model
from utils.image_provider import (
    get_selected_image_provider,
    is_image_generation_disabled,
)


async def check_llm_and_image_provider_api_or_model_availability():
    can_change_keys = get_can_change_keys_env() != "false"
    if not can_change_keys:
        if is_ollama_selected():
            ollama_model = get_ollama_model_env()
            if not ollama_model:
                raise Exception("OLLAMA_MODEL must be provided")

            # Allow any model to be pulled from Ollama
            # Model validation happens dynamically when listing available models
            print("-" * 50)
            print("Pulling model: ", ollama_model)
            async for event in pull_ollama_model(ollama_model):
                print(event)
            print("Pulled model: ", ollama_model)
            print("-" * 50)

        # Skip image provider and API key checks if image generation is disabled
        if is_image_generation_disabled():
            return

        # Check for Image Provider and API keys
        selected_image_provider = get_selected_image_provider()
        if not selected_image_provider:
            raise Exception("IMAGE_PROVIDER must be provided")

        if selected_image_provider == ImageProvider.FLUX:
            flux_url = get_flux_url_env()
            if not flux_url:
                raise Exception("FLUX_URL must be provided")
