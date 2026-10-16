import type { Result } from '@/shared/kernel/result';
import type { AppError } from '@/shared/kernel/app-error';
import type { Bank } from '../domain/bank';

export interface BankRepository {
  getBanks(): Promise<Result<Bank[], AppError>>;
}
