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
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;

describe('/api/radars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/radars', () => {
    it('should create a new radar successfully', async () => {
      // Mock authenticated session
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      // Mock user with less than 10 radars
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        radars: [],
      });

      // Mock radar creation
      const mockRadar = {
        id: 'radar-1',
        name: 'My Tech Radar',
        ownerId: 'user-1',
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.radar.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockRadar);

      // Create request
      const req = new NextRequest('http://localhost:3000/api/radars', {
        method: 'POST',
        body: JSON.stringify({ name: 'My Tech Radar' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('My Tech Radar');
      expect(prisma.radar.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'My Tech Radar',
          ownerId: 'user-1',
        }),
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars', {
        method: 'POST',
        body: JSON.stringify({ name: 'My Tech Radar' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 if user has reached radar limit', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      // Mock user with 10 radars (max limit)
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        radars: new Array(10).fill({}),
      });

      const req = new NextRequest('http://localhost:3000/api/radars', {
        method: 'POST',
        body: JSON.stringify({ name: 'My Tech Radar' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Maximum of 10 radars');
    });

    it('should return 400 if validation fails', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        radars: [],
      });

      const req = new NextRequest('http://localhost:3000/api/radars', {
        method: 'POST',
        body: JSON.stringify({ name: '' }), // Invalid: empty name
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });

  describe('GET /api/radars', () => {
    it('should return all radars for authenticated user', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      const mockRadars = [
        {
          id: 'radar-1',
          name: 'Radar 1',
          shareToken: 'token1',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { items: 5 },
        },
        {
          id: 'radar-2',
          name: 'Radar 2',
          shareToken: 'token2',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { items: 3 },
        },
      ];
      (prisma.radar.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRadars);

      const req = new NextRequest('http://localhost:3000/api/radars', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Radar 1');
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars', {
        method: 'GET',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
