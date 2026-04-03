import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { isAdminEmail } from './admin-users'

function getRoleFromMetadata(metadata: unknown): string {
  if (!metadata || typeof metadata !== 'object') {
    return 'customer'
  }

  const role = (metadata as Record<string, unknown>).role
  return typeof role === 'string' && role.trim() ? role : 'customer'
}

function getRoleFromClaims(sessionClaims: Record<string, unknown> | null | undefined): string {
  if (!sessionClaims) {
    return 'customer'
  }

  const metadata = (sessionClaims.metadata as Record<string, unknown> | undefined)
    ?? (sessionClaims.public_metadata as Record<string, unknown> | undefined)

  return getRoleFromMetadata(metadata)
}

export async function getCurrentClerkRole(): Promise<string> {
  const authState = await auth()
  const clerkUser = await currentUser()
  const primaryEmail = clerkUser?.emailAddresses.find((item) => item.id === clerkUser.primaryEmailAddressId)?.emailAddress
    ?? clerkUser?.emailAddresses[0]?.emailAddress

  if (isAdminEmail(primaryEmail)) {
    return 'admin'
  }

  const metadataRole = getRoleFromMetadata(clerkUser?.publicMetadata)
  if (metadataRole === 'admin') {
    return metadataRole
  }

  return metadataRole
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

  const role = await getCurrentClerkRole()
  if (!roles.includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

export async function requirePageRole(...roles: string[]) {
  const authState = await auth()

  if (!authState.userId) {
    redirect('/sign-in')
  }

  const role = await getCurrentClerkRole()
  if (!roles.includes(role)) {
    redirect('/access-denied')
  }
}

export { getRoleFromClaims }