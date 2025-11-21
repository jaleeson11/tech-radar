import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from './route';
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
    radarAccess: {
      findMany: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;

describe('/api/radars/shared', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/radars/shared', () => {
    it('should return shared radars for authenticated user', async () => {
      // Mock authenticated session
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      // Mock user
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      // Mock shared radars
      const mockSharedRadars = [
        {
          id: 'access-1',
          radarId: 'radar-1',
          userId: 'user-1',
          lastViewed: new Date('2024-01-20T00:00:00Z'),
          createdAt: new Date('2024-01-15T00:00:00Z'),
          radar: {
            id: 'radar-1',
            name: 'Shared Tech Radar',
            shareToken: 'token-1',
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-15T00:00:00Z'),
            owner: {
              id: 'owner-1',
              name: 'Owner User',
              email: 'owner@example.com',
            },
            _count: { items: 10 },
          },
        },
        {
          id: 'access-2',
          radarId: 'radar-2',
          userId: 'user-1',
          lastViewed: new Date('2024-01-18T00:00:00Z'),
          createdAt: new Date('2024-01-10T00:00:00Z'),
          radar: {
            id: 'radar-2',
            name: 'Another Shared Radar',
            shareToken: 'token-2',
            createdAt: new Date('2024-01-05T00:00:00Z'),
            updatedAt: new Date('2024-01-12T00:00:00Z'),
            owner: {
              id: 'owner-2',
              name: 'Another Owner',
              email: 'another@example.com',
            },
            _count: { items: 5 },
          },
        },
      ];

      (prisma.radarAccess.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockSharedRadars);

      // Create request
      const req = new NextRequest('http://localhost:3000/api/radars/shared', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Shared Tech Radar');
      expect(data[0].owner.name).toBe('Owner User');
      expect(data[0].lastViewed).toBeDefined();
      expect(data[1].name).toBe('Another Shared Radar');

      // Verify Prisma query
      expect(prisma.radarAccess.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
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
    });

    it('should return empty array when no shared radars exist', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radarAccess.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const req = new NextRequest('http://localhost:3000/api/radars/shared', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/shared', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 if user not found in database', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/shared', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radarAccess.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      );

      const req = new NextRequest('http://localhost:3000/api/radars/shared', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
