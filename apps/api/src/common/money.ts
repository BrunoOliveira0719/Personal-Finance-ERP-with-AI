/**
 * All monetary values in this application are stored and computed as
 * integer cents (an `integer`/`bigint` column, never `numeric` or `float`).
 * See docs/adr/0001-money-as-integer-cents.md for the rationale.
 *
 * This helper is the single place that converts between the cents
 * representation used internally and the decimal representation used at
 * the API boundary (request/response bodies) and in the UI.
 */
export class Money {
  private constructor(private readonly cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error(`Money must be stored as an integer number of cents, got: ${cents}`);
    }
  }

  static fromCents(cents: number): Money {
    return new Money(cents);
  }

  /** Parses a decimal amount (e.g. from a DTO field like "1234.56") into cents. */
  static fromDecimal(amount: number | string): Money {
    const decimal = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    if (Number.isNaN(decimal)) {
      throw new Error(`Invalid monetary amount: ${amount}`);
    }
    return new Money(Math.round(decimal * 100));
  }

  toCents(): number {
    return this.cents;
  }

  toDecimal(): number {
    return this.cents / 100;
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  static sum(values: Money[]): Money {
    return values.reduce((total, value) => total.add(value), Money.fromCents(0));
  }

  /** Safe percentage helper for margin/rate calculations; returns 0 when the base is 0. */
  static percentageOf(numerator: Money, denominator: Money): number {
    if (denominator.toCents() === 0) return 0;
    return (numerator.toCents() / denominator.toCents()) * 100;
  }
}
