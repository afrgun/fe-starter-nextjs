/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Bank } from '../../../domain/bank';
import type { TopupFormState } from '../../topup-form-state';
import { TopupForm } from '../topup-form';

const banks: Bank[] = [
  { code: 'BCA', name: 'Bank Central Asia', isActive: true, isOtherBank: false, logoUrl: null },
  { code: 'OTHER', name: 'Other bank', isActive: true, isOtherBank: true, logoUrl: null },
];

describe('TopupForm', () => {
  it('lists the banks and the amount field', () => {
    render(<TopupForm banks={banks} action={vi.fn()} />);
    expect(screen.getByText('Bank Central Asia')).toBeInTheDocument();
    expect(screen.getByText('Other bank')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('shows the validation message returned by the action', async () => {
    const action = vi.fn(async (): Promise<TopupFormState> => ({
      status: 'error',
      error: { type: 'validation', message: 'Minimum top up is 10,000' },
      values: { bankCode: 'BCA', amount: '5000' },
    }));
    render(<TopupForm banks={banks} action={action} />);

    await userEvent.click(screen.getByRole('button', { name: 'Top up' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Minimum top up is 10,000');
  });

  it('shows payment instructions after success', async () => {
    const action = vi.fn(async (): Promise<TopupFormState> => ({
      status: 'success',
      invoice: { id: 'INV-1', bankCode: 'BCA', amount: 50_000, virtualAccount: '8808000050000', expiresAt: '2026-10-21T08:00:00.000Z' },
    }));
    render(<TopupForm banks={banks} action={action} />);

    await userEvent.click(screen.getByRole('button', { name: 'Top up' }));

    expect(await screen.findByText('Payment instructions')).toBeInTheDocument();
    expect(screen.getByText('8808000050000')).toBeInTheDocument();
  });
});
