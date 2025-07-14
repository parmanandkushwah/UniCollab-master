// app/api/study-groups/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET() {
  try {
    const groups = await prisma.studyGroup.findMany({
      orderBy: { lastActive: 'desc' },
    });
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Study groups fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
git