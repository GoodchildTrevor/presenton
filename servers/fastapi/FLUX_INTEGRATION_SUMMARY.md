# FLUX Integration Summary

This document summarizes the changes made to integrate FLUX image generation with the presenton application.

## Overview

The FLUX integration allows users to use their own FLUX instance for image generation via the endpoint `http://imgen:8020/generate`.

## Changes Made

### 1. Image Provider Enum (`servers/fastapi/enums/image_provider.py`)

Added FLUX as a new image provider option:

```python
FLUX = "flux"
```

### 2. Image Provider Utility Functions (`servers/fastapi/utils/image_provider.py`)

Added a function to check if FLUX is selected:

```python
def is_flux_selected() -> bool:
    """Check if FLUX is the selected image provider."""
    return get_image_provider_env() == ImageProvider.FLUX.value
```

### 3. Environment Variable Getter (`servers/fastapi/utils/get_env.py`)

Added a function to retrieve the FLUX URL from environment variables:

```python
def get_flux_url_env() -> str | None:
    """Get FLUX_URL environment variable."""
    return os.getenv("FLUX_URL")
```

### 4. Image Generation Service (`servers/fastapi/services/image_generation_service.py`)

Added support for FLUX in the image generation service:

- Imported `is_flux_selected` function
- Added FLUX check in `get_image_gen_func()` method
- Implemented `generate_image_flux()` method that:
  - Retrieves FLUX_URL from environment
  - Sends POST request to the FLUX endpoint with parameters:
    - `prompt`: The image prompt
    - `height`: 1024
    - `width`: 1024
    - `num_inference_steps`: 15
    - `guidance_scale`: 1.2
  - Saves the generated image to the output directory

### 5. Model Availability Check (`servers/fastapi/utils/model_availability.py`)

Added validation for FLUX_URL when FLUX provider is selected:

```python
elif image_provider == ImageProvider.FLUX.value:
    flux_url = get_flux_url_env()
    if not flux_url:
        raise ValueError(
            "FLUX_URL must be provided when using FLUX image provider. "
            "Set the FLUX_URL environment variable to your FLUX instance endpoint."
        )
```

## Usage

To use FLUX for image generation:

1. Set the `IMAGE_PROVIDER` environment variable to `flux`:
   ```bash
   export IMAGE_PROVIDER=flux
   ```

2. Set the `FLUX_URL` environment variable to your FLUX instance endpoint:
   ```bash
   export FLUX_URL=http://imgen:8020/generate
   ```

3. Run the application as usual.

## Testing

A test file `test_flux_simple.py` was created to verify the FLUX integration. The test covers:
- FLUX provider enum
- FLUX check function
- FLUX URL environment variable
- FLUX integration in ImageGenerationService
- FLUX validation in model availability check

## API Compatibility

The FLUX integration follows the ImageGen API specification:
- Endpoint: `/generate`
- Method: POST
- Parameters:
  - `prompt`: Image description (required)
  - `height`: Image height (default: 1024)
  - `width`: Image width (default: 1024)
  - `num_inference_steps`: Number of inference steps (default: 15)
  - `guidance_scale`: Guidance scale (default: 1.2)

## Notes

- The FLUX integration requires a running FLUX instance accessible at the URL specified in `FLUX_URL`
- The implementation handles errors gracefully and falls back to placeholder images if generation fails
- Timeout is set to 300 seconds (5 minutes) for FLUX API calls
