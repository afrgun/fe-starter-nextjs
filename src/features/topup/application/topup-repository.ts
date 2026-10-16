import type { Result } from '@/shared/kernel/result';
import type { AppError } from '@/shared/kernel/app-error';
import type { CreateTopupInput, TopupInvoice } from '../domain/topup';

export interface TopupRepository {
  create(input: CreateTopupInput): Promise<Result<TopupInvoice, AppError>>;
}
