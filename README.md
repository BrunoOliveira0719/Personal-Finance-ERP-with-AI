# Personal Finance ERP

A personal finance system modeled like a small company's financial
management stack — not an expense tracker. It answers: how much do I
generate, how much does my life cost to run, how much surplus do I
generate, how much do I invest, and how does my net worth evolve.

Core reports mirror corporate finance: a Personal DRE (P&L), Cash Flow, and
a Balance Sheet, feeding a single Dashboard with the resulting KPIs
(margins, savings rate, investment rate, break-even income).

## Status

**Phase 1 — Project foundation.** Auth, transactions, reports, and the
dashboard are not implemented yet; see [Roadmap](#roadmap) below. The app
boots, the API exposes `GET /health`, and the web app renders a shell with
a live connectivity check to the API.

## Stack

| Layer | Tech                                                        |
| ----- | ----------------------------------------------------------- |
| API   | NestJS, TypeScript, TypeORM, PostgreSQL, REST               |
| Web   | React, TypeScript, Tailwind CSS, Vite, React Query          |
| Auth  | Google OAuth 2.0 (Sign in with Google), server-side session |
| Infra | Docker, Docker Compose                                      |

## Project structure

```
personal-finance-erp/
├── apps/
│   ├── api/                 NestJS backend
│   │   └── src/
│   │       ├── modules/     domain modules (health, auth, transactions, ...)
│   │       ├── common/      decorators, filters, guards, Money utility
│   │       ├── config/      env validation + typed AppConfigService
│   │       └── database/    TypeORM DataSource + migrations
│   └── web/                 React frontend
│       └── src/
│           ├── components/  shared UI (layout, etc.)
│           ├── pages/       route-level pages
│           ├── features/    feature-specific UI + logic (added per phase)
│           ├── hooks/       shared React hooks
│           ├── services/    typed wrappers around API endpoints
│           └── lib/         api-client, utilities
├── docs/adr/                 architectural decision records
├── docker-compose.yml
└── package.json               npm workspaces root
```

## Local setup

### Prerequisites

- Node.js 20+
- Docker + Docker Compose (recommended), or a local PostgreSQL 16 instance

### 1. Environment variables

```bash
cp .env.example .env
```

Fill in `SESSION_SECRET` (`openssl rand -base64 48`) and the Google OAuth
credentials — see [Google OAuth setup](#google-oauth-setup) below. Every
variable the app reads is documented in `.env.example` and validated at
startup (`apps/api/src/config/env.validation.ts`); the app refuses to boot
if one is missing or malformed.

### 2. Run with Docker Compose

```bash
docker compose up
```

This starts PostgreSQL, the API (`http://localhost:3000`), and the web app
(`http://localhost:5173`).

### 3. Run without Docker

```bash
npm install
npm run dev:api    # http://localhost:3000
npm run dev:web    # http://localhost:5173
```

(Requires a PostgreSQL instance matching your `.env` values.)

### 4. Database migrations

Schema changes are never auto-synced (see `docs/adr/0002-typeorm-migrations.md`).

```bash
npm run migration:run --workspace=apps/api
```

## Google OAuth setup

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** of type "Web application".
3. Add an authorized redirect URI matching `GOOGLE_CALLBACK_URL` in your
   `.env` (default: `http://localhost:3000/auth/google/callback`).
4. Copy the generated Client ID and Client Secret into `.env`.

(The auth module itself lands in Phase 2 — see Roadmap.)

## Running tests

```bash
npm run test:api --workspace=apps/api        # unit tests
npm run test:e2e --workspace=apps/api         # e2e tests (boots the app)
```

## Financial concepts

- **Personal DRE**: Revenue − Direct Costs = Contribution Margin;
  Contribution Margin − Operating Expenses = Operating Result; − Other
  Expenses = Net Result.
- **Costs vs. Expenses**: Costs are directly tied to generating income
  (e.g. commute to work); Expenses are the cost of living (housing, food).
- **Transfers**: money moving between the user's own accounts is never
  income or expense.
- **Savings rate** = amount saved ÷ income. **Investment rate** = amount
  invested ÷ income.
- **Break-even income** = the minimum income needed to cover recurring
  essential expenses; break-even + investment target adds a desired
  investment amount on top.
- All money is stored as integer cents — see `docs/adr/0001-money-as-integer-cents.md`.

## Architectural decisions

See [`docs/adr/`](./docs/adr) for the reasoning behind key choices
(currently: money representation, migrations-only schema policy). New
decisions are added here as the project progresses.

## Documentation

- [Development guide](./docs/development.md)
- [API and Swagger](./docs/api.md)
- [Database and migrations](./docs/database.md)
- [Frontend](./docs/frontend.md)

## Roadmap

**Current state — foundation through planning.** The app includes Google
OAuth/session authentication, accounts, transactions, categories, cost
centers, reports, dashboard summaries, budgets, financial goals, investments,
activity history, and strategic/tactical planning. Phase 9 hardening remains
the current focus: testing, security review, documentation, and operational
polish.

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Project foundation | Implemented |
| 2 | Google OAuth and session authentication | Implemented |
| 3 | Accounts and transactions | Implemented |
| 4 | Categories and cost centers | Implemented |
| 5 | DRE, cash flow, and balance sheet reports | Implemented |
| 6 | Dashboard and financial KPIs | Implemented |
| 7 | Budgets, goals, and strategic/tactical planning | Implemented |
| 8 | Investments | Foundation implemented |
| 9 | Testing hardening, security review, documentation, and polish | Current |
