import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    });

    return res.status(200).json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
