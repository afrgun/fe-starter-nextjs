import { describe, expect, it } from 'vitest';
import { err, ok, type Result } from '@/shared/kernel/result';
import type { Envelope, HttpClient } from '@/core/http/server-http';
import type { HttpFailure } from '@/core/http/to-app-error';
import { createHttpBankRepository } from '../server/http-bank-repository';

/** Fake transport: every call resolves to the given response. */
const fakeHttp = (response: Result<Envelope<unknown>, HttpFailure>): HttpClient => ({
  get: async () => response as never,
  post: async () => response as never,
});

describe('createHttpBankRepository', () => {
  it('returns mapped banks on the business success code', async () => {
    const repo = createHttpBankRepository(fakeHttp(ok({ status: { code: 'TOP20000' }, data: [{ bank_code: 'BCA', active: 'Y' }] })));
    const result = await repo.getBanks();
    expect(result.ok && result.value.map((b) => b.code)).toEqual(['BCA']);
  });

  it('maps a business error code even when HTTP is 200', async () => {
    const repo = createHttpBankRepository(fakeHttp(ok({ status: { code: 'TOP40401' }, data: [] })));
    expect(await repo.getBanks()).toEqual({ ok: false, error: expect.objectContaining({ type: 'not_found', code: 'TOP40401' }) });
  });

  it('maps HTTP and network failures', async () => {
    expect((await createHttpBankRepository(fakeHttp(err({ status: 409, code: 'TOP40901' }))).getBanks())).toEqual({
      ok: false,
      error: expect.objectContaining({ type: 'conflict' }),
    });
    expect((await createHttpBankRepository(fakeHttp(err({ network: true }))).getBanks())).toEqual({
      ok: false,
      error: expect.objectContaining({ type: 'network' }),
    });
  });

  it('returns a server error when the payload is invalid', async () => {
    const repo = createHttpBankRepository(fakeHttp(ok({ status: { code: 'TOP20000' }, data: [{ active: 'Y' }] })));
    expect(await repo.getBanks()).toEqual({ ok: false, error: expect.objectContaining({ type: 'server' }) });
  });
});
