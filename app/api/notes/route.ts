import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, JwtPayload } from '@/lib/auth';
import * as cookie from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookie.parse(cookieHeader);
    const token = cookies['auth-token'];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const {
      title,
      description,
      subject,
      course,
      year,
      price,
      driveLink,
      tags,
      authorId,
      universityId
    } = await req.json();

    if (!title || !description || !subject || !course || !year || !price || !driveLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        description,
        subject,
        course,
        year,
        price: parseFloat(price),
        driveLink,
        tags,
        authorId: decoded.userId,
        universityId,
        isApproved: true, // Notes visible by default
      }
    });

    return NextResponse.json({ message: 'Note uploaded successfully', note: newNote }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ✅ Add this GET method to fetch all notes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const subject = searchParams.get('subject');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const filters: any = {
      isApproved: true,
    };

    if (subject && subject !== 'all') filters.subject = subject;
    if (year && year !== 'all') filters.year = year;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const notes = await prisma.note.findMany({
      where: filters,
      include: {
        author: {
          select: {
            fullName: true,
            university: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
