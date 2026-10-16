import { describe, expect, it } from 'vitest';
import { validateAmount } from '../topup';

describe('validateAmount', () => {
  it('rejects amounts below the minimum', () => {
    expect(validateAmount(9_000)).toEqual({ type: 'validation', message: 'Minimum top up is 10,000' });
  });

  it('rejects amounts that are not a multiple of 1,000', () => {
    expect(validateAmount(10_500)).toEqual({ type: 'validation', message: 'Amount must be a multiple of 1,000' });
  });

  it('rejects non-integer amounts', () => {
    expect(validateAmount(10_000.5)?.type).toBe('validation');
  });

  it('accepts the minimum and valid multiples', () => {
    expect(validateAmount(10_000)).toBeNull();
    expect(validateAmount(50_000)).toBeNull();
  });
});
