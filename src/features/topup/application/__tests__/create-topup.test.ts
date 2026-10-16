import { describe, expect, it, vi } from 'vitest';
import { ok } from '@/shared/kernel/result';
import type { Bank } from '../../domain/bank';
import type { BankRepository } from '../bank-repository';
import type { TopupRepository } from '../topup-repository';
import { createTopup } from '../create-topup';

const bank = (code: string, isActive: boolean): Bank => ({ code, name: code, isActive, isOtherBank: false, logoUrl: null });

const setup = (banks: Bank[]) => {
  const bankRepository: BankRepository = { getBanks: async () => ok(banks) };
  const create = vi.fn<TopupRepository['create']>(async (input) =>
    ok({ id: 'INV-1', bankCode: input.bankCode, amount: input.amount, virtualAccount: '8808', expiresAt: '2026-10-21T08:00:00.000Z' }),
  );
  return { run: createTopup({ banks: bankRepository, topups: { create } }), create };
};

describe('createTopup', () => {
  it('rejects an invalid amount without calling the ports', async () => {
    const { run, create } = setup([bank('A', true)]);
    const result = await run({ bankCode: 'A', amount: 5_000 });
    expect(result).toEqual({ ok: false, error: expect.objectContaining({ type: 'validation' }) });
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects a bank that is no longer active', async () => {
    const { run, create } = setup([bank('A', false)]);
    expect(await run({ bankCode: 'A', amount: 50_000 })).toEqual({
      ok: false,
      error: { type: 'validation', message: 'Selected bank is not available' },
    });
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the invoice for a valid request', async () => {
    const { run } = setup([bank('A', true)]);
    const result = await run({ bankCode: 'A', amount: 50_000 });
    expect(result.ok && result.value.id).toBe('INV-1');
  });
});
