import logging
import os

from services.image_providers.factory import get_image_provider
from services.image_providers.base import BaseImageProvider
from utils.image_provider import is_image_generation_disabled
from models.image_prompt import ImagePrompt
from models.sql.image_asset import ImageAsset

logger = logging.getLogger(__name__)

PLACEHOLDER = "/static/images/placeholder.jpg"


class ImageGenerationService:
    def __init__(self, output_directory: str):
        self.output_directory = output_directory
        self._disabled = is_image_generation_disabled()
        self._provider: BaseImageProvider | None = (
            None if self._disabled else get_image_provider()
        )

    async def generate_image(self, prompt: ImagePrompt) -> str | ImageAsset:
        """
        Generates an image based on the provided prompt.
        - If image generation is disabled or provider is unavailable, returns a placeholder.
        - Output directory is used for saving the generated image.
        """
        if self._disabled:
            logger.info("Генерация изображений отключена, используется заглушка")
            return PLACEHOLDER

        if not self._provider:
            logger.warning("Провайдер изображений не инициализирован, используется заглушка")
            return PLACEHOLDER

        image_prompt = prompt.get_image_prompt(with_theme=True)
        logger.info("Генерация изображения: %s", image_prompt)

        try:
            image_path = await self._provider.generate(image_prompt, self.output_directory)

            if image_path.startswith("http"):
                return image_path

            if os.path.exists(image_path):
                return ImageAsset(
                    path=image_path,
                    is_uploaded=False,
                    extras={
                        "prompt": prompt.prompt,
                        "theme_prompt": prompt.theme_prompt,
                    },
                )

            raise FileNotFoundError(f"Image not found at {image_path}")

        except Exception as e:
            logger.exception("Ошибка генерации изображения: %s", e)
            return PLACEHOLDER
