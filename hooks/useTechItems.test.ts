import { renderHook, act, waitFor } from '@testing-library/react';
import { useTechItems } from './useTechItems';
import { itemsApi } from '@/lib/api/items';
import { TechItem } from '@prisma/client';
import { AxiosError } from 'axios';

// Mock the API
vi.mock('@/lib/api/items', () => ({
  itemsApi: {
    getByRadarId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useTechItems', () => {
  const mockRadarId = 'radar-123';
  const mockItem: TechItem = {
    id: 'item-1',
    radarId: mockRadarId,
    name: 'React',
    quadrant: 0,
    ring: 0,
    description: 'UI Library',
    url: 'https://react.dev',
    category: 'Frontend',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockItem2: TechItem = {
    id: 'item-2',
    radarId: mockRadarId,
    name: 'Vue',
    quadrant: 0,
    ring: 1,
    description: 'UI Framework',
    url: 'https://vuejs.org',
    category: 'Frontend',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with empty items array', () => {
      const { result } = renderHook(() => useTechItems(mockRadarId));

      expect(result.current.items).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should initialize with provided initial items', () => {
      const initialItems = [mockItem, mockItem2];
      const { result } = renderHook(() => useTechItems(mockRadarId, initialItems));

      expect(result.current.items).toEqual(initialItems);
    });
  });

  describe('addTechItem', () => {
    it('should add a tech item successfully', async () => {
      vi.mocked(itemsApi.create).mockResolvedValueOnce(mockItem);

      const { result } = renderHook(() => useTechItems(mockRadarId));

      let addResult;
      await act(async () => {
        addResult = await result.current.addTechItem({
          name: 'React',
          quadrant: 0,
          ring: 0,
          description: 'UI Library',
          url: 'https://react.dev',
          category: 'Frontend',
        });
      });

      expect(addResult).toEqual({ success: true, item: mockItem });
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(mockItem);
      expect(result.current.error).toBeNull();
    });

    it('should handle API error when adding item', async () => {
      const axiosError = new Error('Failed to create item') as AxiosError<{ error: string }>;
      axiosError.response = {
        data: { error: 'Failed to create item' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };
      axiosError.isAxiosError = true;

      vi.mocked(itemsApi.create).mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useTechItems(mockRadarId));

      let addResult;
      await act(async () => {
        addResult = await result.current.addTechItem({
          name: 'React',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(addResult).toEqual({ success: false, error: 'Failed to create item' });
      expect(result.current.items).toHaveLength(0);
      expect(result.current.error).toBe('Failed to create item');
    });

    it('should enforce 200 item limit', async () => {
      const items = Array.from({ length: 200 }, (_, i) => ({
        ...mockItem,
        id: `item-${i}`,
        name: `Item ${i}`,
      }));

      const { result } = renderHook(() => useTechItems(mockRadarId, items));

      let addResult;
      await act(async () => {
        addResult = await result.current.addTechItem({
          name: 'New Item',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(addResult?.success).toBe(false);
      expect(addResult?.error).toContain('Maximum limit of 200 items reached');
      expect(result.current.items).toHaveLength(200);
      expect(itemsApi.create).not.toHaveBeenCalled();
    });

    it('should set loading state during add operation', async () => {
      vi.mocked(itemsApi.create).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockItem), 100))
      );

      const { result } = renderHook(() => useTechItems(mockRadarId));

      let promise;
      act(() => {
        promise = result.current.addTechItem({
          name: 'React',
          quadrant: 0,
          ring: 0,
        });
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await promise;
      });

      // Should finish loading
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('updateTechItem', () => {
    it('should update a tech item successfully', async () => {
      const updatedItem = { ...mockItem, name: 'React 18' };
      vi.mocked(itemsApi.update).mockResolvedValueOnce(updatedItem);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem]));

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updateTechItem(mockItem.id, {
          name: 'React 18',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(updateResult).toEqual({ success: true, item: updatedItem });
      expect(result.current.items[0].name).toBe('React 18');
      expect(result.current.error).toBeNull();
    });

    it('should handle API error when updating item', async () => {
      const axiosError = new Error('Item not found') as AxiosError<{ error: string }>;
      axiosError.response = {
        data: { error: 'Item not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };
      axiosError.isAxiosError = true;

      vi.mocked(itemsApi.update).mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem]));

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updateTechItem(mockItem.id, {
          name: 'React 18',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(updateResult).toEqual({ success: false, error: 'Item not found' });
      expect(result.current.items[0].name).toBe('React'); // Unchanged
      expect(result.current.error).toBe('Item not found');
    });

    it('should only update the specified item', async () => {
      const updatedItem = { ...mockItem, name: 'React 18' };
      vi.mocked(itemsApi.update).mockResolvedValueOnce(updatedItem);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem, mockItem2]));

      await act(async () => {
        await result.current.updateTechItem(mockItem.id, {
          name: 'React 18',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(result.current.items[0].name).toBe('React 18');
      expect(result.current.items[1].name).toBe('Vue'); // Unchanged
    });
  });

  describe('deleteTechItem', () => {
    it('should delete a tech item successfully', async () => {
      vi.mocked(itemsApi.delete).mockResolvedValueOnce();

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem, mockItem2]));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteTechItem(mockItem.id);
      });

      expect(deleteResult).toEqual({ success: true });
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe(mockItem2.id);
      expect(result.current.error).toBeNull();
    });

    it('should handle API error when deleting item', async () => {
      const axiosError = new Error('Item not found') as AxiosError<{ error: string }>;
      axiosError.response = {
        data: { error: 'Item not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };
      axiosError.isAxiosError = true;

      vi.mocked(itemsApi.delete).mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem]));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteTechItem(mockItem.id);
      });

      expect(deleteResult).toEqual({ success: false, error: 'Item not found' });
      expect(result.current.items).toHaveLength(1); // Still there
      expect(result.current.error).toBe('Item not found');
    });
  });

  describe('refreshItems', () => {
    it('should refresh items from API successfully', async () => {
      const freshItems = [mockItem, mockItem2];
      vi.mocked(itemsApi.getByRadarId).mockResolvedValueOnce(freshItems);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem]));

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshItems();
      });

      expect(refreshResult).toEqual({ success: true });
      expect(result.current.items).toEqual(freshItems);
      expect(result.current.error).toBeNull();
    });

    it('should handle API error when refreshing items', async () => {
      const axiosError = new Error('Radar not found') as AxiosError<{ error: string }>;
      axiosError.response = {
        data: { error: 'Radar not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };
      axiosError.isAxiosError = true;

      vi.mocked(itemsApi.getByRadarId).mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem]));

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshItems();
      });

      expect(refreshResult).toEqual({ success: false, error: 'Radar not found' });
      expect(result.current.items).toEqual([mockItem]); // Unchanged
      expect(result.current.error).toBe('Radar not found');
    });

    it('should replace existing items with fresh data', async () => {
      const freshItems = [mockItem2];
      vi.mocked(itemsApi.getByRadarId).mockResolvedValueOnce(freshItems);

      const { result } = renderHook(() => useTechItems(mockRadarId, [mockItem]));

      await act(async () => {
        await result.current.refreshItems();
      });

      expect(result.current.items).toEqual(freshItems);
      expect(result.current.items).not.toContain(mockItem);
    });
  });

  describe('error handling', () => {
    it('should handle generic errors without response data', async () => {
      const genericError = new Error('Network error');
      vi.mocked(itemsApi.create).mockRejectedValueOnce(genericError);

      const { result } = renderHook(() => useTechItems(mockRadarId));

      let addResult;
      await act(async () => {
        addResult = await result.current.addTechItem({
          name: 'React',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(addResult).toEqual({ success: false, error: 'Network error' });
      expect(result.current.error).toBe('Network error');
    });

    it('should handle unknown error types', async () => {
      vi.mocked(itemsApi.create).mockRejectedValueOnce('Unknown error');

      const { result } = renderHook(() => useTechItems(mockRadarId));

      let addResult;
      await act(async () => {
        addResult = await result.current.addTechItem({
          name: 'React',
          quadrant: 0,
          ring: 0,
        });
      });

      expect(addResult).toEqual({ success: false, error: 'An unexpected error occurred' });
      expect(result.current.error).toBe('An unexpected error occurred');
    });
  });
});
