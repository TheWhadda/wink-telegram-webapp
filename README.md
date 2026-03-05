# Telegram WebApp (Vercel)

Минимальный Telegram WebApp, который:

1. **Генерация баннера** — принимает название фильма, вызывает webhook, получает `imageUrl`, показывает превью с возможностью увеличить и скачать.
2. **Генерация семантики** — принимает название фильма, вызывает отдельный webhook, получает количество ключевых слов и ссылку на Google-таблицу.

## Структура API

| Endpoint | Webhook ENV | Ответ |
|---|---|---|
| `/api/generate-image` | `WEBHOOK_URL` + `WEBHOOK_SECRET` | `{ imageUrl }` |
| `/api/generate-semantics` | `SEMANTICS_WEBHOOK_URL` + `SEMANTICS_WEBHOOK_SECRET` | `{ status, movie, keywords_total, spreadsheet_url }` |

## Локальный запуск

```bash
npm i -g vercel
vercel dev
```

Создайте `.env` на основе `.env.example`.

## Деплой на Vercel

1. Подключите репозиторий в Vercel.
2. Добавьте переменные окружения:
   - `WEBHOOK_URL`
   - `WEBHOOK_SECRET`
   - `SEMANTICS_WEBHOOK_URL`
   - `SEMANTICS_WEBHOOK_SECRET`
3. Выполните деплой.

## Структура файлов

```
├── api/
│   ├── generate-image.js      # Серверный endpoint для баннеров
│   └── generate-semantics.js  # Серверный endpoint для семантики
├── index.html
├── app.js
├── styles.css
├── wink_logo.png
├── vercel.json
└── .env.example
```
