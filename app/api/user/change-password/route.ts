import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
const cookie = require('cookie');


export async function POST(req: NextRequest) {
  const token = cookie.parse(req.headers.get('cookie') || '')['auth-token'];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { oldPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: {
      password: hashed
    }
  });

  return NextResponse.json({ message: 'Password updated successfully' });
}
