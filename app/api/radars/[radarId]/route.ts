import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateRadarSchema } from '@/lib/validations/radar';
import { ZodError } from 'zod';

// GET /api/radars/[radarId] - Fetch radar by ID or shareToken
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ radarId: string }> }
) {
  try {
    const { radarId } = await params;

    // Try to fetch by ID first, then by shareToken
    const radar = await prisma.radar.findFirst({
      where: {
        OR: [{ id: radarId }, { shareToken: radarId }],
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!radar) {
      return NextResponse.json({ error: 'Radar not found' }, { status: 404 });
    }

    return NextResponse.json(radar, { status: 200 });
  } catch (error) {
    console.error('Error fetching radar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/radars/[radarId] - Update radar (name, quadrants, rings)
export async function PATCH(
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

    // Check if radar exists and user is the owner
    const existingRadar = await prisma.radar.findUnique({
      where: { id: radarId },
    });

    if (!existingRadar) {
      return NextResponse.json({ error: 'Radar not found' }, { status: 404 });
    }

    if (existingRadar.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You are not the owner of this radar' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateRadarSchema.parse(body);

    // Update radar (updatedAt will be set automatically by Prisma @updatedAt)
    const updatedRadar = await prisma.radar.update({
      where: { id: radarId },
      data: validatedData,
    });

    return NextResponse.json(updatedRadar, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating radar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/radars/[radarId] - Delete radar (owner only)
export async function DELETE(
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

    // Check if radar exists and user is the owner
    const existingRadar = await prisma.radar.findUnique({
      where: { id: radarId },
    });

    if (!existingRadar) {
      return NextResponse.json({ error: 'Radar not found' }, { status: 404 });
    }

    if (existingRadar.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You are not the owner of this radar' },
        { status: 403 }
      );
    }

    // Delete radar (cascade will delete associated items)
    await prisma.radar.delete({
      where: { id: radarId },
    });

    return NextResponse.json(
      { message: 'Radar deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting radar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
