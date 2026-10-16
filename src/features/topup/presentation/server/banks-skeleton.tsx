import { Skeleton } from '@/shared/ui/skeleton';

export function BanksSkeleton() {
  return (
    <div className="grid gap-3" aria-busy="true" aria-label="Loading banks">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
