import apiClient from './client';
import { TechItem } from '@prisma/client';

// API Request types
export interface CreateItemRequest {
  name: string;
  quadrant: number;
  ring: number;
  description?: string;
  url?: string;
  category?: string;
}

export interface UpdateItemRequest {
  name?: string;
  quadrant?: number;
  ring?: number;
  positionX?: number;
  positionY?: number;
  description?: string;
  url?: string;
  category?: string;
}

// Tech Items API methods
export const itemsApi = {
  /**
   * Get all items for a specific radar
   */
  async getByRadarId(radarId: string): Promise<TechItem[]> {
    const response = await apiClient.get<TechItem[]>(`/radars/${radarId}/items`);
    return response.data;
  },

  /**
   * Get a single item by ID
   */
  async getById(itemId: string): Promise<TechItem> {
    const response = await apiClient.get<TechItem>(`/items/${itemId}`);
    return response.data;
  },

  /**
   * Create a new item for a radar
   */
  async create(radarId: string, data: CreateItemRequest): Promise<TechItem> {
    const response = await apiClient.post<TechItem>(`/radars/${radarId}/items`, data);
    return response.data;
  },

  /**
   * Update an existing item
   */
  async update(itemId: string, data: UpdateItemRequest): Promise<TechItem> {
    const response = await apiClient.patch<TechItem>(`/items/${itemId}`, data);
    return response.data;
  },

  /**
   * Delete an item
   */
  async delete(itemId: string): Promise<void> {
    await apiClient.delete(`/items/${itemId}`);
  },
};
