'use server';

import { createServerPorts } from '@/core/di/server-ports';
import { createTopup } from '../application/create-topup';
import type { TopupFormState } from './topup-form-state';

/**
 * Server Action for the top-up form (used with useActionState).
 * Server Functions are reachable by direct POST: when auth exists, verify the session and
 * permission here before calling the use case (bp-security).
 */
export async function createTopupAction(_previous: TopupFormState, formData: FormData): Promise<TopupFormState> {
  const bankCode = String(formData.get('bankCode') ?? '').trim();
  const amountText = String(formData.get('amount') ?? '').trim();
  const values = { bankCode, amount: amountText };

  if (!bankCode) return { status: 'error', error: { type: 'validation', message: 'Choose a bank' }, values };

  const amount = Number(amountText);
  if (amountText === '' || !Number.isFinite(amount)) {
    return { status: 'error', error: { type: 'validation', message: 'Enter an amount' }, values };
  }

  const result = await createTopup(createServerPorts())({ bankCode, amount });
  return result.ok ? { status: 'success', invoice: result.value } : { status: 'error', error: result.error, values };
}
