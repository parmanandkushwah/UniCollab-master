import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { noteId } = body;

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: {
          select: {
            fullName: true
          }
        }
      }
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Check if user already purchased this note
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_noteId: {
          userId: decoded.userId,
          noteId: noteId
        }
      }
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this note' },
        { status: 400 }
      );
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.userId,
        noteId: noteId,
        amount: note.price
      }
    });

    // Update note download count
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
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}