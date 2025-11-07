import { z } from 'zod';

// Validation schema for creating a tech item
export const createTechItemSchema = z.object({
  name: z.string().min(1, 'Tech item name is required').max(100, 'Tech item name must be 100 characters or less'),
  quadrant: z.number().int().min(0, 'Quadrant must be between 0 and 3').max(3, 'Quadrant must be between 0 and 3'),
  ring: z.number().int().min(0, 'Ring must be between 0 and 3').max(3, 'Ring must be between 0 and 3'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().max(50, 'Category must be 50 characters or less').optional(),
  icon: z.string().max(100, 'Icon must be 100 characters or less').optional(),
});

// Validation schema for updating a tech item
export const updateTechItemSchema = z.object({
  name: z.string().min(1, 'Tech item name is required').max(100, 'Tech item name must be 100 characters or less').optional(),
  quadrant: z.number().int().min(0, 'Quadrant must be between 0 and 3').max(3, 'Quadrant must be between 0 and 3').optional(),
  ring: z.number().int().min(0, 'Ring must be between 0 and 3').max(3, 'Ring must be between 0 and 3').optional(),
  positionX: z.number().nullable().optional(),
  positionY: z.number().nullable().optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().max(50, 'Category must be 50 characters or less').optional(),
  icon: z.string().max(100, 'Icon must be 100 characters or less').optional(),
});

export type CreateTechItemInput = z.infer<typeof createTechItemSchema>;
export type UpdateTechItemInput = z.infer<typeof updateTechItemSchema>;
