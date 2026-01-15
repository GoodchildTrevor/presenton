import mimetypes
import os
import asyncio
import aiofiles
from typing import List, Optional, Tuple
import aiohttp
from fastapi import HTTPException
import requests  # для синхронных вызовов

from constants.documents import (
    PDF_MIME_TYPES,
    POWERPOINT_TYPES,
    TEXT_MIME_TYPES,
    WORD_TYPES,
)


class DocumentsLoader:

    def __init__(self, file_paths: List[str]):
        self._file_paths = file_paths
        self._documents: List[str] = []
        self._images: List[List[str]] = []
        self.filework_api_url = "http://localhost:8055/filework"  # или "http://file_worker:8055/filework" для Docker

    @property
    def documents(self):
        return self._documents

    @property
    def images(self):
        return self._images

    async def load_documents(
        self,
        temp_dir: Optional[str] = None,
        load_text: bool = True,
        load_images: bool = False,
    ):
        """If load_images is True, temp_dir must be provided"""

        if load_images and not temp_dir:
            raise ValueError("temp_dir must be provided when load_images is True")

        documents: List[str] = []
        images: List[List[str]] = []

        for file_path in self._file_paths:
            if not os.path.exists(file_path):
                raise HTTPException(
                    status_code=404, detail=f"File {file_path} not found"
                )

            document = ""
            imgs = []

            mime_type = mimetypes.guess_type(file_path)[0]
            
            if mime_type is None:
                # Пробуем определить по расширению
                mime_type = self._guess_mime_by_extension(file_path)
            
            try:
                if mime_type in PDF_MIME_TYPES:
                    document, imgs = await self.load_pdf(
                        file_path, load_text, load_images, temp_dir
                    )
                elif mime_type in TEXT_MIME_TYPES:
                    document = await self.load_text(file_path)
                elif mime_type in POWERPOINT_TYPES:
                    document = await self.load_powerpoint(file_path)
                elif mime_type in WORD_TYPES:
                    document = await self.load_msword(file_path)
                else:
                    # Для неподдерживаемых форматов пробуем через API
                    document = await self._call_filework_api(file_path)
            except Exception as e:
                document = f"[Ошибка обработки файла {os.path.basename(file_path)}: {str(e)}]"

            documents.append(document)
            images.append(imgs)

        self._documents = documents
        self._images = images

    async def load_pdf(
        self,
        file_path: str,
        load_text: bool,
        load_images: bool,
        temp_dir: Optional[str] = None,
    ) -> Tuple[str, List[str]]:
        image_paths = []
        document: str = ""

        if load_text:
            try:
                document = await self._call_filework_api(file_path)
            except Exception as e:
                document = f"[Ошибка API для PDF: {str(e)}]"

        if load_images and temp_dir:
            try:
                image_paths = await self.get_page_images_from_pdf_async(file_path, temp_dir)
            except Exception as e:
                image_paths = [f"[Ошибка извлечения изображений: {str(e)}]"]

        return document, image_paths

    async def load_text(self, file_path: str) -> str:
        """Чтение текстовых файлов напрямую"""
        try:
            async with aiofiles.open(file_path, "r", encoding="utf-8") as file:
                return await file.read()
        except UnicodeDecodeError:
            # Пробуем другие кодировки
            for encoding in ["cp1251", "iso-8859-1", "koi8-r"]:
                try:
                    async with aiofiles.open(file_path, "r", encoding=encoding) as file:
                        return await file.read()
                except:
                    continue
            return f"[Ошибка декодирования файла: {file_path}]"
        except Exception as e:
            return f"[Ошибка чтения файла: {str(e)}]"

    async def load_msword(self, file_path: str) -> str:
        """Загрузка Word документов через API"""
        return await self._call_filework_api(file_path)

    async def load_powerpoint(self, file_path: str) -> str:
        """Загрузка PowerPoint через API"""
        return await self._call_filework_api(file_path)

    async def _call_filework_api(self, file_path: str) -> str:
        """Call the external filework API to extract text from the file"""
        try:
            # Вариант 1: Используем aiohttp с правильным multipart
            data = aiohttp.FormData()
            data.add_field(
                'file',
                open(file_path, 'rb'),
                filename=os.path.basename(file_path),
                content_type='application/octet-stream'
            )
            
            timeout = aiohttp.ClientTimeout(total=60)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(
                    self.filework_api_url,
                    data=data
                ) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        error_text = await response.text()
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Filework API error ({response.status}): {error_text}"
                        )
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Connection error to filework API: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error calling filework API: {str(e)}"
            )

    def _call_filework_api_sync(self, file_path: str) -> str:
        """Синхронная версия для использования в синхронном контексте"""
        try:
            with open(file_path, 'rb') as f:
                response = requests.post(
                    self.filework_api_url,
                    files={'file': f},
                    timeout=60
                )
                
                if response.status_code == 200:
                    return response.text
                else:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Filework API error: {response.text}"
                    )
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Connection error: {str(e)}"
            )

    def _guess_mime_by_extension(self, file_path: str) -> Optional[str]:
        """Определение MIME типа по расширению если mimetypes не справился"""
        ext = os.path.splitext(file_path)[1].lower()
        
        mime_map = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.csv': 'text/csv',
        }
        
        return mime_map.get(ext)

    @classmethod
    def get_page_images_from_pdf(cls, file_path: str, temp_dir: str) -> List[str]:
        """Синхронное извлечение изображений из PDF"""
        try:
            import pdfplumber
            from pathlib import Path
            
            # Создаем директорию если нет
            Path(temp_dir).mkdir(parents=True, exist_ok=True)
            
            images = []
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    try:
                        img = page.to_image(resolution=150)
                        image_path = os.path.join(temp_dir, f"page_{page_num}.png")
                        img.save(image_path)
                        images.append(image_path)
                    except Exception as e:
                        images.append(f"[Ошибка страницы {page_num}: {str(e)}]")
            return images
        except ImportError:
            return ["[Требуется установка pdfplumber]"]
        except Exception as e:
            return [f"[Ошибка извлечения изображений: {str(e)}]"]

    @classmethod
    async def get_page_images_from_pdf_async(cls, file_path: str, temp_dir: str):
        """Асинхронная обертка для извлечения изображений"""
        return await asyncio.to_thread(
            cls.get_page_images_from_pdf, file_path, temp_dir
        )

    @classmethod
    async def from_files(cls, file_paths: List[str], **kwargs):
        """Фабричный метод для удобства"""
        loader = cls(file_paths)
        await loader.load_documents(**kwargs)
        return loader
    