import { useState, useCallback } from 'react';
import { TechItem } from '@prisma/client';
import { itemsApi, CreateItemRequest, UpdateItemRequest } from '@/lib/api/items';
import { MAX_ITEMS_PER_RADAR } from '@/lib/constants/defaults';
import { AxiosError } from 'axios';

export function useTechItems(radarId: string, initialItems: TechItem[] = []) {
  const [items, setItems] = useState<TechItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTechItem = useCallback(
    async (data: CreateItemRequest): Promise<{ success: boolean; item?: TechItem; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Client-side validation: Check item count limit
        if (items.length >= MAX_ITEMS_PER_RADAR) {
          const errorMsg = `Cannot add more items. Maximum limit of ${MAX_ITEMS_PER_RADAR} items reached.`;
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Make API request to add tech item using axios client
        const newItem = await itemsApi.create(radarId, data);

        // Update local state with new item
        setItems((prevItems) => [...prevItems, newItem]);

        return { success: true, item: newItem };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [radarId, items.length]
  );

  const updateTechItem = useCallback(
    async (id: string, data: UpdateItemRequest): Promise<{ success: boolean; item?: TechItem; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Make API request to update tech item using axios client
        const updatedItem = await itemsApi.update(id, data);

        // Update local state
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updatedItem : item))
        );

        return { success: true, item: updatedItem };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteTechItem = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Make API request to delete tech item using axios client
        await itemsApi.delete(id);

        // Update local state by removing the item
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));

        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshItems = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch fresh items from API using axios client
      const freshItems = await itemsApi.getByRadarId(radarId);
      setItems(freshItems);

      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof AxiosError && err.response?.data?.error
        ? err.response.data.error
        : err instanceof Error
        ? err.message
        : 'An unexpected error occurred';

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [radarId]);

  return {
    items,
    isLoading,
    error,
    addTechItem,
    updateTechItem,
    deleteTechItem,
    refreshItems,
  };
}
