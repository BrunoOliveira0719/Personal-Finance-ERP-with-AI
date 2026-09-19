# ADR 0001: Store monetary values as integer cents

## Status
Accepted

## Context
Personal financial data requires exact arithmetic. JavaScript's `number`
type is IEEE-754 floating point, so operations like `0.1 + 0.2` do not
equal `0.3`. PostgreSQL's `numeric` type is exact, but once a value crosses
into JS (API response, frontend state, chart libraries), the floating-point
risk reappears — and accumulates across a DRE with dozens of summed
categories.

## Decision
Every monetary column is an integer number of **cents** (`amountCents`,
`initialBalanceCents`, etc.), stored as `integer` (or `bigint` for values
that could exceed ~21 million currency units) in PostgreSQL.

All arithmetic in application code goes through the `Money` value object
(`apps/api/src/common/money.ts`), which:
- accepts a decimal amount at the API boundary (`Money.fromDecimal("19.99")`)
  and converts it to cents once, on the way in;
- performs all internal math (`add`, `subtract`, `sum`, `percentageOf`) in
  integer cents;
- converts back to a decimal only at the edges — API responses and the
  frontend's currency formatter.

The frontend never does its own cents math; it receives cent integers (or
already-formatted decimals) from the API and formats them for display with
`Intl.NumberFormat`.

## Consequences
- No floating-point rounding drift in reports, budgets, or net-worth
  calculations, no matter how many transactions are summed.
- Every DTO and entity field must be explicit about being "cents" in its
  name, to avoid a developer accidentally treating it as a decimal.
- Division (e.g. percentages, margins) still uses floating point for the
  *result*, since a percentage is inherently not an exact monetary value —
  only the money itself is exact.
