import os
from typing import Optional

def get_can_change_keys_env():
    return os.getenv("CAN_CHANGE_KEYS")

def get_database_url_env():
    return os.getenv("DATABASE_URL")

def get_app_data_directory_env():
    return os.getenv("APP_DATA_DIRECTORY")

def get_temp_directory_env():
    return os.getenv("TEMP_DIRECTORY")

def get_user_config_path_env():
    return os.getenv("USER_CONFIG_PATH")

def get_llm_provider_env():
    return os.getenv("LLM")

def get_ollama_url_env():
    return os.getenv("OLLAMA_URL")

def get_ollama_model_env():
    return os.getenv("OLLAMA_MODEL")

def get_disable_image_generation_env():
    return os.getenv("DISABLE_IMAGE_GENERATION")

def get_image_provider_env():
    return os.getenv("IMAGE_PROVIDER")

def get_tool_calls_env():
    return os.getenv("TOOL_CALLS")

def get_disable_thinking_env():
    return os.getenv("DISABLE_THINKING")

def get_extended_reasoning_env():
    return os.getenv("EXTENDED_REASONING")

def get_web_grounding_env():
    return os.getenv("WEB_GROUNDING")

def get_flux_url_env() -> Optional[str]:
    return os.getenv("FLUX_URL")
