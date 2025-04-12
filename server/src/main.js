import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';

import { registerRoutes } from './routes.js';

const app = new Hono();

registerRoutes(app);

const server = serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});

process.on('SIGTERM', () => {
  console.log('Получен SIGTERM. Завершаем...');
  server.close?.(); // если `serve()` возвращает сервер с методом close()
  process.exit(0); // вручную завершаем процесс
});

process.on('SIGINT', () => {
  console.log('Получен SIGINT (Ctrl+C). Завершаем...');
  server.close?.();
  process.exit(0);
});
