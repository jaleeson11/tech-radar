import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createTechItemSchema } from '@/lib/validations/techItem';
import { MAX_ITEMS_PER_RADAR } from '@/lib/constants/defaults';
import { ZodError } from 'zod';

// POST /api/radars/[radarId]/items - Add a tech item to a radar
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ radarId: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { radarId } = await params;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if radar exists and get item count
    const radar = await prisma.radar.findUnique({
      where: { id: radarId },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!radar) {
      return NextResponse.json({ error: 'Radar not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (radar.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You are not the owner of this radar' },
        { status: 403 }
      );
    }

    // Check item limit
    if (radar._count.items >= MAX_ITEMS_PER_RADAR) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_ITEMS_PER_RADAR} items per radar reached` },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createTechItemSchema.parse(body);

    // Create tech item and update radar's updatedAt
    const techItem = await prisma.techItem.create({
      data: {
        ...validatedData,
        radarId,
      },
    });

    // Manually trigger radar's updatedAt to track item changes
    await prisma.radar.update({
      where: { id: radarId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(techItem, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating tech item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/radars/[radarId]/items - Get all tech items for a radar
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ radarId: string }> }
) {
  try {
    const { radarId } = await params;

    // Check if radar exists
    const radar = await prisma.radar.findUnique({
      where: { id: radarId },
    });

    if (!radar) {
      return NextResponse.json({ error: 'Radar not found' }, { status: 404 });
    }

    // Fetch all tech items for the radar
    const items = await prisma.techItem.findMany({
      where: { radarId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching tech items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
