import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/radars/shared - List all radars shared with the authenticated user
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

    // Fetch all radars the user has accessed (but doesn't own)
    const sharedRadars = await prisma.radarAccess.findMany({
      where: { userId: user.id },
      orderBy: { lastViewed: 'desc' },
      include: {
        radar: {
          select: {
            id: true,
            name: true,
            shareToken: true,
            createdAt: true,
            updatedAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: { items: true },
            },
          },
        },
      },
    });

    // Transform to match the expected format
    const radars = sharedRadars.map((access) => ({
      ...access.radar,
      lastViewed: access.lastViewed,
    }));

    return NextResponse.json(radars, { status: 200 });
  } catch (error) {
    console.error('Error fetching shared radars:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
