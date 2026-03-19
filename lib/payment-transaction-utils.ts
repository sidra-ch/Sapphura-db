export const PAYMENT_TRANSACTION_SETUP_MESSAGE = 'Payment transactions table is missing. Apply the latest Prisma migration for PaymentTransaction.'

export function isPaymentTransactionTableMissing(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || '')
  return message.includes('PaymentTransaction') && message.toLowerCase().includes('does not exist')
}
