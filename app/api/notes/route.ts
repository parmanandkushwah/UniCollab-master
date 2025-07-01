import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {};

    if (subject && subject !== 'all') {
      where.subject = {
        contains: subject,
        mode: 'insensitive'
      };
    }

    if (year && year !== 'all') {
      where.year = {
        contains: year,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        author: {
          select: {
            fullName: true,
            university: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true,
            purchases: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(notes);

  } catch (error) {
    console.error('Notes fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, subject, course, year, price, driveLink, tags } = body;

    // Validate Google Drive link
    if (!driveLink || !driveLink.includes('drive.google.com')) {
      return NextResponse.json(
        { error: 'Please provide a valid Google Drive link' },
        { status: 400 }
      );
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
        isApproved: false // Requires approval
      },
      include: {
        author: {
          select: {
            fullName: true,
            university: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Note uploaded successfully and is pending approval',
      note
    });

  } catch (error) {
    console.error('Note upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}