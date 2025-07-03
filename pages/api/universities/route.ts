import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const universities = await prisma.university.findMany({
    where: { isActive: true }, // Optional filter
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  return NextResponse.json(universities);
}
