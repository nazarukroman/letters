# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A 5-letter Russian word guessing game helper (Wordle-style). Users mark letters on a grid with states (correct/present/absent), and the app queries a SQLite database of Russian nouns to show matching words. Auto-searches on every state change.

## Stack

- **Backend:** Node.js, Hono, @libsql/client (SQLite)
- **Frontend:** Preact + @preact/signals, Vite, pure CSS (UniFi-inspired dark theme)
- **Database:** SQLite (seeded from `db/words.tsv`)
- **Monorepo:** pnpm workspaces (`client/`, `server/`)

## Commands

```bash
# Install dependencies
pnpm install

# Seed SQLite database from SQL dump (required before first run)
pnpm seed

# Frontend dev server (port 80, proxies /api to localhost:4000)
pnpm dev

# Backend dev server (port 4000, auto-restart on changes)
pnpm dev:server

# Build frontend
pnpm build

# Docker
make build                # docker build -t letters .
docker compose up -d      # run (single container, no external DB)
```

Run `pnpm dev` and `pnpm dev:server` in parallel for local development.

## Environment Variables

All optional with defaults:
- `SERVER_PORT` — backend port (default 4000)
- `STATIC_DIR_PATH` — path to built frontend (default `client/dist`)
- `DB_PATH` — path to SQLite database (default `db/words.db`)

## Architecture

### Backend (`server/src/`)

Hono server with POST endpoints, serving static frontend:

- `POST /api/words/search` — filters 5-letter nominative nouns by letter constraints. Accepts `{ list, random, count }`. Guessed words are returned first.
- `POST /api/words/unique` — returns words with all unique letters, treating input letters as absent.
- `POST /api/words/guess` — mark a word as guessed. Accepts `{ word }`.
- `DELETE /api/words/guess/:word` — unmark a guessed word.
- `GET *` — serves frontend (index.html fallback + `/assets/*` static files)

**Query building** (`words.js`): `LetterPattern { letter, state, position }` → SQL `LIKE`/`NOT LIKE` clauses. States: correct → `LIKE '_X___'` at position, present → `NOT LIKE` at position + `LIKE '%X%'` anywhere, absent → `NOT LIKE '%X%'`. Letters marked both correct/present and absent are excluded from the absent set.

### Frontend (`client/src/`)

- **State** (`state.js`): `@preact/signals` — `grid` is 6×5 signal array. `activeConstraints` computed from marked cells. `effect()` auto-triggers search with 150ms debounce on constraint changes.
- **Letter state cycle** (click on focused cell): filled → correct → present → absent → filled (no modal).
- **Components**: `Grid.jsx` (input grid + keyboard nav), `Results.jsx` (word list with count).

### Database

`db/words.tsv` — pre-built TSV of ~4000 five-letter Russian common nouns (nominative singular), sourced from OpenCorpora (opencorpora.org, CC BY-SA). `server/src/seed.js` reads it and creates `db/words.db` (SQLite). Tables: `nouns` (`id`, `word`, `gender`) and `guessed` (`word`, `guessed_at`). The `words.db` file is gitignored — run `pnpm seed` to generate it. In Docker, compose bind-mounts the host `db/words.db` so guessed words persist across container restarts.

### Docker

Single-stage build on `node:lts-alpine`: builds frontend, seeds SQLite, copies into runtime image. No external database needed. Single service in compose.
