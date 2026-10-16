'use client';

import { useActionState, useId } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { ErrorState } from '@/shared/ui/error-state';
import { toUiError } from '@/shared/lib/error-messages';
import { formatCurrency, formatDateTime, formatOrDash } from '@/shared/lib/format';
import type { Bank } from '../../domain/bank';
import { initialTopupFormState, type TopupFormState } from '../topup-form-state';

interface TopupFormProps {
  readonly banks: readonly Bank[];
  readonly action: (previous: TopupFormState, formData: FormData) => Promise<TopupFormState>;
}

export function TopupForm({ banks, action }: TopupFormProps) {
  const [state, formAction, pending] = useActionState(action, initialTopupFormState);
  const amountId = useId();

  if (state.status === 'success') {
    const { invoice } = state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment instructions</CardTitle>
          <CardDescription>Transfer to this virtual account before it expires.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <p>Virtual account: <strong>{formatOrDash(invoice.virtualAccount)}</strong></p>
          <p>Amount: {formatOrDash(invoice.amount, formatCurrency)}</p>
          <p>Expires: {formatOrDash(invoice.expiresAt, formatDateTime)}</p>
        </CardContent>
      </Card>
    );
  }

  const values = state.status === 'error' ? state.values : undefined;

  return (
    <form action={formAction} className="grid gap-6">
      <fieldset className="grid gap-3">
        <legend className="mb-2 text-sm font-medium">Bank</legend>
        <RadioGroup name="bankCode" defaultValue={values?.bankCode}>
          {banks.map((bank) => (
            <Label key={bank.code} className="flex items-center gap-3">
              <RadioGroupItem value={bank.code} />
              {formatOrDash(bank.name)}
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor={amountId}>Amount</Label>
        <Input id={amountId} name="amount" type="number" inputMode="numeric" min={0} defaultValue={values?.amount} />
      </div>

      {state.status === 'error' && <ErrorState error={toUiError(state.error)} />}

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating invoice…' : 'Top up'}
      </Button>
    </form>
  );
}
