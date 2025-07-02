import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { subject, year, search, minPrice, maxPrice } = req.query;

      const where: any = {};

      if (subject && subject !== 'all') {
        where.subject = { contains: subject.toString(), mode: 'insensitive' };
      }

      if (year && year !== 'all') {
        where.year = { contains: year.toString(), mode: 'insensitive' };
      }

      if (search) {
        where.OR = [
          { title: { contains: search.toString(), mode: 'insensitive' } },
          { description: { contains: search.toString(), mode: 'insensitive' } },
          { tags: { has: search.toString() } },
        ];
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice.toString());
        if (maxPrice) where.price.lte = parseFloat(maxPrice.toString());
      }

      const notes = await prisma.note.findMany({
        where,
        include: {
          author: {
            select: {
              fullName: true,
              university: { select: { name: true } },
            },
          },
          _count: {
            select: {
              reviews: true,
              purchases: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(notes);
    } catch (error) {
      console.error('Notes Fetch Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
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

      const { title, description, subject, course, year, price, driveLink, tags } = req.body;

      if (!driveLink || !driveLink.includes('drive.google.com')) {
        return res.status(400).json({ error: 'Invalid Google Drive link' });
      }

      const note = await prisma.note.create({
        data: {
          title,
          description,
          subject,
          course,
          year,
          price: parseFloat(price),
          driveLink,
          tags: tags || [],
          authorId: decoded.userId,
          universityId: decoded.universityId,
          isApproved: false,
        },
        include: {
          author: {
            select: {
              fullName: true,
              university: { select: { name: true } },
            },
          },
        },
      });

      return res.status(200).json({
        message: 'Note uploaded successfully and is pending approval',
        note,
      });
    } catch (error) {
      console.error('Note Upload Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
