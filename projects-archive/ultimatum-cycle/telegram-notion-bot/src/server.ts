import express, { Request, Response } from 'express';
import bot from './bot';
import { logger } from './logger';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/webhook', async (req: Request, res: Response) => {
  // Webhook secret verification (security)
  const webhookSecret = req.headers['x-telegram-bot-api-secret-token'] as string;
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (webhookSecret !== expectedSecret) {
    logger.warn('Unauthorized webhook attempt', {
      ip: req.ip,
      providedSecret: webhookSecret ? 'present' : 'missing'
    });
    return res.sendStatus(403);
  }

  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    logger.error('Webhook handling failed', {
      error: error instanceof Error ? error.message : String(error)
    });
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info('Webhook mode enabled');
});

export default app;
