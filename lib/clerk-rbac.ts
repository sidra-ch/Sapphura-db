import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

function getRoleFromClaims(sessionClaims: Record<string, unknown> | null | undefined): string {
  if (!sessionClaims) {
    return 'user'
  }

  const metadata = (sessionClaims.metadata as Record<string, unknown> | undefined)
    ?? (sessionClaims.public_metadata as Record<string, unknown> | undefined)

  const role = metadata?.role
  return typeof role === 'string' && role.trim() ? role : 'user'
}

export async function requireClerkAuth() {
  const authState = await auth()
  if (!authState.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

export async function requireClerkRole(...roles: string[]) {
  const authState = await auth()

  if (!authState.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = getRoleFromClaims(authState.sessionClaims as Record<string, unknown> | undefined)
  if (!roles.includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}