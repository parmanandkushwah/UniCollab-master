// app/api/notes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, JwtPayload } from '@/lib/auth';
import * as cookie from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookie.parse(cookieHeader);
    const token = cookies['auth-token'];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const {
      title,
      description,
      subject,
      course,
      year,
      price,
      driveLink,
      tags,
      authorId,
      universityId
    } = await req.json();

    if (!title || !description || !subject || !course || !year || !price || !driveLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        description,
        subject,
        course,
        year,
        price: parseFloat(price),
        driveLink,
        tags,
        authorId: decoded.userId,
        universityId
      }
    });

    return NextResponse.json({ message: 'Note uploaded successfully', note: newNote }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
