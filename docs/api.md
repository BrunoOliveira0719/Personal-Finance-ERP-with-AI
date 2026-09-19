# API

## Local URLs

- Base URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/openapi.json`
- Health: `GET /health`

Swagger is generated from the Nest application at startup. The documented authentication scheme is the `finance_session` httpOnly cookie created by the Google OAuth callback.

## Authentication

1. Open `GET /auth/google` in a browser.
2. Google redirects to `GET /auth/google/callback`.
3. The API finds or creates the user and sets `finance_session`.
4. The browser can call `GET /auth/me`.
5. `POST /auth/signout` revokes the server-side session and clears the cookie.

All routes are protected by the global session guard except routes marked `@Public()`: health and the two Google OAuth routes.

## Endpoint groups

| Group        | Routes                                                               | Purpose                        |
| ------------ | -------------------------------------------------------------------- | ------------------------------ |
| Health       | `GET /health`                                                        | API and database status        |
| Auth         | `/auth/google`, `/auth/google/callback`, `/auth/me`, `/auth/signout` | Google OAuth and sessions      |
| Accounts     | `GET/POST /accounts`, `GET /accounts/:id`                            | User-owned financial accounts  |
| Transactions | `GET/POST /transactions`                                             | Income, expenses and transfers |
| Categories   | `GET/POST /categories`                                               | System and user categories     |
| Cost centers | `GET/POST /cost-centers`                                             | User cost centers              |
| Reports      | `GET /reports/dre`, `/reports/cash-flow`, `/reports/balance-sheet`   | Financial reporting            |
| Dashboard    | `GET /dashboard`                                                     | KPI summary                    |
| Budgets      | `GET /budgets`                                                       | Budget records                 |
| Goals        | `GET /financial-goals`                                               | Financial goal progress        |
| Investments  | `GET /investments`                                                   | Investment positions           |

## Validation and errors

DTOs are validated by a global `ValidationPipe` with whitelist and forbid-non-whitelisted enabled. Invalid payloads return a 400 response. Missing or expired sessions return 401. Resources outside the authenticated user's scope return 404 where ownership lookup is required.

## Money contract

Amounts are integer cents at the API and database boundary. For example, `R$ 123,45` is sent as `12345`. Never send floating-point monetary values in `amountCents`, `initialBalanceCents`, `targetAmountCents`, or related fields.
