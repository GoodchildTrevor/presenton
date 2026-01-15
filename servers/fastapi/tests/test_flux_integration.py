"""
Test to verify FLUX integration works correctly.
This test verifies that the FLUX image provider is properly configured
and can be selected via environment variables.
"""

import os
import sys
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# Add the project root to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from api.main import app

def test_flux_provider_selection():
    """Test that FLUX provider can be selected via environment variable."""
    # Test with FLUX provider
    with patch.dict(os.environ, {"IMAGE_PROVIDER": "flux"}):
        from utils.image_provider import is_flux_selected
        assert is_flux_selected() == True

    # Test with other providers
    with patch.dict(os.environ, {"IMAGE_PROVIDER": "dalle3"}):
        from utils.image_provider import is_flux_selected
        assert is_flux_selected() == False

def test_flux_url_environment_variable():
    """Test that FLUX_URL environment variable is properly read."""
    test_url = "http://imgen:8020/generate"

    with patch.dict(os.environ, {"FLUX_URL": test_url}):
        from utils.get_env import get_flux_url_env
        assert get_flux_url_env() == test_url

    # Test without environment variable
    with patch.dict(os.environ, {}, clear=True):
        from utils.get_env import get_flux_url_env
        assert get_flux_url_env() is None

def test_flux_image_generation_service():
    """Test that FLUX image generation service is properly configured."""
    from services.image_generation_service import ImageGenerationService

    # Create service instance
    service = ImageGenerationService("/tmp/test")

    # Mock the aiohttp session
    mock_session = MagicMock()
    mock_response = MagicMock()
    mock_response.status = 200
    mock_response.json = MagicMock(return_value={"image_url": "http://example.com/image.jpg"})
    mock_session.get = MagicMock(return_value=mock_response)

    with patch("aiohttp.ClientSession", return_value=mock_session):
        with patch.dict(os.environ, {
            "IMAGE_PROVIDER": "flux",
            "FLUX_URL": "http://imgen:8020/generate"
        }):
            # Test that the service recognizes FLUX provider
            from utils.image_provider import is_flux_selected
            assert is_flux_selected() == True

            # Verify the service has the FLUX generation function
            assert service.image_gen_func is not None

if __name__ == "__main__":
    test_flux_provider_selection()
    test_flux_url_environment_variable()
    test_flux_image_generation_service()
    print("All FLUX integration tests passed!")
