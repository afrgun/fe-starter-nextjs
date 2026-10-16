import type { AppError, AppErrorType } from '@/shared/kernel/app-error';

export interface HttpFailure {
  readonly status?: number;
  /** Backend business code from the response envelope, if any. */
  readonly code?: string;
  readonly network?: boolean;
}

const BY_STATUS: Record<number, AppErrorType> = {
  400: 'validation',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  422: 'validation',
};

/**
 * Single place mapping transport failures to AppError. Features pass their own business-code map
 * (core never imports features). Messages here are generic; UI text comes from the message map.
 */
export const toAppError = (failure: HttpFailure, businessCodes: Readonly<Record<string, AppErrorType>> = {}): AppError => {
  if (failure.network) return { type: 'network', message: 'Network request failed' };
  const fromCode = failure.code ? businessCodes[failure.code] : undefined;
  const fromStatus = failure.status !== undefined ? BY_STATUS[failure.status] : undefined;
  const type: AppErrorType = fromCode ?? fromStatus ?? (failure.status && failure.status >= 500 ? 'server' : 'unknown');
  return { type, message: '', code: failure.code };
};
