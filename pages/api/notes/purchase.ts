import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['auth-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { noteId } = req.body;

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: {
          select: { fullName: true }
        }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_noteId: {
          userId: decoded.userId,
          noteId: noteId
        }
      }
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'You have already purchased this note' });
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.userId,
        noteId: noteId,
        amount: note.price
      }
    });

    // Increment download count
    await prisma.note.update({
      where: { id: noteId },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    return res.status(200).json({
      message: 'Purchase successful',
      purchase,
      driveLink: note.driveLink
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
