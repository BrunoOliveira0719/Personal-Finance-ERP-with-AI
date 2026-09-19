# Frontend

## Stack and structure

The frontend is a Vite + React + TypeScript application using Tailwind CSS and TanStack Query.

- `src/App.tsx`: route map and authentication gate
- `src/components/`: shared shell and auth UI
- `src/pages/`: route-level screens
- `src/services/`: typed API wrappers
- `src/hooks/`: shared React hooks
- `src/lib/api-client.ts`: fetch wrapper with credentials and API errors

## Routes

| Route                | Screen                                     |
| -------------------- | ------------------------------------------ |
| `/` and `/dashboard` | KPI dashboard and API status               |
| `/accounts`          | Create and list accounts                   |
| `/transactions`      | Record and list transactions               |
| `/categories`        | Manage categories and cost centers         |
| `/reports`           | DRE, cash flow and balance sheet summaries |
| `/budgets`           | Budget records                             |
| `/goals`             | Financial goal progress                    |
| `/investments`       | Portfolio positions and totals             |
| `/settings`          | Profile and sign-out                       |

## Authentication

`AuthGate` calls `GET /auth/me` on startup. A 401 response renders the Google sign-in screen; other errors render a session error. Login navigates to `/auth/google`, and all fetches use `credentials: 'include'` so the httpOnly session cookie is sent.

## Local development

```powershell
npm.cmd install
npm.cmd run dev:web
```

The Vite server runs at `http://localhost:5173`. Set `VITE_API_URL` when the API is not at `http://localhost:3000`.

## Validation

```powershell
npm.cmd run build:web
npm.cmd run lint:web
```

Money is formatted for display in the UI but sent to the API as integer cents. Do not use `parseFloat` as a storage representation for monetary values.
