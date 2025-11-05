import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateTechItemSchema } from '@/lib/validations/techItem';
import { ZodError } from 'zod';

// PATCH /api/items/[id] - Update a tech item
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if tech item exists
    const existingItem = await prisma.techItem.findUnique({
      where: { id },
      select: { id: true, radarId: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Tech item not found' },
        { status: 404 }
      );
    }

    // Anyone with access to the radar can edit items (authenticated or guest)

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
    const { id } = await params;

    // Check if tech item exists
    const existingItem = await prisma.techItem.findUnique({
      where: { id },
      select: { id: true, radarId: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Tech item not found' },
        { status: 404 }
      );
    }

    // Anyone with access to the radar can edit items (authenticated or guest)

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
