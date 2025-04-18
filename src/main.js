import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';

import { registerRoutes } from './routes.js';

const app = new Hono();

registerRoutes(app);

const server = serve({ fetch: app.fetch, port: 3000, hostname: '0.0.0.0' }, (info) => {
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
