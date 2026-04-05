type FormatCurrencyOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(value: number | string | null | undefined, options: FormatCurrencyOptions = {}) {
  const amount = Number(value || 0);
  const minimumFractionDigits = options.minimumFractionDigits ?? 2;
  const maximumFractionDigits = options.maximumFractionDigits ?? 2;

  return `Rs. ${amount.toLocaleString('en-PK', {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`;
}