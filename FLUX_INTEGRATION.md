# FLUX Integration Guide

This document explains how to configure and use your own FLUX instance for image generation in Presenton.

## Overview

Presenton now supports using your own FLUX instance for image generation. This allows you to use the `http://imgen:8020/generate` endpoint you specified.

## Configuration

### Environment Variables

Set the following environment variables to configure FLUX:

```bash
# Set the image provider to FLUX
IMAGE_PROVIDER=flux

# Set the URL of your FLUX instance
FLUX_URL=http://imgen:8020/generate
```

### Using Docker Compose

Add these environment variables to your `docker-compose.yml`:

```yaml
environment:
  - IMAGE_PROVIDER=flux
  - FLUX_URL=http://imgen:8020/generate
```

### Using .env file

Create or modify a `.env` file in the project root:

```bash
IMAGE_PROVIDER=flux
FLUX_URL=http://imgen:8020/generate
```

## How It Works

1. **Provider Selection**: The system checks the `IMAGE_PROVIDER` environment variable to determine which image generation service to use.

2. **FLUX Endpoint**: When `IMAGE_PROVIDER=flux` is set, the system will use the URL specified in `FLUX_URL` to generate images.

3. **Image Generation**: The system sends a POST request to your FLUX endpoint with the prompt and receives the generated image URL in response.

## Implementation Details

### Modified Files

1. **`servers/fastapi/enums/image_provider.py`**
   - Added `FLUX` to the `ImageProvider` enum

2. **`servers/fastapi/utils/image_provider.py`**
   - Added `is_flux_selected()` function to check if FLUX is the selected provider

3. **`servers/fastapi/utils/get_env.py`**
   - Added `get_flux_url_env()` function to read the FLUX_URL environment variable

4. **`servers/fastapi/services/image_generation_service.py`**
   - Added `generate_image_flux()` function to handle FLUX image generation
   - Updated service initialization to use FLUX when selected

### FLUX API Requirements

Your FLUX instance should:
- Accept POST requests at the specified URL
- Accept a JSON payload with a `prompt` field and optional parameters
- Return the generated image directly as binary data (PNG format)

Example request:
```json
{
  "prompt": "A beautiful landscape with mountains and a lake",
  "height": 1024,
  "width": 1024,
  "num_inference_steps": 15,
  "guidance_scale": 1.2
}
```

Example response:
- Binary PNG image data

## Testing

A test file has been created to verify the FLUX integration:

```bash
servers/fastapi/tests/test_flux_integration.py
```

This test verifies:
- FLUX provider selection via environment variables
- FLUX URL environment variable reading
- Image generation service configuration

## Troubleshooting

### Common Issues

1. **Connection Errors**: Ensure your FLUX instance is running and accessible at the specified URL
2. **Timeout Issues**: Check network connectivity between the Presenton container and your FLUX instance
3. **Authentication**: If your FLUX instance requires authentication, you may need to extend the implementation

### Debugging

Enable debug logging to see detailed information about image generation:

```bash
LOG_LEVEL=DEBUG
```

## Example Usage

Since you already have an isolated container with ImageGen running, simply configure Presenton to use it:

### Using Environment Variables

Set these environment variables before starting Presenton:

```bash
export IMAGE_PROVIDER=flux
export FLUX_URL=http://imgen:8020/generate
```

### Using .env file

Create or modify a `.env` file in the project root:

```bash
IMAGE_PROVIDER=flux
FLUX_URL=http://imgen:8020/generate
```

### Using Docker Compose

Add these environment variables to your `docker-compose.yml`:

```yaml
environment:
  - IMAGE_PROVIDER=flux
  - FLUX_URL=http://imgen:8020/generate
```

### Starting Presenton

```bash
cd servers/fastapi
uvicorn api.main:app --reload
```

## Support

If you encounter issues with the FLUX integration, please check:
1. Your FLUX instance is running and accessible
2. The URL is correctly formatted (including http:// or https://)
3. The environment variables are properly set
4. Network connectivity between containers/services
