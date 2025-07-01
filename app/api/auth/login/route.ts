export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("📨 Login attempt:", { email });

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        university: {
          select: {
            name: true,
            domain: true,
          },
        },
      },
    });

    if (!user) {
      console.log("❌ No user found for email:", email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    console.log("🔑 Password valid?", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      universityId: user.universityId,
    });

    const { password: _, ...userData } = user;

    const response = NextResponse.json({
      message: 'Login successful',
      user: userData,
      token,
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('❗ Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
