import type { AppError } from '@/shared/kernel/app-error';

export const MIN_TOPUP = 10_000;
export const TOPUP_STEP = 1_000;

export interface CreateTopupInput {
  readonly bankCode: string;
  readonly amount: number;
}

export interface TopupInvoice {
  readonly id: string;
  readonly bankCode: string;
  readonly amount: number;
  readonly virtualAccount: string;
  /** ISO 8601 string — kept as a string so the invoice can cross the server/client boundary. */
  readonly expiresAt: string;
}

/** Returns a validation error, or null when the amount is allowed. */
export const validateAmount = (amount: number): AppError | null => {
  if (!Number.isInteger(amount)) return { type: 'validation', message: 'Amount must be a whole number' };
  if (amount < MIN_TOPUP) return { type: 'validation', message: 'Minimum top up is 10,000' };
  if (amount % TOPUP_STEP !== 0) return { type: 'validation', message: 'Amount must be a multiple of 1,000' };
  return null;
};
