import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import cookie from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookie.parse(cookieHeader);
    const token = cookies['auth-token'];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { noteId } = body;

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: {
          select: { fullName: true }
        }
      }
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_noteId: {
          userId: decoded.userId,
          noteId
        }
      }
    });

    if (existingPurchase) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 });
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.userId,
        noteId,
        amount: note.price
      }
    });

    await prisma.note.update({
      where: { id: noteId },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      message: 'Purchase successful',
      purchase,
      driveLink: note.driveLink
    }, { status: 200 });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
