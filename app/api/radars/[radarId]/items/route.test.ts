import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST, GET } from './route';
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
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    techItem: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;

describe('/api/radars/[radarId]/items', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/radars/[radarId]/items', () => {
    it('should create a new tech item successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
        _count: { items: 5 },
      });

      const mockTechItem = {
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
      };

      (prisma.techItem.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockTechItem);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: 0,
          description: 'A JavaScript library',
          url: 'https://react.dev',
          category: 'Frontend',
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('React');
      expect(data.quadrant).toBe(0);
      expect(data.ring).toBe(0);
    });

    it('should return 401 if user is not authenticated and radar has view permission', async () => {
      mockGetServerSession.mockResolvedValue(null);

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
        permission: 'view',
        _count: { items: 5 },
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: 0,
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Unauthorized');
    });

    it('should return 404 if radar not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/nonexistent/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: 0,
        }),
      });

      const response = await POST(req, { params: { radarId: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Radar not found');
    });

    it('should return 403 if user is not the owner and radar has view permission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'different-user',
        permission: 'view',
        _count: { items: 5 },
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: 0,
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Forbidden');
    });

    it('should allow guest to create item when radar has edit permission', async () => {
      mockGetServerSession.mockResolvedValue(null);

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'owner-user',
        permission: 'edit',
        _count: { items: 5 },
      });

      const mockTechItem = {
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
      };

      (prisma.techItem.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockTechItem);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: 0,
          description: 'A JavaScript library',
          url: 'https://react.dev',
          category: 'Frontend',
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('React');
    });

    it('should allow non-owner to create item when radar has edit permission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'collaborator@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-2',
        email: 'collaborator@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
        permission: 'edit',
        _count: { items: 5 },
      });

      const mockTechItem = {
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
      };

      (prisma.techItem.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockTechItem);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Vue',
          quadrant: 0,
          ring: 1,
          description: 'Progressive framework',
          url: 'https://vuejs.org',
          category: 'Frontend',
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('Vue');
    });

    it('should return 400 if item limit reached', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
        _count: { items: 200 }, // Max limit
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: 0,
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Maximum of 200 items');
    });

    it('should return 400 if quadrant index is invalid', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
        _count: { items: 5 },
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 4, // Invalid: should be 0-3
          ring: 0,
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });

    it('should return 400 if ring index is invalid', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
        _count: { items: 5 },
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'React',
          quadrant: 0,
          ring: -1, // Invalid: should be 0-3
        }),
      });

      const response = await POST(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });

  describe('GET /api/radars/[radarId]/items', () => {
    it('should return all tech items for a radar', async () => {
      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
      });

      const mockItems = [
        {
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
        },
        {
          id: 'item-2',
          radarId: 'radar-1',
          name: 'Vue',
          quadrant: 0,
          ring: 1,
          description: 'Progressive framework',
          url: 'https://vuejs.org',
          category: 'Frontend',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.techItem.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockItems);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items');
      const response = await GET(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('React');
      expect(data[1].name).toBe('Vue');
    });

    it('should return 404 if radar not found', async () => {
      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/nonexistent/items');
      const response = await GET(req, { params: { radarId: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Radar not found');
    });

    it('should return empty array if radar has no items', async () => {
      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'My Radar',
        ownerId: 'user-1',
      });

      (prisma.techItem.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1/items');
      const response = await GET(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(0);
    });
  });
});
