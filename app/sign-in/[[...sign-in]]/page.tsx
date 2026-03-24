import { SignIn } from '@clerk/nextjs'
import ClerkProvider from '../../../components/ClerkProvider'

export default function SignInPage() {
  return (
    <ClerkProvider>
      <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-12">
        <SignIn />
      </main>
    </ClerkProvider>
  )
}
