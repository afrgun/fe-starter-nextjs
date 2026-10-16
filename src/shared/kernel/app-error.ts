import type { Result } from './result';

export type AppErrorType =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown';

export interface AppError {
  readonly type: AppErrorType;
  readonly message: string;
  /** Backend business code, e.g. "TOP40901". */
  readonly code?: string;
}

/** Thrown only in presentation, when a library needs exceptions (e.g. a query cache). */
export class AppErrorException extends Error {
  constructor(readonly error: AppError) {
    super(error.message);
    this.name = 'AppErrorException';
  }
}

export const unwrap = <T>(result: Result<T, AppError>): T => {
  if (!result.ok) throw new AppErrorException(result.error);
  return result.value;
};
