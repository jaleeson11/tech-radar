import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createRadarSchema } from '@/lib/validations/radar';
import { DEFAULT_QUADRANTS, DEFAULT_RINGS, MAX_RADARS_PER_USER } from '@/lib/constants/defaults';
import { ZodError } from 'zod';

// POST /api/radars - Create a new radar
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { radars: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check radar limit
    if (user.radars.length >= MAX_RADARS_PER_USER) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_RADARS_PER_USER} radars per user reached` },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createRadarSchema.parse(body);

    // Create radar with default quadrants and rings if not provided
    const radar = await prisma.radar.create({
      data: {
        name: validatedData.name,
        ownerId: user.id,
        quadrants: validatedData.quadrants || DEFAULT_QUADRANTS,
        rings: validatedData.rings || DEFAULT_RINGS,
      },
    });

    return NextResponse.json(radar, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating radar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/radars - List all radars for authenticated user
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all radars for the user
    const radars = await prisma.radar.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        shareToken: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(radars, { status: 200 });
  } catch (error) {
    console.error('Error fetching radars:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
