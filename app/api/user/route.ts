import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
const cookie = require('cookie');
 // ✅ Corrected import

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  const token = cookies['auth-token'];

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      fullName: true,
      email: true
    }
  });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  const token = cookies['auth-token'];

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, email } = body;

  const updatedUser = await prisma.user.update({
    where: { id: decoded.userId },
    data: {
      fullName,
      email
    },
    select: {
      fullName: true,
      email: true
    }
  });

  return NextResponse.json(updatedUser);
}
