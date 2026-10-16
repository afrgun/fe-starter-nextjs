import { err, type Result } from '@/shared/kernel/result';
import type { AppError } from '@/shared/kernel/app-error';
import { selectableBanks } from '../domain/bank';
import { validateAmount, type CreateTopupInput, type TopupInvoice } from '../domain/topup';
import type { BankRepository } from './bank-repository';
import type { TopupRepository } from './topup-repository';

export interface CreateTopupDeps {
  readonly banks: BankRepository;
  readonly topups: TopupRepository;
}

/** Use case with real logic: validates the amount and that the chosen bank is still selectable. */
export const createTopup = (deps: CreateTopupDeps) =>
  async (input: CreateTopupInput): Promise<Result<TopupInvoice, AppError>> => {
    const amountError = validateAmount(input.amount);
    if (amountError) return err(amountError);

    const banks = await deps.banks.getBanks();
    if (!banks.ok) return banks;

    if (!selectableBanks(banks.value).some((bank) => bank.code === input.bankCode)) {
      return err({ type: 'validation', message: 'Selected bank is not available' });
    }

    return deps.topups.create(input);
  };
