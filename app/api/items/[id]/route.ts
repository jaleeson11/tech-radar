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
    const { id } = await params;

    // Check if tech item exists and get the radar info
    const existingItem = await prisma.techItem.findUnique({
      where: { id },
      include: {
        radar: {
          select: { ownerId: true, permission: true },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Tech item not found' },
        { status: 404 }
      );
    }

    // Check authentication and permissions
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      // User is logged in - check if they're the owner or radar allows editing
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if user can edit (owner or radar has edit permission)
      if (existingItem.radar.ownerId !== user.id && existingItem.radar.permission !== 'edit') {
        return NextResponse.json(
          { error: 'Forbidden - You do not have permission to edit this radar' },
          { status: 403 }
        );
      }
    } else {
      // No session (guest) - allow only if radar has edit permission
      if (existingItem.radar.permission !== 'edit') {
        return NextResponse.json(
          { error: 'Unauthorized - Please log in to edit this radar' },
          { status: 401 }
        );
      }
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
    const { id } = await params;

    // Check if tech item exists and get the radar info
    const existingItem = await prisma.techItem.findUnique({
      where: { id },
      include: {
        radar: {
          select: { ownerId: true, permission: true },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Tech item not found' },
        { status: 404 }
      );
    }

    // Check authentication and permissions
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      // User is logged in - check if they're the owner or radar allows editing
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if user can edit (owner or radar has edit permission)
      if (existingItem.radar.ownerId !== user.id && existingItem.radar.permission !== 'edit') {
        return NextResponse.json(
          { error: 'Forbidden - You do not have permission to edit this radar' },
          { status: 403 }
        );
      }
    } else {
      // No session (guest) - allow only if radar has edit permission
      if (existingItem.radar.permission !== 'edit') {
        return NextResponse.json(
          { error: 'Unauthorized - Please log in to edit this radar' },
          { status: 401 }
        );
      }
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
