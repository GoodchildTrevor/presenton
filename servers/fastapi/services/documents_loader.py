import mimetypes
import os
import asyncio
import aiofiles
from typing import Optional
import aiohttp
from fastapi import HTTPException

from utils.get_env import get_file_worker_env
from constants.documents import (
    PDF_MIME_TYPES,
    POWERPOINT_TYPES,
    TEXT_MIME_TYPES,
    WORD_TYPES,
)

NON_TEXT_MIME_TYPES = PDF_MIME_TYPES | POWERPOINT_TYPES | WORD_TYPES


class DocumentsLoader:
    """
    Asynchronous document loader supporting multiple file formats.

    This class handles loading text content from various document types
    using either direct file reading for text files or an external file_worker
    API for complex document formats.

    :ivar _file_paths: List of file paths to process
    :ivar _documents: List of extracted text content for each file
    :ivar filework_api_url: URL endpoint for the external file processing service
    """

    def __init__(self, file_paths: list[str]):
        """
        Initialize the document loader with file paths.

        :param file_paths: List of file system paths to documents
        """
        self._file_paths = file_paths
        self._documents: list[str] = []
        self.filework_api_url = get_file_worker_env() or "http://file_worker:8055/filework"

    @property
    def documents(self) -> list[str]:
        """
        Get extracted document texts.

        :return: List of text content extracted from each file, maintaining original order
        """
        return self._documents

    @property
    def images(self) -> list[list[str]]:
        """
        Get extracted images from documents.

        .. note::
            Currently returns empty lists as image extraction is not implemented.

        :return: List of lists containing image references for each document
        """
        return self._images

    async def load_documents(
        self,
        load_text: bool = True,
    ) -> None:
        """
        Load and extract text from all documents asynchronously.

        Processes all files in parallel using asyncio.gather. Text files are read
        directly, while other formats are sent to the file_worker API.

        :param load_text: Whether to extract text content, defaults to True
        :return: None, results are stored in the `documents` property
        .. note::
            Failed files are marked with error messages in the output.
        """
        if not self._file_paths:
            self._documents = []
            self._images = []
            return

        tasks = [
            self._process_single_file(file_path, load_text)
            for file_path in self._file_paths
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        self._documents = []
        self._images = []
        for result in results:
            if isinstance(result, Exception):
                self._documents.append(f"[System Error: {str(result)}]")
            else:
                self._documents.append(result if result else "")
            self._images.append([])

    async def _process_single_file(
        self,
        file_path: str,
        load_text: bool,
    ) -> str:
        """
        Process a single file and extract its text content.

        :param file_path: Path to the file to process
        :param load_text: Whether to extract text content
        :return: Extracted text content or error message
        """
        if not os.path.exists(file_path):
            return f"[Ошибка: файл {file_path} не найден]"

        mime_type = mimetypes.guess_type(file_path)[0]
        if mime_type is None:
            mime_type = self._guess_mime_by_extension(file_path)

        try:
            if mime_type in TEXT_MIME_TYPES:
                return await self.load_text(file_path)
            else:
                return await self._call_filework_api(file_path)
        except Exception as e:
            return f"[Ошибка обработки файла {os.path.basename(file_path)}: {str(e)}]"

    async def load_text(self, file_path: str) -> str:
        """
        Read text files directly.

        Attempts to read with UTF-8 encoding first, then falls back to other
        common encodings if decoding fails.

        :param file_path: Path to the text file
        :return: File content or error message
        :raises UnicodeDecodeError: Handled internally with fallback encodings
        :raises OSError: Handled internally and returns error message
        """
        try:
            async with aiofiles.open(file_path, "r", encoding="utf-8") as file:
                return await file.read()
        except UnicodeDecodeError:
            encodings = ["cp1251", "iso-8859-1", "koi8-r", "utf-16"]
            for encoding in encodings:
                try:
                    async with aiofiles.open(file_path, "r", encoding=encoding) as file:
                        return await file.read()
                except (UnicodeDecodeError, UnicodeError):
                    continue
            return f"[Ошибка декодирования файла: {file_path}]"
        except OSError as e:
            return f"[Ошибка чтения файла: {str(e)}]"

    async def _call_filework_api(self, file_path: str) -> str:
        """
        Send file to file_worker API and retrieve extracted text.

        :param file_path: Path to the file to process
        :type file_path: str
        :return: Extracted text from the file
        :raises HTTPException: If API request fails or returns error status
        """
        try:
            async with aiofiles.open(file_path, 'rb') as f:
                file_content = await f.read()

            data = aiohttp.FormData()
            data.add_field('file', file_content,
                           filename=os.path.basename(file_path),
                           content_type='application/octet-stream')

            timeout = aiohttp.ClientTimeout(total=60)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(self.filework_api_url, data=data) as resp:
                    if resp.status == 200:
                        return await resp.text()
                    else:
                        error_text = await resp.text()
                        raise HTTPException(
                            status_code=resp.status,
                            detail=f"Filework API error ({resp.status}): {error_text}"
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

    def _guess_mime_by_extension(self, file_path: str) -> Optional[str]:
        """
        Guess MIME type based on file extension when mimetypes fails.

        :param file_path: Path to the file
        :return: Detected MIME type or None if unknown
        """
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
            '.rtf': 'application/rtf',
            '.odt': 'application/vnd.oasis.opendocument.text',
        }
        return mime_map.get(ext)

    @classmethod
    async def from_files(cls, file_paths: list[str], **kwargs):
        """
        Factory method to create and load documents in one step.

        :param file_paths: List of file paths to process
        :param kwargs: Additional arguments passed to load_documents()
        :return: Configured and loaded DocumentsLoader instance.

        Example:
            >>> loader = await DocumentsLoader.from_files(["doc.pdf", "doc.txt"])
            >>> print(loader.documents)
        """
        loader = cls(file_paths)
        await loader.load_documents(**kwargs)
        return loader
    
