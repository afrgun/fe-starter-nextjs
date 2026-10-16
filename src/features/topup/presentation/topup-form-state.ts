import type { AppError } from '@/shared/kernel/app-error';
import type { TopupInvoice } from '../domain/topup';

/** Serializable state shared by the Server Action and the client form. */
export type TopupFormState =
  | { readonly status: 'idle' }
  | { readonly status: 'error'; readonly error: AppError; readonly values: { readonly bankCode: string; readonly amount: string } }
  | { readonly status: 'success'; readonly invoice: TopupInvoice };

export const initialTopupFormState: TopupFormState = { status: 'idle' };
