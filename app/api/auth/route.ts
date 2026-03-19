import { NextRequest, NextResponse } from 'next/server';

function deprecatedAuthResponse() {
  return NextResponse.json(
    {
      error: 'Legacy auth endpoint has been disabled. Use Clerk routes /sign-in and /sign-up.',
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    },
    { status: 410 }
  );
}

export async function POST(_req: NextRequest) {
  return deprecatedAuthResponse();
}

export async function GET(_req: NextRequest) {
  return deprecatedAuthResponse();
}
