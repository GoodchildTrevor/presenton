from enums.image_provider import ImageProvider
from utils.get_env import (
    get_disable_image_generation_env,
    get_image_provider_env,
)
from utils.parsers import parse_bool_or_none

def is_image_generation_disabled() -> bool:
    return parse_bool_or_none(get_disable_image_generation_env()) or False

def is_flux_selected() -> bool:
    try:
        return ImageProvider.FLUX == get_selected_image_provider()
    except ValueError:
        # Invalid provider specified
        return False

def get_selected_image_provider() -> ImageProvider | None:
    """
    Get the selected image provider from environment variables.
    Returns:
        ImageProvider: The selected image provider.
    """
    image_provider_env = get_image_provider_env()
    if image_provider_env:
        return ImageProvider(image_provider_env)
    return None
