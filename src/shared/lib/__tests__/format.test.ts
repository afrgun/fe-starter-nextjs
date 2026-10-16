import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDateTime, formatOrDash } from '../format';

describe('formatOrDash', () => {
  it.each([null, undefined, '', Number.NaN])('renders "-" for %s', (value) => {
    expect(formatOrDash(value)).toBe('-');
  });

  it('renders the value as text when no formatter is given', () => {
    expect(formatOrDash(0)).toBe('0');
    expect(formatOrDash('BCA')).toBe('BCA');
  });

  it('applies the formatter to present values only', () => {
    expect(formatOrDash(50_000, formatCurrency)).toBe(formatCurrency(50_000));
    expect(formatOrDash<number>(null, formatCurrency)).toBe('-');
  });
});

describe('formatDateTime', () => {
  it('renders "-" for an invalid date string', () => {
    expect(formatDateTime('not-a-date')).toBe('-');
  });

  it('formats a valid ISO string', () => {
    expect(formatDateTime('2026-10-20T08:00:00.000Z')).not.toBe('-');
  });
});
