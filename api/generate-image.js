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

    const rawBody = await webhookResponse.text();
    let webhookData;

    try {
      webhookData = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      webhookData = null;
    }

    if (!webhookResponse.ok) {
      const details = {
        webhookStatus: webhookResponse.status,
        webhookStatusText: webhookResponse.statusText,
        webhookBody: webhookData || rawBody || null,
      };

      console.error('Webhook request failed', details);

      return res.status(webhookResponse.status).json({
        error:
          webhookData?.error ||
          `Ошибка вебхука: ${webhookResponse.status} ${webhookResponse.statusText}`,
        details,
      });
    }

    if (!webhookData?.imageUrl) {
      const details = {
        webhookStatus: webhookResponse.status,
        webhookStatusText: webhookResponse.statusText,
        webhookBody: webhookData || rawBody || null,
      };

      console.error('Webhook success response missing imageUrl', details);

      return res.status(502).json({
        error: 'Вебхук не вернул imageUrl.',
        details,
      });
    }

    return res.status(200).json({ imageUrl: webhookData.imageUrl });
  } catch (error) {
    const details = {
      message: error instanceof Error ? error.message : String(error),
    };

    console.error('Failed to call webhook', details);

    return res.status(502).json({ error: 'Не удалось связаться с вебхуком.', details });
  }
}
