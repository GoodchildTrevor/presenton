# Этап 1: Сборка Next.js
FROM node:20-alpine AS nextjs-builder

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/ \
    && npm config set strict-ssl false

# Копируем package.json
COPY servers/nextjs/package*.json ./

# Устанавливаем зависимости
RUN npm ci --no-audit --no-fund --loglevel=verbose

# Копируем исходный код
COPY servers/nextjs/ ./

# Проверяем доступность next
RUN which next || echo "next не в PATH" && \
    ls -la node_modules/.bin/next || echo "next не в node_modules/.bin" && \
    ls -la node_modules/next/ || echo "папка next не найдена"

# Собираем приложение (пробуем разные варианты)
RUN if [ -f ./node_modules/.bin/next ]; then \
        ./node_modules/.bin/next build; \
    elif command -v npx > /dev/null; then \
        npx next build; \
    elif [ -f package.json ]; then \
        npm run build; \
    else \
        echo "Не удалось найти next или выполнить сборку" && exit 1; \
    fi

# Этап 2: Финальный образ
FROM python:3.12-slim-bookworm

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        nginx \
        libreoffice \
        fontconfig \
        chromium \
        ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Переменные окружения
ENV APP_DATA_DIRECTORY=/app_data \
    TEMP_DIRECTORY=/tmp/presenton \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

# Создаем директорию для Next.js
RUN mkdir -p /app/servers/nextjs

# Копируем собранный Next.js
COPY --from=nextjs-builder /app /app/servers/nextjs/

# Устанавливаем production зависимости в финальном образе
WORKDIR /app/servers/nextjs
RUN npm ci --only=production --no-audit --no-fund

# Python зависимости
WORKDIR /app
RUN pip install --no-cache-dir \
    fastapi[standard] \
    aiohttp \
    aiomysql \
    chromadb \
    openai

COPY servers/fastapi/ ./servers/fastapi/
COPY start.js ./
COPY nginx.conf /etc/nginx/nginx.conf

# Проверяем Next.js
RUN cd /app/servers/nextjs && \
    echo "Next.js version:" && \
    node -e "try { console.log(require('next/package.json').version) } catch(e) { console.log('Error:', e.message) }" && \
    echo "Node modules:" && \
    ls node_modules/ | grep next

RUN mkdir -p /app_data /tmp/presenton
EXPOSE 80

CMD ["node", "/app/start.js"]
