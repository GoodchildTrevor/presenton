import asyncio
import logging
import os
import aiohttp
import uuid
from utils.get_env import get_flux_url_env
from utils.image_provider import (
    is_image_generation_disabled,
    is_flux_selected,
)
from models.image_prompt import ImagePrompt
from models.sql.image_asset import ImageAsset

logger = logging.getLogger(__name__)


class ImageGenerationService:
    def __init__(self, output_directory: str):
        self.output_directory = output_directory
        self.is_image_generation_disabled = is_image_generation_disabled()
        self.image_gen_func = self.get_image_gen_func()

    def get_image_gen_func(self):
        if self.is_image_generation_disabled:
            return None

        if is_flux_selected():
            return self.generate_image_flux
        return None

    async def generate_image(self, prompt: ImagePrompt) -> str | ImageAsset:
        """
        Generates an image based on the provided prompt.
        - If no image generation function is available, returns a placeholder image.
        - Uses the full image prompt with theme.
        - Output Directory is used for saving the generated image.
        """
        if self.is_image_generation_disabled:
            logger.info("Генерация изображений отключена. Используется изображение-заглушка.")
            return "/static/images/placeholder.jpg"

        if not self.image_gen_func:
            logger.warning("Функция генерации изображений не найдена. Используется изображение-заглушка.")
            return "/static/images/placeholder.jpg"

        image_prompt = prompt.get_image_prompt(with_theme=True)
        logger.info("Запрос на генерацию изображения: %s", image_prompt)

        try:
            image_path = await self.image_gen_func(
                image_prompt, self.output_directory
            )
            if image_path:
                if image_path.startswith("http"):
                    return image_path
                elif os.path.exists(image_path):
                    return ImageAsset(
                        path=image_path,
                        is_uploaded=False,
                        extras={
                            "prompt": prompt.prompt,
                            "theme_prompt": prompt.theme_prompt,
                        },
                    )
            raise Exception(f"Image not found at {image_path}")

        except Exception as e:
            logger.exception("Ошибка при генерации изображения: %s", e)
            return "/static/images/placeholder.jpg"

    async def generate_image_flux(self, prompt: str, output_directory: str) -> str:
        flux_url = get_flux_url_env()
        if not flux_url:
            raise ValueError("FLUX_URL environment variable is not set")

        params = {
            "prompt": prompt,
            "height": 1024,
            "width": 1024,
            "num_inference_steps": 15,
            "guidance_scale": 1.2,
        }

        async with aiohttp.ClientSession(trust_env=True) as session:
            async with session.post(
                flux_url.rstrip("/"),
                json=params,
                timeout=aiohttp.ClientTimeout(total=300),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(
                        f"FLUX API request failed with status {response.status}: {error_text}"
                    )

                image_data = await response.read()
                image_path = os.path.join(output_directory, f"{uuid.uuid4()}.png")
                with open(image_path, "wb") as f:
                    f.write(image_data)

                return image_path
