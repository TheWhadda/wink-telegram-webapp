export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return res.status(500).json({
      error: 'WEBHOOK_URL и WEBHOOK_SECRET должны быть заданы в переменных окружения.',
    });
  }

  const { movieName } = req.body || {};

  if (!movieName || typeof movieName !== 'string') {
    return res.status(400).json({ error: 'Передайте movieName в теле запроса.' });
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhookSecret,
      },
      body: JSON.stringify({ movieName }),
    });

    const webhookData = await webhookResponse.json();

    if (!webhookResponse.ok) {
      return res.status(webhookResponse.status).json({
        error: webhookData?.error || 'Ошибка вебхука.',
      });
    }

    return res.status(200).json({ imageUrl: webhookData.imageUrl });
  } catch {
    return res.status(502).json({ error: 'Не удалось связаться с вебхуком.' });
  }
}
