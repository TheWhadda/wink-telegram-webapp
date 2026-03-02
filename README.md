# Telegram WebApp (Vercel)

Минимальный Telegram WebApp, который:

1. Принимает название фильма.
2. Отправляет запрос на серверный endpoint `/api/generate-image`.
3. Endpoint вызывает внешний webhook из `WEBHOOK_URL` и передаёт заголовок `X-Webhook-Secret` со значением из `WEBHOOK_SECRET`.
4. Получает JSON с `imageUrl`, показывает превью, позволяет увеличить и скачать.

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
3. Выполните деплой.
