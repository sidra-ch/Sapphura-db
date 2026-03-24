import { SignUp } from '@clerk/nextjs'
import ClerkProvider from '../../../components/ClerkProvider'

export default function SignUpPage() {
  return (
    <ClerkProvider>
      <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-12">
        <SignUp />
      </main>
    </ClerkProvider>
  )
}
