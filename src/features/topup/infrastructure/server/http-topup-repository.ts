import 'server-only';
import { API } from '@/core/http/api-endpoints';
import { serverHttp, type HttpClient } from '@/core/http/server-http';
import { toAppError } from '@/core/http/to-app-error';
import { err, ok } from '@/shared/kernel/result';
import type { TopupRepository } from '../../application/topup-repository';
import { toCreateTopupPayload, toTopupInvoice, type TopupInvoiceApiItem } from '../topup.mapper';
import { TOPUP_ERROR_TYPES, TOPUP_SUCCESS } from '../topup.constants';

export const createHttpTopupRepository = (http: HttpClient = serverHttp()): TopupRepository => ({
  async create(input) {
    const response = await http.post<TopupInvoiceApiItem>(API.topup.invoices, toCreateTopupPayload(input));
    if (!response.ok) return err(toAppError(response.error, TOPUP_ERROR_TYPES));

    const { status, data } = response.value;
    if (status?.code !== TOPUP_SUCCESS.CREATED) return err(toAppError({ status: 200, code: status?.code }, TOPUP_ERROR_TYPES));

    const invoice = data ? toTopupInvoice(data) : null;
    return invoice ? ok(invoice) : err({ type: 'server', message: 'Invalid invoice data from server' });
  },
});
