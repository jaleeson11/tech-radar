import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PATCH, DELETE } from './route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    radar: {
      update: vi.fn(),
    },
    techItem: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;

describe('/api/items/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PATCH /api/items/[id]', () => {
    it('should update tech item successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      const existingItem = {
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'Old description',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'user-1',
          permission: 'edit',
        },
      };

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(existingItem);

      const updatedItem = {
        ...existingItem,
        description: 'New description',
        ring: 1,
      };

      (prisma.techItem.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedItem);

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'New description',
          ring: 1,
        }),
      });

      const response = await PATCH(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.description).toBe('New description');
      expect(data.ring).toBe(1);
    });

    it('should return 401 if user is not authenticated and radar has view permission', async () => {
      mockGetServerSession.mockResolvedValue(null);

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        radar: {
          ownerId: 'user-1',
          permission: 'view',
        },
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({ description: 'New description' }),
      });

      const response = await PATCH(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Unauthorized');
    });

    it('should return 404 if tech item not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/items/nonexistent', {
        method: 'PATCH',
        body: JSON.stringify({ description: 'New description' }),
      });

      const response = await PATCH(req, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Tech item not found');
    });

    it('should return 403 if user is not the radar owner and radar has view permission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'Old description',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'different-user',
          permission: 'view',
        },
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({ description: 'New description' }),
      });

      const response = await PATCH(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Forbidden');
    });

    it('should allow guest to update item when radar has edit permission', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const existingItem = {
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'Old description',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'owner-user',
          permission: 'edit',
        },
      };

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(existingItem);
      (prisma.techItem.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        ...existingItem,
        description: 'New description',
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({ description: 'New description' }),
      });

      const response = await PATCH(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.description).toBe('New description');
    });

    it('should allow non-owner to update item when radar has edit permission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'collaborator@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-2',
        email: 'collaborator@example.com',
      });

      const existingItem = {
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'Old description',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'user-1',
          permission: 'edit',
        },
      };

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(existingItem);
      (prisma.techItem.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        ...existingItem,
        ring: 2,
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({ ring: 2 }),
      });

      const response = await PATCH(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ring).toBe(2);
    });

    it('should return 400 if validation fails', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'Old description',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'user-1',
        },
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'PATCH',
        body: JSON.stringify({ quadrant: 5 }), // Invalid: should be 0-3
      });

      const response = await PATCH(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });

  describe('DELETE /api/items/[id]', () => {
    it('should delete tech item successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'A JavaScript library',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'user-1',
          permission: 'edit',
        },
      });

      (prisma.techItem.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Tech item deleted successfully');
      expect(prisma.techItem.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    });

    it('should return 401 if user is not authenticated and radar has view permission', async () => {
      mockGetServerSession.mockResolvedValue(null);

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        radar: {
          ownerId: 'user-1',
          permission: 'view',
        },
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Unauthorized');
    });

    it('should return 404 if tech item not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/items/nonexistent', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Tech item not found');
    });

    it('should return 403 if user is not the radar owner and radar has view permission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'A JavaScript library',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'different-user',
          permission: 'view',
        },
      });

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Forbidden');
    });

    it('should allow guest to delete item when radar has edit permission', async () => {
      mockGetServerSession.mockResolvedValue(null);

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'React',
        quadrant: 0,
        ring: 0,
        description: 'A JavaScript library',
        url: 'https://react.dev',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'owner-user',
          permission: 'edit',
        },
      });

      (prisma.techItem.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Tech item deleted successfully');
    });

    it('should allow non-owner to delete item when radar has edit permission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'collaborator@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-2',
        email: 'collaborator@example.com',
      });

      (prisma.techItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'item-1',
        radarId: 'radar-1',
        name: 'Vue',
        quadrant: 0,
        ring: 1,
        description: 'Progressive framework',
        url: 'https://vuejs.org',
        category: 'Frontend',
        createdAt: new Date(),
        updatedAt: new Date(),
        radar: {
          ownerId: 'user-1',
          permission: 'edit',
        },
      });

      (prisma.techItem.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const req = new NextRequest('http://localhost:3000/api/items/item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { id: 'item-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Tech item deleted successfully');
    });
  });
});
