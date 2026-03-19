import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-12">
      <SignIn />
    </main>
  )
}
