import { useCallback } from 'react';
import useSWR from 'swr';
import { radarsApi } from '@/lib/api/radars';
import { RadarWithOwner } from '@/lib/types/radar.types';
import { AxiosError } from 'axios';

export interface UpdateRadarData {
  name?: string;
  quadrants?: string[];
  rings?: string[];
}

export function useRadar(shareToken: string) {
  // Use SWR for data fetching with automatic polling
  const { data: radar, error: swrError, mutate, isLoading } = useSWR<RadarWithOwner>(
    shareToken ? `/radars/${shareToken}` : null,
    () => radarsApi.getById(shareToken),
    {
      refreshInterval: 30000, // Poll every 30 seconds (free-tier friendly)
      revalidateOnFocus: true, // Refresh when user returns to tab
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 10000, // Prevent duplicate requests within 10 seconds
    }
  );

  const error = swrError?.message || null;

  const updateRadar = useCallback(
    async (data: UpdateRadarData): Promise<{ success: boolean; radar?: RadarWithOwner; error?: string }> => {
      if (!radar) {
        return { success: false, error: 'No radar loaded' };
      }

      try {
        // Make API request to update radar
        const updatedRadar = await radarsApi.update(radar.id, data);

        // Optimistically update SWR cache, preserving the owner data
        await mutate(
          (currentRadar) => {
            if (!currentRadar) return currentRadar;
            return {
              ...currentRadar,
              ...updatedRadar,
              owner: currentRadar.owner, // Preserve owner data
            };
          },
          { revalidate: true }
        );

        // Return the merged radar with owner data
        return {
          success: true,
          radar: { ...radar, ...updatedRadar }
        };
      } catch (err) {
        const errorMsg = err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred';

        return { success: false, error: errorMsg };
      }
    },
    [radar, mutate]
  );

  const refreshRadar = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
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
    radar,
    isLoading,
    error,
    updateRadar,
    refreshRadar,
  };
}
