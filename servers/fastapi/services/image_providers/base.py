from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ImageProviderConfig:
    url: str
    extra_params: dict[str, Any] = field(default_factory=dict)
    timeout: int = 300


class BaseImageProvider(ABC):
    def __init__(self, config: ImageProviderConfig):
        self.config = config

    @abstractmethod
    async def generate(self, prompt: str, output_directory: str) -> str:
        ...
