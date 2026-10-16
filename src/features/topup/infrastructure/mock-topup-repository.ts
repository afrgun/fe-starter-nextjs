import { err, ok } from '@/shared/kernel/result';
import type { TopupRepository } from '../application/topup-repository';
import { toTopupInvoice } from './topup.mapper';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Deterministic invoice per bank + amount; expiry is one day from the request time. */
export const createMockTopupRepository = (now: () => Date = () => new Date()): TopupRepository => ({
  async create(input) {
    const invoice = toTopupInvoice({
      invoice_id: `INV-${input.bankCode}-${input.amount}`,
      bank_code: input.bankCode,
      amount: input.amount,
      va_number: `8808${String(input.amount).padStart(10, '0')}`,
      expired_at: new Date(now().getTime() + DAY_MS).toISOString(),
    });
    return invoice ? ok(invoice) : err({ type: 'server', message: 'Mock invoice could not be built' });
  },
});
