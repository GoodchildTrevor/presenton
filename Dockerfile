FROM python:3.12-slim-bookworm

COPY resources/certs/eurocement_root_ca.crt /usr/local/share/ca-certificates/
COPY resources/certs/eurocement_issuing_subca.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

COPY resources/apt/sources.list /etc/apt/sources.list

COPY resources/pip.conf /etc/pip.conf

# Install Node.js and npm
RUN apt update && apt install -y \
    nginx \
    curl \
    libreoffice \
    fontconfig \
    chromium

# Install Node.js 20 using NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y npm

# Create a working directory
WORKDIR /app  

# Set environment variables
ENV APP_DATA_DIRECTORY=/app_data
ENV TEMP_DIRECTORY=/tmp/presenton
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install dependencies for FastAPI
RUN pip install aiohttp aiomysql aiosqlite asyncpg fastapi[standard] \
    pathvalidate pdfplumber chromadb sqlmodel \
    anthropic google-genai openai fastmcp dirtyjson
    
# Install dependencies for Next.js
WORKDIR /app/servers/nextjs
COPY cemros-presenton/servers/nextjs/package.json cemros-presenton/servers/nextjs/package-lock.json ./
RUN npm install

# Copy Next.js app
COPY cemros-presenton/servers/nextjs/ /app/servers/nextjs/

# Build the Next.js app
WORKDIR /app/servers/nextjs
RUN npm run build

WORKDIR /app

# Copy FastAPI
COPY cemros-presenton/servers/fastapi/ ./servers/fastapi/
COPY cemros-presenton/start.js ./

# Copy nginx configuration
COPY cemros-presenton/nginx.conf /etc/nginx/nginx.conf

# Expose the port
EXPOSE 80

# Start the servers
CMD ["node", "/app/start.js"]
