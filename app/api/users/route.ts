import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  await req.json();
  // Add user creation logic here
  return NextResponse.json({ success: true });
}
