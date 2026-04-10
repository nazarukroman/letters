import { Hono } from 'hono';
import db from './db.js';

const words = new Hono();

function buildQuery(list, { random = false, count } = {}) {
  const conditions = ['1=1'];
  const params = [];

  const correct = new Map();
  const present = new Map();
  const absent = new Set();
  const knownLetters = new Set();

  for (const { letter, state, position } of list) {
    const l = letter.toLowerCase();
    if (state === 'correct') {
      if (!correct.has(position)) correct.set(position, new Set());
      correct.get(position).add(l);
      knownLetters.add(l);
    } else if (state === 'present') {
      if (!present.has(position)) present.set(position, new Set());
      present.get(position).add(l);
      knownLetters.add(l);
    } else if (state === 'absent') {
      absent.add(l);
    }
  }

  for (const [pos, letters] of correct) {
    for (const l of letters) {
      conditions.push('n.word LIKE ?');
      params.push('_'.repeat(pos) + l + '_'.repeat(4 - pos));
    }
  }

  for (const [pos, letters] of present) {
    for (const l of letters) {
      conditions.push('n.word NOT LIKE ?');
      params.push('_'.repeat(pos) + l + '_'.repeat(4 - pos));
      conditions.push('n.word LIKE ?');
      params.push(`%${l}%`);
    }
  }

  for (const l of absent) {
    if (!knownLetters.has(l)) {
      conditions.push('n.word NOT LIKE ?');
      params.push(`%${l}%`);
    }
  }

  let sql = `SELECT n.word, n.gender, (g.word IS NOT NULL) AS guessed
    FROM nouns n
    LEFT JOIN guessed g ON g.word = n.word
    WHERE ${conditions.join(' AND ')}`;

  if (random) {
    sql += ' ORDER BY guessed DESC, RANDOM()';
  } else {
    sql += ' ORDER BY guessed DESC, n.word';
  }

  const n = Number(count);
  if (n > 0) sql += ` LIMIT ${n}`;

  return { sql, params };
}

function hasUniqueLetters(word) {
  return new Set(word).size === word.length;
}

words.post('/search', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { list = [], random = true, count = 100 } = body;

  const { sql, params } = buildQuery(list, { random, count });
  const result = await db.execute({ sql, args: params });

  return c.json(result.rows);
});

words.post('/unique', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { list = [], count } = body;

  const absentList = list.map((p) => ({
    letter: p.letter,
    position: p.position,
    state: 'absent',
  }));

  const { sql, params } = buildQuery(absentList, { count });
  const result = await db.execute({ sql, args: params });
  const filtered = result.rows.filter((row) => hasUniqueLetters(row.word));

  return c.json(filtered);
});

words.post('/guess', async (c) => {
  const { word } = await c.req.json().catch(() => ({}));
  if (!word) return c.json({ error: 'word is required' }, 400);

  await db.execute({
    sql: `INSERT OR IGNORE INTO guessed (word) VALUES (?)`,
    args: [word.toLowerCase()],
  });

  return c.json({ ok: true });
});

words.delete('/guess/:word', async (c) => {
  const word = c.req.param('word');

  await db.execute({
    sql: 'DELETE FROM guessed WHERE word = ?',
    args: [word.toLowerCase()],
  });

  return c.json({ ok: true });
});

export default words;
