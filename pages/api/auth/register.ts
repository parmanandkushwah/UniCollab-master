import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password, fullName, universityId } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 2. Check if universityId is valid
    const universityExists = await prisma.university.findUnique({
      where: { id: universityId },
    });
    if (!universityExists) {
      return res.status(400).json({ error: 'Invalid university ID' });
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        universityId,
      },
    });

    return res.status(200).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
