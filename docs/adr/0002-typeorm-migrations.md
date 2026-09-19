# ADR 0002: Schema changes only through TypeORM migrations

## Status
Accepted

## Context
TypeORM offers `synchronize: true`, which auto-generates and applies schema
changes from entity definitions at application startup. It's convenient for
prototyping but dangerous for any application holding real data: it can
silently drop columns or tables when an entity changes, it's not
reviewable, and it behaves differently across environments.

## Decision
`synchronize` is hardcoded to `false` in both `DatabaseModule`
(`apps/api/src/database/database.module.ts`) and the CLI `DataSource`
(`apps/api/src/database/data-source.ts`). All schema changes go through
generated migrations:

```
npm run migration:generate --workspace=apps/api -- src/database/migrations/<Name>
npm run migration:run --workspace=apps/api
```

Migrations are committed to version control and are the single source of
truth for the schema. `docker compose up` does **not** run migrations
automatically on the API container in this first phase — they're run
explicitly, so a deploy never applies an unreviewed schema change.

## Consequences
- Every schema change is a reviewable, revertible file.
- Slightly more ceremony during early development (must generate a
  migration for every entity change) — accepted as the right trade-off
  once there is real financial data at stake.
- CI (once added) should run `migration:run` against a disposable database
  as part of the test setup, to catch migration errors before merge.
