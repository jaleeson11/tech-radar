import { TechItem, BlipPosition, TechItemWithPosition } from '@/lib/types/radar.types';

/**
 * Configuration for blip positioning
 */
interface PositioningConfig {
  centerX: number;
  centerY: number;
  maxRadius: number;
  minBlipDistance: number; // Minimum distance between blips to avoid overlap
}

/**
 * Calculate the position of a blip based on its quadrant and ring
 *
 * Quadrants (clockwise from top-right):
 * - 0: Top-right (0° to 90°)
 * - 1: Top-left (90° to 180°)
 * - 2: Bottom-left (180° to 270°)
 * - 3: Bottom-right (270° to 360°)
 *
 * Rings (from center outward):
 * - 0: Adopt (0-25% radius)
 * - 1: Trial (25-50% radius)
 * - 2: Assess (50-75% radius)
 * - 3: Hold (75-100% radius)
 */
export function calculateBlipPosition(
  item: TechItem,
  config: PositioningConfig,
  existingPositions: BlipPosition[] = [],
  maxAttempts: number = 50
): BlipPosition {
  const { centerX, centerY, maxRadius, minBlipDistance } = config;
  const { quadrant, ring } = item;

  // Validate inputs
  if (quadrant < 0 || quadrant > 3) {
    throw new Error('Quadrant must be between 0 and 3');
  }
  if (ring < 0 || ring > 3) {
    throw new Error('Ring must be between 0 and 3');
  }

  // Calculate ring boundaries (as percentage of maxRadius)
  const ringSize = 0.25; // Each ring is 25% of the radius
  const innerRadius = ring * ringSize * maxRadius;
  const outerRadius = (ring + 1) * ringSize * maxRadius;

  // Calculate quadrant angle boundaries (in radians)
  const quadrantStartAngle = (quadrant * Math.PI) / 2;
  const quadrantEndAngle = ((quadrant + 1) * Math.PI) / 2;

  // Try to find a non-overlapping position
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Random angle within the quadrant
    const angle = quadrantStartAngle + Math.random() * (quadrantEndAngle - quadrantStartAngle);

    // Random radius within the ring boundaries
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);

    // Convert polar coordinates to Cartesian
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const position: BlipPosition = { x, y };

    // Check for collision with existing blips
    if (!hasCollision(position, existingPositions, minBlipDistance)) {
      return position;
    }
  }

  // If we couldn't find a non-overlapping position after maxAttempts,
  // return the last calculated position anyway
  const fallbackAngle = quadrantStartAngle + Math.random() * (quadrantEndAngle - quadrantStartAngle);
  const fallbackRadius = innerRadius + Math.random() * (outerRadius - innerRadius);

  return {
    x: centerX + fallbackRadius * Math.cos(fallbackAngle),
    y: centerY + fallbackRadius * Math.sin(fallbackAngle),
  };
}

/**
 * Check if a position collides with any existing positions
 */
function hasCollision(
  position: BlipPosition,
  existingPositions: BlipPosition[],
  minDistance: number
): boolean {
  return existingPositions.some((existing) => {
    const distance = Math.sqrt(
      Math.pow(position.x - existing.x, 2) + Math.pow(position.y - existing.y, 2)
    );
    return distance < minDistance;
  });
}

/**
 * Calculate positions for all tech items in a radar
 */
export function calculateAllBlipPositions(
  items: TechItem[],
  config: PositioningConfig
): TechItemWithPosition[] {
  const positions: BlipPosition[] = [];
  const itemsWithPositions: TechItemWithPosition[] = [];

  // Sort items by ring (innermost first) to prioritize placement
  const sortedItems = [...items].sort((a, b) => a.ring - b.ring);

  for (const item of sortedItems) {
    // Use saved position if available, otherwise calculate new position
    const position = (item.positionX !== null && item.positionX !== undefined &&
                      item.positionY !== null && item.positionY !== undefined)
      ? { x: item.positionX, y: item.positionY }
      : calculateBlipPosition(item, config, positions);

    positions.push(position);
    itemsWithPositions.push({
      ...item,
      position,
    });
  }

  return itemsWithPositions;
}

/**
 * Get default positioning configuration based on SVG dimensions
 */
export function getDefaultPositioningConfig(
  width: number,
  height: number
): PositioningConfig {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 40; // Leave 40px margin

  return {
    centerX,
    centerY,
    maxRadius,
    minBlipDistance: 20, // Minimum 20px between blips
  };
}
