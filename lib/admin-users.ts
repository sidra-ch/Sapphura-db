const DEFAULT_ADMIN_EMAILS = ['ms.sidrachaudhary@gmail.com']

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function readConfiguredAdminEmails(): string[] {
  const raw = process.env.CLERK_ADMIN_EMAILS || process.env.ADMIN_EMAILS || ''
  const configured = raw
    .split(',')
    .map((value) => normalizeEmail(value))
    .filter(Boolean)

  return configured.length > 0 ? configured : DEFAULT_ADMIN_EMAILS
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false
  }

  const normalizedEmail = normalizeEmail(email)
  return readConfiguredAdminEmails().includes(normalizedEmail)
}
