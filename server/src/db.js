import { createClient } from '@libsql/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_PATH = process.env.DB_PATH || resolve(__dirname, '../../db/words.db');

const db = createClient({ url: `file:${DB_PATH}` });

export default db;
