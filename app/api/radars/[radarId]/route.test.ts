import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, PATCH, DELETE } from './route';
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
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;

describe('/api/radars/[radarId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/radars/[radarId]', () => {
    it('should fetch radar by ID successfully', async () => {
      const mockRadar = {
        id: 'radar-1',
        name: 'My Tech Radar',
        ownerId: 'user-1',
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        owner: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (prisma.radar.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockRadar);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1');
      const response = await GET(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('radar-1');
      expect(data.name).toBe('My Tech Radar');
    });

    it('should fetch radar by shareToken successfully', async () => {
      const mockRadar = {
        id: 'radar-1',
        name: 'My Tech Radar',
        ownerId: 'user-1',
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        owner: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (prisma.radar.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockRadar);

      const req = new NextRequest('http://localhost:3000/api/radars/abc123');
      const response = await GET(req, { params: { radarId: 'abc123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.shareToken).toBe('abc123');
    });

    it('should return 404 if radar not found', async () => {
      (prisma.radar.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/nonexistent');
      const response = await GET(req, { params: { radarId: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Radar not found');
    });
  });

  describe('PATCH /api/radars/[radarId]', () => {
    it('should update radar successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      const existingRadar = {
        id: 'radar-1',
        name: 'Old Name',
        ownerId: 'user-1',
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(existingRadar);

      const updatedRadar = { ...existingRadar, name: 'New Name' };
      (prisma.radar.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedRadar);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' }),
      });

      const response = await PATCH(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('New Name');
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' }),
      });

      const response = await PATCH(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 403 if user is not the owner', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any);

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      (prisma.radar.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'radar-1',
        name: 'Old Name',
        ownerId: 'different-user',
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' }),
      });

      const response = await PATCH(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Forbidden');
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

      const req = new NextRequest('http://localhost:3000/api/radars/nonexistent', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' }),
      });

      const response = await PATCH(req, { params: { radarId: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Radar not found');
    });
  });

  describe('DELETE /api/radars/[radarId]', () => {
    it('should delete radar successfully', async () => {
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
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (prisma.radar.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Radar deleted successfully');
      expect(prisma.radar.delete).toHaveBeenCalledWith({ where: { id: 'radar-1' } });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 403 if user is not the owner', async () => {
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
        shareToken: 'abc123',
        quadrants: ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'],
        rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = new NextRequest('http://localhost:3000/api/radars/radar-1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { radarId: 'radar-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Forbidden');
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

      const req = new NextRequest('http://localhost:3000/api/radars/nonexistent', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { radarId: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Radar not found');
    });
  });
});
