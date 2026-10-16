import type { UiError } from '@/shared/lib/error-messages';
import { Card, CardDescription, CardHeader, CardTitle } from './card';

interface ErrorStateProps {
  readonly error: UiError;
}

/** Renders a user-facing error from the central message map (never raw backend text). */
export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Card role="alert" className="border-destructive/50">
      <CardHeader>
        <CardTitle>{error.title}</CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </CardHeader>
    </Card>
  );
}
