import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, fullName, university } = req.body;

    if (!email || !password || !fullName || !university) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 🔍 Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 🔍 Find university by name
    const universityRecord = await prisma.university.findFirst({
      where: {
        name: {
          equals: university,
          mode: 'insensitive',
        },
      },
    });

    if (!universityRecord) {
      return res.status(400).json({ error: 'Invalid university name' });
    }

    // 🔐 Hash password
    const hashedPassword = await hashPassword(password);

    // 🧑‍🎓 Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        universityId: universityRecord.id,
      },
    });

    return res.status(201).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
