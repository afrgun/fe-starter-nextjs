import 'server-only';
import type { BankRepository } from '@/features/topup/application/bank-repository';
import type { TopupRepository } from '@/features/topup/application/topup-repository';
import { createMockBankRepository } from '@/features/topup/infrastructure/mock-bank-repository';
import { createMockTopupRepository } from '@/features/topup/infrastructure/mock-topup-repository';
import { createHttpBankRepository } from '@/features/topup/infrastructure/server/http-bank-repository';
import { createHttpTopupRepository } from '@/features/topup/infrastructure/server/http-topup-repository';

export interface ServerPorts {
  readonly banks: BankRepository;
  readonly topups: TopupRepository;
}

const isMockEnabled = (): boolean => process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/** Factory per request — never a module-level singleton holding user data. */
export const createServerPorts = (): ServerPorts =>
  isMockEnabled()
    ? { banks: createMockBankRepository(), topups: createMockTopupRepository() }
    : { banks: createHttpBankRepository(), topups: createHttpTopupRepository() };
