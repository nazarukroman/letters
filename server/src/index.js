import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import words from './words.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = process.env.STATIC_DIR_PATH || resolve(__dirname, '../../client/dist');
const PORT = Number(process.env.SERVER_PORT || 4000);

const indexHtml = readFileSync(resolve(STATIC_DIR, 'index.html'), 'utf-8');

const app = new Hono();

app.route('/api/words', words);

app.use('/assets/*', serveStatic({ root: STATIC_DIR }));

app.get('*', (c) => c.html(indexHtml));

console.log(`Listening on port ${PORT}`);

serve({ fetch: app.fetch, port: PORT });
