# ADR 0003: Security and Testing Baseline

## Status
Accepted

## Decision
All domain routes are protected by the global session guard unless explicitly marked `@Public()`. Session tokens are opaque, stored only as SHA-256 hashes, and revoked on sign-out. User-owned records always include the authenticated user's id in repository predicates.

The API gate is Jest unit tests, Supertest e2e tests, TypeScript build, and ESLint. Database changes are applied only through reviewed TypeORM migrations. CI or local release checks must run these gates before a phase is published.

## Consequences
- OAuth secrets and local `.env` files never enter Git.
- Cross-user access is rejected at the service query boundary.
- Every phase has a reproducible migration and executable validation.
- Reports and dashboard calculations operate on integer cent columns; decimal quantity is limited to investment units.
