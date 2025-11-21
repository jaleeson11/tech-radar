import { useCallback } from 'react';
import useSWR from 'swr';
import { TechItem } from '@prisma/client';
import { itemsApi, CreateItemRequest, UpdateItemRequest } from '@/lib/api/items';
import { MAX_ITEMS_PER_RADAR } from '@/lib/constants/defaults';
import { AxiosError } from 'axios';

export function useTechItems(radarId: string, initialItems: TechItem[] = []) {
  // Use SWR for data fetching with automatic polling
  const { data: items, error: swrError, mutate, isLoading } = useSWR<TechItem[]>(
    radarId ? `/radars/${radarId}/items` : null,
    () => itemsApi.getByRadarId(radarId),
    {
      fallbackData: initialItems,
      refreshInterval: 15000, // Poll every 15 seconds (free-tier friendly)
      revalidateOnFocus: true, // Refresh when user returns to tab
      revalidateOnReconnect: true,
      revalidateIfStale: true, // Revalidate if data is stale
      dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
    }
  );

  const error = swrError?.message || null;

  const addTechItem = useCallback(
    async (data: CreateItemRequest): Promise<{ success: boolean; item?: TechItem; error?: string }> => {
      try {
        // Client-side validation: Check item count limit
        if ((items || []).length >= MAX_ITEMS_PER_RADAR) {
          const errorMsg = `Cannot add more items. Maximum limit of ${MAX_ITEMS_PER_RADAR} items reached.`;
          return { success: false, error: errorMsg };
        }

        // Make API request to add tech item using axios client
        const newItem = await itemsApi.create(radarId, data);

        // Optimistically update SWR cache
        await mutate(
          (currentItems) => [...(currentItems || []), newItem],
          { revalidate: true }
        );

        return { success: true, item: newItem };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        return { success: false, error: errorMsg };
      }
    },
    [radarId, items, mutate]
  );

  const updateTechItem = useCallback(
    async (id: string, data: UpdateItemRequest): Promise<{ success: boolean; item?: TechItem; error?: string }> => {
      try {
        // Make API request to update tech item using axios client
        const updatedItem = await itemsApi.update(id, data);

        // Optimistically update SWR cache
        await mutate(
          (currentItems) =>
            (currentItems || []).map((item) => (item.id === id ? updatedItem : item)),
          { revalidate: true }
        );

        return { success: true, item: updatedItem };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        return { success: false, error: errorMsg };
      }
    },
    [mutate]
  );

  const deleteTechItem = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Make API request to delete tech item using axios client
        await itemsApi.delete(id);

        // Optimistically update SWR cache by removing the item
        await mutate(
          (currentItems) => (currentItems || []).filter((item) => item.id !== id),
          { revalidate: true }
        );

        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        return { success: false, error: errorMsg };
      }
    },
    [mutate]
  );

  const refreshItems = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Force SWR to revalidate data
      await mutate();
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof AxiosError && err.response?.data?.error
        ? err.response.data.error
        : err instanceof Error
        ? err.message
        : 'An unexpected error occurred';

      return { success: false, error: errorMsg };
    }
  }, [mutate]);

  return {
    items: items || [],
    isLoading,
    error,
    addTechItem,
    updateTechItem,
    deleteTechItem,
    refreshItems,
  };
}
