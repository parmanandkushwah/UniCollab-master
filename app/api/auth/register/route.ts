export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, universityId } = body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 2. Check if provided universityId exists
    const universityExists = await prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!universityExists) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 });
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        universityId,
      },
    });

    return NextResponse.json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
