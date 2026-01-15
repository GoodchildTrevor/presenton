#!/usr/bin/env python3
"""
Simple test to verify FLUX integration without requiring all dependencies.
This test only checks the configuration and basic functions.
"""

import os
import sys

# Add the project root to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

def test_flux_enum():
    """Test that FLUX provider is in the enum."""
    from enums.image_provider import ImageProvider
    assert hasattr(ImageProvider, "FLUX")
    assert ImageProvider.FLUX.value == "flux"
    print("✓ FLUX provider is in the enum")

def test_flux_check_function():
    """Test that is_flux_selected function exists and works."""
    from utils.image_provider import is_flux_selected

    # Test with FLUX provider
    with os.environ.update({"IMAGE_PROVIDER": "flux"}):
        assert is_flux_selected() == True
        print("✓ is_flux_selected() returns True when IMAGE_PROVIDER=flux")

    # Test with other providers
    with os.environ.update({"IMAGE_PROVIDER": "dalle3"}):
        assert is_flux_selected() == False
        print("✓ is_flux_selected() returns False when IMAGE_PROVIDER=dalle3")

def test_flux_url_env():
    """Test that FLUX_URL environment variable can be read."""
    from utils.get_env import get_flux_url_env

    test_url = "http://imgen:8020/generate"
    with os.environ.update({"FLUX_URL": test_url}):
        assert get_flux_url_env() == test_url
        print(f"✓ get_flux_url_env() returns '{test_url}'")

    # Test without environment variable
    with os.environ.update({}):
        os.environ.pop("FLUX_URL", None)
        assert get_flux_url_env() is None
        print("✓ get_flux_url_env() returns None when not set")

def test_flux_in_image_generation_service():
    """Test that FLUX is properly configured in ImageGenerationService."""
    from services.image_generation_service import ImageGenerationService
    from utils.image_provider import is_flux_selected

    # Create service instance
    service = ImageGenerationService("/tmp/test")

    # Test with FLUX provider
    with os.environ.update({"IMAGE_PROVIDER": "flux", "FLUX_URL": "http://imgen:8020/generate"}):
        assert is_flux_selected() == True
        print("✓ FLUX provider is recognized")

        # Verify the service has the FLUX generation function
        assert service.image_gen_func is not None
        print("✓ ImageGenerationService has image_gen_func set")

def test_flux_in_model_availability():
    """Test that FLUX is properly validated in model availability check."""
    from utils.model_availability import check_llm_and_image_provider_api_or_model_availability
    import asyncio

    # Test with FLUX provider but no URL - should raise exception
    with os.environ.update({"IMAGE_PROVIDER": "flux"}):
        try:
            asyncio.run(check_llm_and_image_provider_api_or_model_availability())
            assert False, "Should have raised exception for missing FLUX_URL"
        except Exception as e:
            assert "FLUX_URL must be provided" in str(e)
            print("✓ Model availability check validates FLUX_URL")

    # Test with FLUX provider and URL - should pass (no API call)
    with os.environ.update({"IMAGE_PROVIDER": "flux", "FLUX_URL": "http://imgen:8020/generate", "DISABLE_IMAGE_GENERATION": "true"}):
        asyncio.run(check_llm_and_image_provider_api_or_model_availability())
        print("✓ Model availability check passes with FLUX_URL set")

if __name__ == "__main__":
    print("Testing FLUX integration...\n")

    try:
        test_flux_enum()
        test_flux_check_function()
        test_flux_url_env()
        test_flux_in_image_generation_service()
        test_flux_in_model_availability()

        print("\n✅ All FLUX integration tests passed!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
