import type { AppErrorType } from '@/shared/kernel/app-error';

/** Backend business success codes (see api-contracts/topup.md). */
export const TOPUP_SUCCESS = {
  OK: 'TOP20000',
  CREATED: 'TOP20101',
} as const;

/** Backend business error codes → AppError.type. UI branches on the type, never on these codes. */
export const TOPUP_ERROR_TYPES: Readonly<Record<string, AppErrorType>> = {
  TOP40001: 'validation',
  TOP40401: 'not_found',
  TOP40901: 'conflict',
  TOP50001: 'server',
};
