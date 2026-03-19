import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
const isProtectedRoute = createRouteMatcher(['/protected(.*)', '/account(.*)', '/admin(.*)', '/clerk-admin(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/clerk-admin(.*)'])

function getRoleFromClaims(sessionClaims: Record<string, unknown> | null | undefined): string {
  if (!sessionClaims) return 'user'

  const metadata = (sessionClaims.metadata as Record<string, unknown> | undefined) ??
    (sessionClaims.public_metadata as Record<string, unknown> | undefined)

  const role = metadata?.role
  return typeof role === 'string' && role.trim() ? role : 'user'
}

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || !isProtectedRoute(req)) {
    return
  }

  const authState = await auth()

  if (!authState.userId) {
    return authState.redirectToSignIn()
  }

  if (isAdminRoute(req)) {
    const role = getRoleFromClaims(authState.sessionClaims as Record<string, unknown> | undefined)
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/protected', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}