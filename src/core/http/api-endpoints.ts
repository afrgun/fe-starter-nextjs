/** Every backend path lives here, grouped by feature (bp-api-integration). */
export const API = {
  topup: {
    banks: '/topup/v1/banks',
    invoices: '/topup/v1/invoices',
  },
} as const;
