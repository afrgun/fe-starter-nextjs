import 'server-only';
import { API } from '@/core/http/api-endpoints';
import { serverHttp, type HttpClient } from '@/core/http/server-http';
import { toAppError } from '@/core/http/to-app-error';
import { err, ok } from '@/shared/kernel/result';
import type { BankRepository } from '../../application/bank-repository';
import { toBanks, type BankApiItem } from '../bank.mapper';
import { TOPUP_ERROR_TYPES, TOPUP_SUCCESS } from '../topup.constants';

export const createHttpBankRepository = (http: HttpClient = serverHttp()): BankRepository => ({
  async getBanks() {
    const response = await http.get<BankApiItem[]>(API.topup.banks);
    if (!response.ok) return err(toAppError(response.error, TOPUP_ERROR_TYPES));

    const { status, data } = response.value;
    if (status?.code !== TOPUP_SUCCESS.OK) return err(toAppError({ status: 200, code: status?.code }, TOPUP_ERROR_TYPES));

    const banks = toBanks(data ?? []);
    return banks ? ok(banks) : err({ type: 'server', message: 'Invalid bank data from server' });
  },
});
