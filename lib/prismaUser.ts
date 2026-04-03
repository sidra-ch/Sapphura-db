import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from './prisma'
import { isAdminEmail } from './admin-users'

export type AppRole = 'admin' | 'customer'

function getRoleFromClerkMetadata(metadata: unknown): AppRole {
  if (!metadata || typeof metadata !== 'object') {
    return 'customer'
  }

  const role = (metadata as Record<string, unknown>).role
  return role === 'admin' ? 'admin' : 'customer'
}

function resolveAppRole(primaryEmail: string, metadata: unknown): AppRole {
  if (isAdminEmail(primaryEmail)) {
    return 'admin'
  }

  return getRoleFromClerkMetadata(metadata)
}

export async function getOrCreatePrismaUser() {
  const authState = await auth()
  if (!authState.userId) {
    throw new Error('Unauthorized: user is not signed in.')
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    throw new Error('Unable to load Clerk user details.')
  }

  const primaryEmail = clerkUser.emailAddresses.find((item) => item.id === clerkUser.primaryEmailAddressId)?.emailAddress
    ?? clerkUser.emailAddresses[0]?.emailAddress

  if (!primaryEmail) {
    throw new Error('Clerk user does not have an email address.')
  }

  const resolvedRole = resolveAppRole(primaryEmail, clerkUser.publicMetadata)

  const userModel = prisma.user as any

  const existingByClerkId = await userModel.findFirst({
    where: { clerkId: authState.userId },
  })

  if (existingByClerkId) {
    const updated = await userModel.update({
      where: { id: existingByClerkId.id },
      data: {
        email: primaryEmail,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || existingByClerkId.name,
        role: resolvedRole,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    console.log('[clerk-sync] Updated existing Prisma user by clerkId:', updated.id)
    return updated
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: primaryEmail },
  })

  if (existingByEmail) {
    const updated = await userModel.update({
      where: { id: existingByEmail.id },
      data: {
        clerkId: authState.userId,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || existingByEmail.name,
        role: resolvedRole,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    console.log('[clerk-sync] Updated existing Prisma user:', updated.id)
    return updated
  }

  const created = await userModel.create({
    data: {
      clerkId: authState.userId,
      email: primaryEmail,
      password: `clerk-managed-${authState.userId}`,
      role: resolvedRole,
      isActive: true,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })

  console.log('[clerk-sync] Created new Prisma user:', created.id)
  return created
}
