import type { CreateTopupInput, TopupInvoice } from '../domain/topup';

/** Raw backend shape — never leaves infrastructure. */
export interface TopupInvoiceApiItem {
  readonly invoice_id?: string | null;
  readonly bank_code?: string | null;
  readonly amount?: number | null;
  readonly va_number?: string | null;
  readonly expired_at?: string | null;
}

export interface CreateTopupPayload {
  readonly bank_code: string;
  readonly amount: number;
}

export const toCreateTopupPayload = (input: CreateTopupInput): CreateTopupPayload => ({
  bank_code: input.bankCode,
  amount: input.amount,
});

/** Every field is required for a payable invoice; anything missing or malformed → null. */
export const toTopupInvoice = (raw: TopupInvoiceApiItem): TopupInvoice | null => {
  const { invoice_id: id, bank_code: bankCode, amount, va_number: virtualAccount, expired_at: expiredAt } = raw;
  if (!id || !bankCode || !virtualAccount || !expiredAt) return null;
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
  const expires = new Date(expiredAt);
  if (Number.isNaN(expires.getTime())) return null;
  return { id, bankCode, amount, virtualAccount, expiresAt: expires.toISOString() };
};
