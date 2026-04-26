import json
import os

from .base import BaseImageProvider, ImageProviderConfig
from .flux_provider import FluxImageProvider
from utils.get_env import get_flux_url_env, get_image_provider_env

_PROVIDERS: dict[str, type[BaseImageProvider]] = {
    "flux": FluxImageProvider,
}


def get_image_provider() -> BaseImageProvider:
    name = (get_image_provider_env() or "flux").lower()

    if name not in _PROVIDERS:
        raise ValueError(
            f"Unknown image provider: '{name}'. Available: {list(_PROVIDERS)}"
        )

    url = get_flux_url_env()
    if not url:
        raise ValueError(
            "IMAGE_PROVIDER_URL / FLUX_URL is not set"
        )

    extra_params = json.loads(os.getenv("IMAGE_PROVIDER_PARAMS", "{}"))
    timeout = int(os.getenv("IMAGE_PROVIDER_TIMEOUT", "300"))

    config = ImageProviderConfig(url=url, extra_params=extra_params, timeout=timeout)
    return _PROVIDERS[name](config)
