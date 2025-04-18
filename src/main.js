import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';

import { registerRoutes } from './routes.js';

const app = new Hono();

registerRoutes(app);

app.use('*', async (ctx, next) => {
  const { method, url } = ctx.req;
  console.log(`[${new Date().toISOString()}] → ${method} ${url}`);
  await next();
});

const port = parseInt(process.env.CLIENT_PORT, 10) || 3000;

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on http://${info.address}:${info.port}`);
});

process.on('SIGTERM', () => {
  console.log('Получен SIGTERM. Завершаем...');
  server.close?.();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Получен SIGINT (Ctrl+C). Завершаем...');
  server.close?.();
  process.exit(0);
});
