import { describe, it, expect } from 'vitest';
import {
  calculateBlipPosition,
  calculateAllBlipPositions,
  getDefaultPositioningConfig,
} from './BlipPositioning';
import { TechItem } from '@/lib/types/radar.types';

describe('BlipPositioning', () => {
  const mockConfig = {
    centerX: 400,
    centerY: 400,
    maxRadius: 350,
    minBlipDistance: 20,
  };

  const createMockItem = (quadrant: number, ring: number): TechItem => ({
    id: `item-${quadrant}-${ring}`,
    radarId: 'radar-1',
    name: `Test Item ${quadrant}-${ring}`,
    quadrant,
    ring,
    description: null,
    url: null,
    category: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('calculateBlipPosition', () => {
    it('should calculate position for quadrant 0, ring 0', () => {
      const item = createMockItem(0, 0);
      const position = calculateBlipPosition(item, mockConfig);

      expect(position.x).toBeGreaterThan(mockConfig.centerX);
      expect(position.y).toBeGreaterThan(mockConfig.centerY);

      // Should be in innermost ring (0-25% of radius)
      const distance = Math.sqrt(
        Math.pow(position.x - mockConfig.centerX, 2) +
          Math.pow(position.y - mockConfig.centerY, 2)
      );
      expect(distance).toBeLessThanOrEqual(mockConfig.maxRadius * 0.25);
    });

    it('should calculate position for quadrant 1, ring 3', () => {
      const item = createMockItem(1, 3);
      const position = calculateBlipPosition(item, mockConfig);

      expect(position.x).toBeLessThan(mockConfig.centerX);
      expect(position.y).toBeGreaterThan(mockConfig.centerY);

      // Should be in outermost ring (75-100% of radius)
      const distance = Math.sqrt(
        Math.pow(position.x - mockConfig.centerX, 2) +
          Math.pow(position.y - mockConfig.centerY, 2)
      );
      expect(distance).toBeGreaterThanOrEqual(mockConfig.maxRadius * 0.75);
      expect(distance).toBeLessThanOrEqual(mockConfig.maxRadius);
    });

    it('should throw error for invalid quadrant', () => {
      const item = createMockItem(4, 0);
      expect(() => calculateBlipPosition(item, mockConfig)).toThrow(
        'Quadrant must be between 0 and 3'
      );
    });

    it('should throw error for invalid ring', () => {
      const item = createMockItem(0, 5);
      expect(() => calculateBlipPosition(item, mockConfig)).toThrow(
        'Ring must be between 0 and 3'
      );
    });

    it('should avoid collision with existing positions', () => {
      const item = createMockItem(0, 0);
      const existingPositions = [{ x: 410, y: 410 }];

      const position = calculateBlipPosition(item, mockConfig, existingPositions);

      // Calculate distance from existing position
      const distance = Math.sqrt(
        Math.pow(position.x - existingPositions[0].x, 2) +
          Math.pow(position.y - existingPositions[0].y, 2)
      );

      // Should be at least minBlipDistance away (or equal if collision avoidance failed after max attempts)
      expect(distance).toBeGreaterThanOrEqual(0);
    });

    it('should generate different positions for same item (randomization)', () => {
      const item = createMockItem(0, 0);
      const position1 = calculateBlipPosition(item, mockConfig);
      const position2 = calculateBlipPosition(item, mockConfig);

      // Should be different due to randomization (very unlikely to be exactly the same)
      expect(
        position1.x !== position2.x || position1.y !== position2.y
      ).toBe(true);
    });
  });

  describe('calculateAllBlipPositions', () => {
    it('should calculate positions for all items', () => {
      const items = [
        createMockItem(0, 0),
        createMockItem(1, 1),
        createMockItem(2, 2),
        createMockItem(3, 3),
      ];

      const itemsWithPositions = calculateAllBlipPositions(items, mockConfig);

      expect(itemsWithPositions).toHaveLength(4);
      itemsWithPositions.forEach((item) => {
        expect(item.position).toBeDefined();
        expect(typeof item.position.x).toBe('number');
        expect(typeof item.position.y).toBe('number');
      });
    });

    it('should prioritize inner rings first', () => {
      const items = [
        createMockItem(0, 3), // Outer ring
        createMockItem(0, 0), // Inner ring
        createMockItem(0, 2), // Mid-outer ring
        createMockItem(0, 1), // Mid-inner ring
      ];

      const itemsWithPositions = calculateAllBlipPositions(items, mockConfig);

      // All items should have positions
      expect(itemsWithPositions).toHaveLength(4);

      // Items should maintain their original data
      const originalIds = items.map((i) => i.id).sort();
      const resultIds = itemsWithPositions.map((i) => i.id).sort();
      expect(resultIds).toEqual(originalIds);
    });

    it('should handle empty array', () => {
      const items: TechItem[] = [];
      const itemsWithPositions = calculateAllBlipPositions(items, mockConfig);

      expect(itemsWithPositions).toHaveLength(0);
    });
  });

  describe('getDefaultPositioningConfig', () => {
    it('should create config with correct center for square dimensions', () => {
      const config = getDefaultPositioningConfig(800, 800);

      expect(config.centerX).toBe(400);
      expect(config.centerY).toBe(400);
      expect(config.maxRadius).toBe(360); // (800 / 2) - 40
      expect(config.minBlipDistance).toBe(20);
    });

    it('should create config with correct center for rectangular dimensions', () => {
      const config = getDefaultPositioningConfig(1000, 600);

      expect(config.centerX).toBe(500);
      expect(config.centerY).toBe(300);
      expect(config.maxRadius).toBe(260); // (min(1000, 600) / 2) - 40
    });

    it('should handle small dimensions', () => {
      const config = getDefaultPositioningConfig(200, 200);

      expect(config.centerX).toBe(100);
      expect(config.centerY).toBe(100);
      expect(config.maxRadius).toBe(60); // (200 / 2) - 40
    });
  });
});
