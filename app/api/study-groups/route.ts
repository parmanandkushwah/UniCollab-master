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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, subject } = body;

    if (!name || !subject) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newGroup = await prisma.studyGroup.create({
      data: {
        name,
        subject,
        members: 1,
        lastActive: new Date(),
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Create study group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
