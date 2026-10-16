import { describe, expect, it } from 'vitest';
import { toCreateTopupPayload, toTopupInvoice } from '../topup.mapper';

const valid = {
  invoice_id: 'INV-1',
  bank_code: 'BCA',
  amount: 50_000,
  va_number: '8808000050000',
  expired_at: '2026-10-21T08:00:00Z',
};

describe('toTopupInvoice', () => {
  it('maps a full payload and normalizes the date to ISO', () => {
    expect(toTopupInvoice(valid)).toEqual({
      id: 'INV-1',
      bankCode: 'BCA',
      amount: 50_000,
      virtualAccount: '8808000050000',
      expiresAt: '2026-10-21T08:00:00.000Z',
    });
  });

  it.each(['invoice_id', 'bank_code', 'va_number', 'expired_at'] as const)('returns null when %s is missing', (field) => {
    expect(toTopupInvoice({ ...valid, [field]: null })).toBeNull();
  });

  it('returns null for an invalid date or amount', () => {
    expect(toTopupInvoice({ ...valid, expired_at: 'not-a-date' })).toBeNull();
    expect(toTopupInvoice({ ...valid, amount: null })).toBeNull();
  });
});

describe('toCreateTopupPayload', () => {
  it('uses the backend field names', () => {
    expect(toCreateTopupPayload({ bankCode: 'BCA', amount: 50_000 })).toEqual({ bank_code: 'BCA', amount: 50_000 });
  });
});
