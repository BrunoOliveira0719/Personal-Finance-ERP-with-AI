import { Money } from './money';

describe('Money', () => {
  it('converts a decimal amount to integer cents without float drift', () => {
    expect(Money.fromDecimal(19.99).toCents()).toBe(1999);
    expect(Money.fromDecimal('0.1').add(Money.fromDecimal('0.2')).toCents()).toBe(30);
  });

  it('round-trips cents back to a decimal amount', () => {
    expect(Money.fromCents(150000).toDecimal()).toBe(1500);
  });

  it('adds and subtracts correctly', () => {
    const a = Money.fromDecimal(100);
    const b = Money.fromDecimal(35.5);
    expect(a.add(b).toDecimal()).toBe(135.5);
    expect(a.subtract(b).toDecimal()).toBe(64.5);
  });

  it('rejects non-integer cent values', () => {
    expect(() => Money.fromCents(10.5)).toThrow();
  });

  it('sums a list of Money values', () => {
    const values = [Money.fromDecimal(10), Money.fromDecimal(20), Money.fromDecimal(5.5)];
    expect(Money.sum(values).toDecimal()).toBe(35.5);
  });

  it('computes a safe percentage, returning 0 when the denominator is 0', () => {
    const netResult = Money.fromDecimal(500);
    const revenue = Money.fromDecimal(2000);
    expect(Money.percentageOf(netResult, revenue)).toBe(25);
    expect(Money.percentageOf(netResult, Money.fromCents(0))).toBe(0);
  });
});
