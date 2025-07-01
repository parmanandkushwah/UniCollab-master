import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET_NOT_FOUND',
    DATABASE_URL: process.env.DATABASE_URL || 'DATABASE_URL_NOT_FOUND'
  });
}
