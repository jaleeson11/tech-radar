import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateTechItemSchema } from '@/lib/validations/techItem';
import { ZodError } from 'zod';

// PATCH /api/items/[id] - Update a tech item
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if tech item exists and get the radar owner
    const existingItem = await prisma.techItem.findUnique({
      where: { id },
      include: {
        radar: {
          select: { ownerId: true },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Tech item not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner of the radar
    if (existingItem.radar.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You are not the owner of this radar' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateTechItemSchema.parse(body);

    // Update tech item
    const updatedItem = await prisma.techItem.update({
      where: { id },
      data: validatedData,
    });

    // Manually trigger radar's updatedAt to track item changes
    await prisma.radar.update({
      where: { id: existingItem.radarId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating tech item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete a tech item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if tech item exists and get the radar owner
    const existingItem = await prisma.techItem.findUnique({
      where: { id },
      include: {
        radar: {
          select: { ownerId: true },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Tech item not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner of the radar
    if (existingItem.radar.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You are not the owner of this radar' },
        { status: 403 }
      );
    }

    // Delete tech item
    await prisma.techItem.delete({
      where: { id },
    });

    // Manually trigger radar's updatedAt to track item deletion
    await prisma.radar.update({
      where: { id: existingItem.radarId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(
      { message: 'Tech item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tech item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
