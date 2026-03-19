import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-12">
      <SignUp />
    </main>
  )
}
