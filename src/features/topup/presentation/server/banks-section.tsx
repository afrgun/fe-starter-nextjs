import { createServerPorts } from '@/core/di/server-ports';
import { toUiError } from '@/shared/lib/error-messages';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { selectableBanks } from '../../domain/bank';
import { createTopupAction } from '../actions';
import { TopupForm } from '../client/topup-form';

/** Server Component: loads banks per request; the route wraps it in <Suspense>. */
export async function BanksSection() {
  const result = await createServerPorts().banks.getBanks();
  if (!result.ok) return <ErrorState error={toUiError(result.error)} />;

  const banks = selectableBanks(result.value);
  if (banks.length === 0) return <EmptyState title="No banks available" description="Please try again later." />;

  return <TopupForm banks={banks} action={createTopupAction} />;
}
