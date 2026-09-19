# Database

## Local connection

PostgreSQL 16 runs through Docker Compose.

- Host from Windows: `localhost`
- Host port in this workspace: `5434`
- Container port: `5432`
- Database: `personal_finance_erp`

The host port is configurable with `POSTGRES_HOST_PORT`. The API uses `POSTGRES_PORT=5434` when running directly on Windows and overrides it to `5432` inside the API container, where the hostname is `postgres`.

## Schema ownership

TypeORM migrations are the source of truth. `synchronize` is permanently disabled. Apply migrations with:

```powershell
npm.cmd run migration:run --workspace=apps/api
```

Revert only the last migration with:

```powershell
npm.cmd run migration:revert --workspace=apps/api
```

## Migration history

| Migration                                     | Scope                                                 |
| --------------------------------------------- | ----------------------------------------------------- |
| `CreateAuthTables1710000000000`               | users and sessions                                    |
| `CreateAccountsAndTransactions1710000001000`  | accounts and transactions                             |
| `CreateCategoriesAndCostCenters1710000002000` | categories, cost centers and transaction foreign keys |
| `CreatePlanningAndInvestments1710000003000`   | budgets, financial goals and investments              |

## Data rules

- Every user-owned row carries `userId` and is queried with the authenticated user id.
- Monetary values use PostgreSQL `bigint` cents columns.
- Investment quantity is the exception: it is a decimal quantity, while all prices and values remain cents.
- Transfers use linked transaction rows through `transferPairId` and are excluded from income/expense aggregation by domain rules.
- Foreign keys use cascade deletion for user-owned data and restrict account deletion while transactions exist.

## Useful commands

```powershell
docker compose up -d postgres
npm.cmd run migration:run --workspace=apps/api
npm.cmd run migration:generate --workspace=apps/api -- -n NameOfChange
```
