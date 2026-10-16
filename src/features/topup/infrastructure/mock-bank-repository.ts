import { ok } from '@/shared/kernel/result';
import type { BankRepository } from '../application/bank-repository';
import { toBanks, type BankApiItem } from './bank.mapper';

/** Deterministic raw data, passed through the real mapper so mock and HTTP paths behave the same. */
const MOCK_BANKS: readonly BankApiItem[] = [
  { bank_code: 'OTHER', bank_name: 'Other bank', active: 'Y', other: true, logo: null },
  { bank_code: 'BCA', bank_name: 'Bank Central Asia', active: 'Y', other: false, logo: null },
  { bank_code: 'MANDIRI', bank_name: 'Bank Mandiri', active: 'y', other: false, logo: null },
  { bank_code: 'BNI', bank_name: 'Bank Negara Indonesia', active: 'N', other: false, logo: null },
];

export const createMockBankRepository = (): BankRepository => ({
  async getBanks() {
    return ok(toBanks(MOCK_BANKS) ?? []);
  },
});
