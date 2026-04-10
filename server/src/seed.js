import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../db/words.db');
const WORDS_PATH = join(__dirname, '../../db/words.tsv');

const db = createClient({ url: `file:${DB_PATH}` });

await db.execute('DROP TABLE IF EXISTS nouns');
await db.execute(`
  CREATE TABLE nouns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    gender TEXT
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS guessed (
    word TEXT PRIMARY KEY,
    guessed_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const content = readFileSync(WORDS_PATH, 'utf-8');
const lines = content.trim().split('\n');

const BATCH_SIZE = 500;
let batch = [];
let count = 0;

for (const line of lines) {
  const [word, gender] = line.split('\t');
  if (!word) continue;

  batch.push({
    sql: 'INSERT INTO nouns (word, gender) VALUES (?, ?)',
    args: [word, gender || null],
  });
  count++;

  if (batch.length >= BATCH_SIZE) {
    await db.batch(batch);
    batch = [];
  }
}

if (batch.length > 0) {
  await db.batch(batch);
}

await db.execute('CREATE INDEX IF NOT EXISTS idx_nouns_word ON nouns (word)');

console.log(`Inserted ${count} words`);
console.log(`Database created at ${DB_PATH}`);

db.close();
