import apiClient from './client';
import { Radar } from '@prisma/client';

// API Response types
export interface RadarListItem {
  id: string;
  name: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    items: number;
  };
}

export interface CreateRadarRequest {
  name: string;
  quadrants?: string[];
  rings?: string[];
}

export interface UpdateRadarRequest {
  name?: string;
  quadrants?: string[];
  rings?: string[];
}

// Radar API methods
export const radarsApi = {
  /**
   * Get all radars for the authenticated user
   */
  async getAll(): Promise<RadarListItem[]> {
    const response = await apiClient.get<RadarListItem[]>('/radars');
    return response.data;
  },

  /**
   * Get a single radar by ID
   */
  async getById(radarId: string): Promise<Radar> {
    const response = await apiClient.get<Radar>(`/radars/${radarId}`);
    return response.data;
  },

  /**
   * Create a new radar
   */
  async create(data: CreateRadarRequest): Promise<Radar> {
    const response = await apiClient.post<Radar>('/radars', data);
    return response.data;
  },

  /**
   * Update an existing radar
   */
  async update(radarId: string, data: UpdateRadarRequest): Promise<Radar> {
    const response = await apiClient.patch<Radar>(`/radars/${radarId}`, data);
    return response.data;
  },

  /**
   * Delete a radar
   */
  async delete(radarId: string): Promise<void> {
    await apiClient.delete(`/radars/${radarId}`);
  },
};
