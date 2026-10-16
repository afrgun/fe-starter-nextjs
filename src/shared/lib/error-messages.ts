import type { AppError, AppErrorType } from '@/shared/kernel/app-error';

export interface UiError {
  readonly title: string;
  readonly message: string;
}

const MESSAGES: Record<AppErrorType, UiError> = {
  unauthorized: { title: 'Session expired', message: 'Please sign in again.' },
  forbidden: { title: 'Access denied', message: 'You do not have permission to do this.' },
  not_found: { title: 'Not found', message: 'The data you are looking for is not available.' },
  validation: { title: 'Check your input', message: 'Some fields are not valid.' },
  conflict: { title: 'Request conflict', message: 'The data changed. Please refresh and try again.' },
  server: { title: 'Server error', message: 'Something went wrong on our side. Please try again later.' },
  network: { title: 'Connection problem', message: 'Check your internet connection and try again.' },
  unknown: { title: 'Something went wrong', message: 'Please try again.' },
};

/**
 * Central message map (bp-ui-components rule 7). Validation and conflict messages come from
 * domain/feature code and are user-facing, so they are shown as-is; other types use generic text
 * so backend internals never reach the UI.
 */
export const toUiError = (error: AppError): UiError => {
  const base = MESSAGES[error.type];
  const showOwnMessage = (error.type === 'validation' || error.type === 'conflict') && error.message.length > 0;
  return showOwnMessage ? { title: base.title, message: error.message } : base;
};
