import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth-token')?.value;

  // 🔓 Allow static files and public assets (very important for manifest, icons, etc.)
  const isPublicFile = [
    '/site.webmanifest',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ].includes(pathname) || pathname.startsWith('/_next/') || pathname.includes('.');

  if (isPublicFile) {
    return NextResponse.next();
  }

  // 🔐 Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // Match everything (we'll filter inside)
};
