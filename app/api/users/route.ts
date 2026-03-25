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

  const body = await req.json();

  const email = String(body?.email || '').trim().toLowerCase();
  const name = String(body?.name || '').trim();
  const phone = String(body?.phone || '').trim();

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      phone: phone || null,
      password: `admin-created-${Date.now()}`,
      role: 'customer',
      isActive: true,
    },
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
  });

  return NextResponse.json({
    success: true,
    user: {
      id: user.publicId || String(user.id),
      legacyId: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}
