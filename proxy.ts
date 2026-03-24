import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
const isProtectedRoute = createRouteMatcher(['/protected(.*)', '/account(.*)', '/admin(.*)', '/clerk-admin(.*)'])

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || !isProtectedRoute(req)) {
    return
  }

  const authState = await auth()

  if (!authState.userId) {
    return authState.redirectToSignIn()
  }
})

export const config = {
  matcher: [
    '/protected(.*)',
    '/account(.*)',
    '/admin(.*)',
    '/clerk-admin(.*)',
  ],
}