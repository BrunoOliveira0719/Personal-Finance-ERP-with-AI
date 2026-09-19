# Development Guide

## Prerequisites

- Node.js 20+
- Docker Desktop with the Linux engine running
- Google OAuth Web Client credentials for sign-in

## Start the project

Create `.env` from `.env.example`, then set the Google credentials and local PostgreSQL port. This workspace uses `5434` because another local container may use `5432`.

```powershell
docker compose up -d postgres
npm.cmd run migration:run --workspace=apps/api
npm.cmd run dev:api
npm.cmd run dev:web
```

Open `http://localhost:5173` and `http://localhost:3000/docs`.

## Google OAuth settings

Authorized JavaScript origin:

```text
http://localhost:5173
```

Authorized redirect URI:

```text
http://localhost:3000/auth/google/callback
```

The `.env` file is ignored by Git. Never commit `GOOGLE_CLIENT_SECRET` or `SESSION_SECRET`.

## Quality gates

```powershell
npm.cmd run test:api -- --runInBand
npm.cmd run test:e2e --workspace=apps/api -- --runInBand
npm.cmd run build:api
npm.cmd run build:web
npm.cmd run lint:api
npm.cmd run lint:web
```

## Troubleshooting

- Docker pipe missing: start Docker Desktop, then retry `docker compose up -d postgres`.
- Port 5432 busy: keep `POSTGRES_HOST_PORT=5434` and use `POSTGRES_PORT=5434` for a locally running API.
- `invalid_client`: verify the Client ID is complete, has no duplicated `.apps.googleusercontent.com`, and restart the API after editing `.env`.
- API says `postgres` cannot be resolved: the API is running outside Docker; use `POSTGRES_HOST=localhost`.
- Frontend says it cannot reach API: verify `http://localhost:3000/health` and restart Vite after changing `VITE_API_URL`.
