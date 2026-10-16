import 'server-only';
import { cookies } from 'next/headers';
import { err, ok, type Result } from '@/shared/kernel/result';
import type { HttpFailure } from './to-app-error';

/** Backend envelope: `{ status: { code, message }, data }`. Adjust here if the backend differs. */
export interface Envelope<T> {
  readonly status?: { readonly code?: string; readonly message?: string };
  readonly data?: T;
}

/** Never throws: transport problems come back as HttpFailure for the adapter to map. */
export interface HttpClient {
  get<T>(path: string): Promise<Result<Envelope<T>, HttpFailure>>;
  post<T>(path: string, body: unknown): Promise<Result<Envelope<T>, HttpFailure>>;
}

const request = async <T>(path: string, init: RequestInit): Promise<Result<Envelope<T>, HttpFailure>> => {
  // Read request data FIRST: it marks the route as rendered per request. Returning before this
  // (e.g. on a missing env var) would let the build prerender and freeze an error page.
  const token = (await cookies()).get('access_token')?.value;
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) return err({ status: 500 });
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const body = (await response.json().catch(() => null)) as Envelope<T> | null;
    if (!response.ok) return err({ status: response.status, code: body?.status?.code });
    return ok(body ?? {});
  } catch {
    return err({ network: true });
  }
};

export const serverHttp = (): HttpClient => ({
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
});
