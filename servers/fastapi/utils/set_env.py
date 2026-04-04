import os


def set_temp_directory_env(value):
    os.environ["TEMP_DIRECTORY"] = value


def set_user_config_path_env(value):
    os.environ["USER_CONFIG_PATH"] = value


def set_llm_provider_env(value):
    os.environ["LLM"] = value


def set_ollama_url_env(value):
    os.environ["OLLAMA_URL"] = value


def set_ollama_model_env(value):
    os.environ["OLLAMA_MODEL"] = value


def set_image_provider_env(value):
    os.environ["IMAGE_PROVIDER"] = value


def set_disable_image_generation_env(value):
    os.environ["DISABLE_IMAGE_GENERATION"] = value


def set_tool_calls_env(value):
    os.environ["TOOL_CALLS"] = value


def set_disable_thinking_env(value):
    os.environ["DISABLE_THINKING"] = value


def set_extended_reasoning_env(value):
    os.environ["EXTENDED_REASONING"] = value


def set_comfyui_url_env(value):
    os.environ["COMFYUI_URL"] = value


def set_comfyui_workflow_env(value):
    os.environ["COMFYUI_WORKFLOW"] = value


def set_flux_url_env(value):
    os.environ["FLUX_URL"] = value
