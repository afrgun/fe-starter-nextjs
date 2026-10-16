import type { Bank } from '../domain/bank';

/** Raw backend shape — never leaves infrastructure. */
export interface BankApiItem {
  readonly bank_code?: string | null;
  readonly bank_name?: string | null;
  readonly active?: string | null;
  readonly other?: boolean | null;
  readonly logo?: string | null;
}

/** Required field missing → null (never fabricate an id). Flags are normalized case-insensitively. */
export const toBank = (raw: BankApiItem): Bank | null => {
  const code = raw.bank_code?.trim();
  if (!code) return null;
  return {
    code,
    name: raw.bank_name?.trim() || code,
    isActive: raw.active?.toUpperCase() === 'Y',
    isOtherBank: raw.other ?? false,
    logoUrl: raw.logo ?? null,
  };
};

/** All-or-nothing: one invalid item makes the whole response invalid. */
export const toBanks = (items: readonly BankApiItem[]): Bank[] | null => {
  const banks = items.map(toBank);
  return banks.every((bank): bank is Bank => bank !== null) ? banks : null;
};
