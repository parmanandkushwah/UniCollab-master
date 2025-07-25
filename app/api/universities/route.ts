// app/api/universities/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
