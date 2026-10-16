const isMissing = (value: unknown): boolean =>
  value === null || value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value));

/** The only way UI renders possibly-missing values: returns '-' when the value is missing. */
export const formatOrDash = <T>(value: T | null | undefined, format?: (value: T) => string): string => {
  if (isMissing(value)) return '-';
  return format ? format(value as T) : String(value);
};

const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export const formatCurrency = (amount: number): string => currencyFormatter.format(amount);

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

/** Formats an ISO date string; invalid input renders '-'. */
export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '-' : dateTimeFormatter.format(date);
};
