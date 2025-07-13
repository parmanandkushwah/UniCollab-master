// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        university: {
          select: { name: true, domain: true },
        },
      },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      universityId: user.universityId,
    });

    // ✅ Send token + cookie
    const response = NextResponse.json({
      message: 'Login successful',
      token, // <-- important to return this so frontend can store in localStorage
     user: {
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  universityId: user.universityId, // ✅ Add this
  university: user.university,
},

    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
