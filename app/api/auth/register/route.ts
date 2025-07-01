import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, university, studentId } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Find or create university
    let universityRecord = await prisma.university.findFirst({
      where: { name: university }
    });

    if (!universityRecord) {
      // Extract domain from email
      const domain = email.split('@')[1];
      
      universityRecord = await prisma.university.create({
        data: {
          name: university,
          domain: domain,
          country: 'Unknown',
          city: 'Unknown',
          isActive: true
        }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        studentId,
        universityId: universityRecord.id,
        isVerified: false
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        isVerified: true,
        university: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'User created successfully',
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}