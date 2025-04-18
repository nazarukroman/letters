import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';

import { registerRoutes } from './routes.js';

const app = new Hono();

registerRoutes(app);

const server = serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
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
