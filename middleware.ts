import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;

  // Only protect dashboard route
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
