export const runtime = 'nodejs';         // ⬅️ force Node.js runtime (needed for Prisma, bcrypt, etc.)
export const dynamic = 'force-dynamic';  // ⬅️ prevents static optimization errors
export const preferredRegion = 'home'; // optional

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function GET() {
  const secret = process.env.JWT_SECRET;
  return NextResponse.json({ loaded: !!secret });
}

export async function POST(request: NextRequest) {
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // ✅ Add this line

  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user with university info
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        university: {
          select: {
            name: true,
            domain: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      universityId: user.universityId
    });

    // Create response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.fullName = user.fullName; // Ensure fullName is explicitly included

    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}