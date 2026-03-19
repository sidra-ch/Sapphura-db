import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { requireClerkRole } from '../../../lib/clerk-rbac';

export async function GET(req: NextRequest) {
  const guard = await requireClerkRole('admin');
  if (guard) {
    return guard;
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      publicId: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    users: users.map((u) => ({
      id: u.publicId || String(u.id),
      legacyId: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireClerkRole('admin');
  if (guard) {
    return guard;
  }

  await req.json();
  // Add user creation logic here
  return NextResponse.json({ success: true });
}
