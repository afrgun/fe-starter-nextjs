import Link from 'next/link';
import { buttonVariants } from '@/shared/ui/button';

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-md gap-4 p-6">
      <h1 className="text-2xl font-semibold">Boilerplate Next.js</h1>
      <p className="text-sm text-muted-foreground">Sample feature built with the guideline pack.</p>
      <Link href="/topup" className={buttonVariants()}>
        Open top up
      </Link>
    </main>
  );
}
