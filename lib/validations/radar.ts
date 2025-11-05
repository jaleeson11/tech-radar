import { z } from 'zod';

// Validation schema for creating a radar
export const createRadarSchema = z.object({
  name: z.string().min(1, 'Radar name is required').max(100, 'Radar name must be 100 characters or less'),
  quadrants: z.array(z.string()).length(4, 'Must provide exactly 4 quadrant names').optional(),
  rings: z.array(z.string()).length(4, 'Must provide exactly 4 ring names').optional(),
});

// Validation schema for updating a radar
export const updateRadarSchema = z.object({
  name: z.string().min(1, 'Radar name is required').max(100, 'Radar name must be 100 characters or less').optional(),
  quadrants: z.array(z.string()).length(4, 'Must provide exactly 4 quadrant names').optional(),
  rings: z.array(z.string()).length(4, 'Must provide exactly 4 ring names').optional(),
});

export type CreateRadarInput = z.infer<typeof createRadarSchema>;
export type UpdateRadarInput = z.infer<typeof updateRadarSchema>;
