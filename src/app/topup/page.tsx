import { Suspense } from 'react';
import { BanksSection } from '@/features/topup/presentation/server/banks-section';
import { BanksSkeleton } from '@/features/topup/presentation/server/banks-skeleton';

export default function TopupPage() {
  return (
    <main className="mx-auto grid w-full max-w-md gap-6 p-6">
      <h1 className="text-2xl font-semibold">Top up</h1>
      <Suspense fallback={<BanksSkeleton />}>
        <BanksSection />
      </Suspense>
    </main>
  );
}
