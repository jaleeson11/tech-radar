import { Radar, TechItem, User } from '@prisma/client';
import { Prisma } from '@prisma/client';

// Re-export Prisma types for convenience
export type { Radar, TechItem, User };

// Complex query types with includes
export type RadarWithItems = Prisma.RadarGetPayload<{
  include: { items: true };
}>;

export type RadarWithItemsAndOwner = Prisma.RadarGetPayload<{
  include: { items: true; owner: true };
}>;

export type RadarWithOwner = Prisma.RadarGetPayload<{
  include: { owner: true };
}>;

export type TechItemWithRadar = Prisma.TechItemGetPayload<{
  include: { radar: true };
}>;

// UI-specific types for radar visualization

// Blip position for D3.js visualization
export interface BlipPosition {
  x: number; // X coordinate in SVG
  y: number; // Y coordinate in SVG
}

// Extended tech item with position for rendering
export interface TechItemWithPosition extends TechItem {
  position: BlipPosition;
}

// Quadrant configuration
export interface QuadrantConfig {
  index: number; // 0-3
  name: string;
  startAngle: number; // In degrees (0, 90, 180, 270)
  endAngle: number; // In degrees (90, 180, 270, 360)
}

// Ring configuration
export interface RingConfig {
  index: number; // 0-3
  name: string;
  innerRadius: number; // Inner radius percentage (0-100)
  outerRadius: number; // Outer radius percentage (0-100)
}

// Radar visualization configuration
export interface RadarVisualizationConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  maxRadius: number;
  quadrants: QuadrantConfig[];
  rings: RingConfig[];
}

// API Response types
export interface RadarListResponse {
  id: string;
  name: string;
  shareToken: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    items: number;
  };
}

export interface ApiError {
  error: string;
  details?: any;
}

export interface ApiSuccess {
  message: string;
}
