FROM python:3.11-slim-bookworm

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    libreoffice \
    fontconfig \
    chromium

# Install Node.js 20 using NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Create a working directory
WORKDIR /app  

# Set environment variables
ENV APP_DATA_DIRECTORY=/app_data
ENV TEMP_DIRECTORY=/tmp/presenton
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install FastAPI and other deps
RUN pip install aiohttp aiomysql aiosqlite asyncpg fastapi[standard] \
    pathvalidate pdfplumber chromadb sqlmodel aiofiles \
    anthropic google-genai openai fastmcp dirtyjson

RUN pip install torch --index-url https://download.pytorch.org/whl/cpu

COPY vendor/torchvision-0.25.0+cpu-cp311-cp311-manylinux_2_28_x86_64.whl /tmp/

# Установить torchvision из файла (без сети)
RUN pip install /tmp/torchvision-0.25.0+cpu-cp311-cp311-manylinux_2_28_x86_64.whl

# Install docling (will see already-installed torch)
RUN pip install docling --extra-index-url https://download.pytorch.org/whl/cpu \
    --timeout 600

# Pre-download ChromaDB ONNX embedding model so it's baked into the image
# and never downloaded at container startup
RUN python3 -c "\
from chromadb.utils.embedding_functions.onnx_mini_lm_l6_v2 import ONNXMiniLmL6V2; \
ef = ONNXMiniLmL6V2(); \
ef._download_model_if_not_exists(); \
print('ChromaDB ONNX model cached successfully.')"

# Install dependencies for Next.js
WORKDIR /app/servers/nextjs
COPY servers/nextjs/package.json servers/nextjs/package-lock.json ./

# Skip heavy binary downloads
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CYPRESS_INSTALL_BINARY=0

RUN npm install --loglevel info

# Copy Next.js app
COPY servers/nextjs/ /app/servers/nextjs/

# Build the Next.js app
WORKDIR /app/servers/nextjs
RUN npm run build

WORKDIR /app

# Copy FastAPI
COPY servers/fastapi/ ./servers/fastapi/
COPY start.js LICENSE NOTICE ./

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port
EXPOSE 80

# Start the servers
CMD ["node", "/app/start.js"]
