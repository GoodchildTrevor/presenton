# Presenton — Локальный форк

<p align="center">
  <img src="readme_assets/images/presenton-logo.png" height="90" alt="Presenton Logo" />
</p>

Локальный форк [Presenton](https://github.com/presenton/presenton) для генерации презентаций с помощью ИИ **без внешних сервисов**.

Этот форк ориентирован на полностью локальный запуск: генерация текста, работа с моделями и все вспомогательные сервисы выполняются внутри вашей инфраструктуры. Внешние облачные провайдеры и API-ключи сторонних сервисов здесь не нужны.

---

## Что это такое

Presenton — open-source инструмент для генерации презентаций по текстовому запросу или загруженным документам. Автоматически собирает структуру, контент и оформление слайдов, а также работает как через веб-интерфейс, так и через API.

Этот форк адаптирован под полностью локальное использование:

- только локальные модели и локальные endpoint'ы
- приоритет Ollama и других self-hosted runtime
- без обязательной зависимости от OpenAI, Gemini, Anthropic и других внешних сервисов
- подходит для приватного контура, домашней лаборатории и внутренней инфраструктуры

---

## Отличия от оригинала

Оригинальный Presenton поддерживает как локальные, так и внешние AI-сервисы, включая облачные провайдеры и API-ключи. Этот форк сосредоточен исключительно на локальной инфраструктуре.

| | Оригинал | Этот форк |
|---|---|---|
| OpenAI / Gemini / Anthropic | ✅ | не требуется |
| Ollama (локальные модели) | ✅ | ✅ основной режим |
| Ограничение списка моделей | ❌ | ✅ через `MODELS_FOR_USERS` |
| Русский интерфейс | ❌ | ✅ |
| Внешние image provider'ы | ✅ | не требуются |

---

## Ключевые возможности

- ✅ **Полностью локальный запуск** — никаких внешних API-запросов
- ✅ **Ollama integration** — запуск open-source моделей локально
- ✅ **Управление списком моделей** — whitelist через переменную окружения
- ✅ **Русский интерфейс** — UI переведён на русский язык
- ✅ **Генерация из промпта или документа** — поддержка загрузки файлов
- ✅ **Экспорт в PPTX и PDF** — готовые к использованию форматы
- ✅ **Кастомные HTML-шаблоны** — собственные дизайны на Tailwind CSS
- ✅ **API-режим** — использование как backend-сервис
- ✅ **Docker Ready** — запуск одной командой, поддержка GPU
- ✅ **Open-Source** — Apache 2.0, можно форкать и модифицировать

---

## Быстрый старт

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/GoodchildTrevor/presenton.git
cd presenton
```

### 2. Настройте переменные окружения

Создайте `.env` файл и укажите параметры локального Ollama:

```env
LLM=ollama
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=qwen2.5:14b
MODELS_FOR_USERS=qwen2.5:14b,llama3.1:8b
DISABLE_IMAGE_GENERATION=true
DISABLE_ANONYMOUS_TELEMETRY=true
CAN_CHANGE_KEYS=false
```

### 3. Запустите через Docker Compose

```bash
docker compose up -d --build
```

После запуска откройте http://localhost:5000 в браузере.

---

## Переменные окружения

### Основные

| Переменная | Описание |
|---|---|
| `LLM` | Провайдер LLM. Для локального режима: `ollama` |
| `OLLAMA_URL` | URL вашего Ollama, например `http://ollama:11434` |
| `OLLAMA_MODEL` | Модель по умолчанию, например `qwen2.5:14b` |
| `MODELS_FOR_USERS` | Whitelist моделей для UI через запятую. Если пустая — показываются все доступные модели |
| `CAN_CHANGE_KEYS` | `false` — запрещает изменение настроек в интерфейсе |
| `DISABLE_ANONYMOUS_TELEMETRY` | `true` — отключает анонимную телеметрию |

### Генерация изображений

| Переменная | Описание |
|---|---|
| `DISABLE_IMAGE_GENERATION` | `true` — полностью отключает генерацию изображений на слайдах |
| `IMAGE_PROVIDER` | Провайдер изображений: `comfyui` для локального self-hosted варианта |
| `COMFYUI_URL` | URL вашего ComfyUI сервера |
| `COMFYUI_WORKFLOW` | JSON workflow для ComfyUI |

> **Для полностью локального сценария** рекомендуется установить `DISABLE_IMAGE_GENERATION=true` либо использовать `comfyui` как provider.

---

## Управление моделями

Переменная `MODELS_FOR_USERS` позволяет ограничить список моделей, которые видит пользователь в интерфейсе.

**Логика работы:**
- если `MODELS_FOR_USERS` **пустая** — показываются все модели, доступные в Ollama
- если `MODELS_FOR_USERS` **задана** — показываются только те модели из списка, которые реально установлены в Ollama
- модели, которые есть в списке, но не установлены — тихо игнорируются

**Пример:**
```env
MODELS_FOR_USERS=qwen2.5:14b,llama3.1:8b,mistral:7b
```

---

## Запуск с GPU

Для ускорения Ollama-моделей через NVIDIA GPU необходимо установить [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html), после чего добавить `--gpus=all`:

```bash
docker run -it --name presenton --gpus=all \
  -p 5000:80 \
  -e LLM="ollama" \
  -e OLLAMA_MODEL="qwen2.5:14b" \
  -e DISABLE_IMAGE_GENERATION="true" \
  -e CAN_CHANGE_KEYS="false" \
  -v "./app_data:/app_data" \
  ghcr.io/presenton/presenton:latest
```

---

## API

Presenton поддерживает генерацию презентаций через REST API.

### Генерация презентации

**Endpoint:** `POST /api/v1/ppt/presentation/generate`

```bash
curl -X POST http://localhost:5000/api/v1/ppt/presentation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Введение в машинное обучение",
    "n_slides": 6,
    "language": "Russian",
    "template": "general",
    "export_as": "pptx"
  }'
```

**Ответ:**

```json
{
  "presentation_id": "d3000f96-096c-4768-b67b-e99aed029b57",
  "path": "/app_data/d3000f96-.../presentation.pptx",
  "edit_path": "/presentation?id=d3000f96-..."
}
```

Полная документация API оригинального проекта: [docs.presenton.ai](https://docs.presenton.ai/using-presenton-api)

---

## Стек

| Компонент | Технология |
|---|---|
| Frontend | Next.js |
| Backend | FastAPI |
| Локальные модели | Ollama |
| Контейнеризация | Docker / Docker Compose |

---

## Для кого этот форк

Подойдёт, если вам нужно:

- запускать генерацию презентаций полностью локально
- не отправлять данные во внешние API
- использовать свои self-hosted модели
- развернуть систему во внутреннем контуре
- работать с русифицированным интерфейсом

---

## Оригинальный проект

- GitHub: [presenton/presenton](https://github.com/presenton/presenton)
- Сайт: [presenton.ai](https://presenton.ai)
- Discord: [discord.gg/9ZsKKxudNE](https://discord.gg/9ZsKKxudNE)

---

## Лицензия

Apache 2.0 — см. файл `LICENSE`.
