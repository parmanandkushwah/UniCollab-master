// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, university } = body;

    if (!email || !password || !fullName || !university) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 🔍 Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 🔍 Find university by name
    const universityRecord = await prisma.university.findFirst({
      where: {
        name: {
          equals: university,
          mode: 'insensitive',
        },
      },
    });

    if (!universityRecord) {
      return NextResponse.json({ error: 'Invalid university name' }, { status: 400 });
    }

    // 🔐 Hash password
    const hashedPassword = await hashPassword(password);

    // 🧑‍🎓 Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        universityId: universityRecord.id,
      },
    });

    return NextResponse.json({ message: 'Registration successful', user }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
