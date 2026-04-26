import os
import uuid

import aiohttp

from .base import BaseImageProvider


class FluxImageProvider(BaseImageProvider):
    async def generate(self, prompt: str, output_directory: str) -> str:
        params = {"prompt": prompt, **self.config.extra_params}

        async with aiohttp.ClientSession(trust_env=True) as session:
            async with session.post(
                self.config.url.rstrip("/"),
                json=params,
                timeout=aiohttp.ClientTimeout(total=self.config.timeout),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(
                        f"Image provider request failed [{response.status}]: {error_text}"
                    )

                image_data = await response.read()
                image_path = os.path.join(output_directory, f"{uuid.uuid4()}.png")
                with open(image_path, "wb") as f:
                    f.write(image_data)

                return image_path
