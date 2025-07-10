import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
const cookie = require('cookie');
 // ✅ default import

export async function DELETE(req: NextRequest) {
  const token = cookie.parse(req.headers.get('cookie') || '')['auth-token'];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.user.delete({
    where: { id: decoded.userId }
  });

  return NextResponse.json({ message: 'Account deleted successfully' });
}
