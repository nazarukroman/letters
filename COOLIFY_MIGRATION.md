# Coolify Migration

Steps to deploy this repo as a Coolify-managed resource on the `applications` host
(running Coolify with `Proxy = None`, fronted by external nginx on the `network` host).

## 1. Repo split

This project currently lives inside the `applications` monorepo under `apps/letters/`
but already has its own `.git`. Before migrating:

1. Push this directory as a standalone GitHub repository (e.g. `nazarukroman/letters`).
2. Remove `apps/letters/` from the `applications` repo in a separate commit.
3. In Coolify, the existing GitHub App installation must be granted access to the new
   `letters` repo (Settings -> GitHub App -> Configure -> Repository access).

## 2. compose.yml changes

The current `compose.yml` is built for manual `make build && docker compose up` and
will not work as-is in Coolify. Replace it with:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - 8094:4000
    volumes:
      - letters_db:/app/db
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:4000/ || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  letters_db:
```

Why each change:

- `image: letters` -> `build: .`
  Coolify must build the image from source on every deploy; a local-only tag is not
  available on the Coolify host.
- `container_name: letters` removed
  Coolify assigns its own deterministic container names; a hardcoded one collides.
- `ports: '${SERVER_PORT:-4000}:4000'` -> `8094:4000`
  Port allocation is fixed per app on the `applications` host (see `PORTS.md` in the
  `applications` repo). `8094` is reserved for letters. External nginx on the
  `network` host proxies the public domain to this port.
- `./db/words.db:/app/db/words.db` -> named volume `letters_db:/app/db`
  This is the critical change. The current bind-mount of a single file works only
  because the host happens to have a pre-seeded `db/words.db`. On a clean Coolify
  node that file does not exist, so Docker would create an empty directory in its
  place and the app would crash.

  A named volume mounted on the whole `/app/db` directory triggers Docker's
  "first-time init" behavior: when the volume is empty, Docker copies the contents
  of `/app/db` from the image into the volume on first start. Since the Dockerfile
  runs `pnpm seed` during build, the seeded `words.db` ends up in the image at
  `/app/db/words.db`, then gets copied into the volume on the first deploy. After
  that the volume persists across redeploys and the `guessed` table is preserved.

## 3. Dictionary updates (gotcha)

Once the named volume is populated, Docker will not re-init it, even if a new image
build contains a different seeded `words.db`. Updating `db/words.tsv` and rebuilding
will NOT propagate the new dictionary to the running app.

To roll out a dictionary update:

1. Note that the `guessed` table will be lost (or back it up first via `sqlite3`).
2. Remove the `letters_db` volume on the `applications` host:
   `docker volume rm <project-prefix>_letters_db`
3. Trigger a redeploy in Coolify. The new image's seeded DB will populate the fresh
   volume.

If dictionary updates become frequent, replace this with an entrypoint script that
compares image and volume DB versions and migrates automatically. Not worth it for
the current cadence (dictionary changes ~once a year).

## 4. Coolify resource creation

- Project: `homelab`
- Environment: `production`
- New Resource -> Private Repository (via existing GitHub App)
- Repository: `nazarukroman/letters`
- Branch: `main`
- Build Pack: **Docker Compose**
- Base Directory: `/`
- Docker Compose Location: `/compose.yml` (override default `/docker-compose.yml`)
- Environment Variables: none (all defaults baked into Dockerfile via `ENV`)
- Domains: leave **empty** (Proxy = None, routing handled by external nginx)
- Deploy

## 5. Post-deploy verification

On the `applications` host:

```bash
ss -tlnp | grep 8094
curl -I http://localhost:8094
```

Both should succeed before touching nginx.

## 6. External nginx wiring

On the `network` host, add a new `server` block (do not modify existing ones) that
proxies the letters public domain to `http://<applications-host-ip>:8094`. Reload
nginx with `nginx -t && systemctl reload nginx`.

For a side-by-side cutover, point a temporary subdomain at the new upstream first,
verify, then switch the production domain.

## 7. PORTS.md update

In the `applications` repo, mark letters as active in `PORTS.md`:

| App     | Host port | Container port | Status |
|---------|-----------|----------------|--------|
| letters | 8094      | 4000           | active |

Commit this together with the removal of `apps/letters/` from the monorepo.
