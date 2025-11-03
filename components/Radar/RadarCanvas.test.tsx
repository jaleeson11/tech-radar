import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RadarCanvas } from './RadarCanvas';
import { TechItemWithPosition, RadarVisualizationConfig } from '@/lib/types/radar.types';

describe('RadarCanvas', () => {
  const mockConfig: RadarVisualizationConfig = {
    width: 800,
    height: 800,
    centerX: 400,
    centerY: 400,
    maxRadius: 350,
    quadrants: [
      { index: 0, name: 'Tools', startAngle: 0, endAngle: 90 },
      { index: 1, name: 'Techniques', startAngle: 90, endAngle: 180 },
      { index: 2, name: 'Platforms', startAngle: 180, endAngle: 270 },
      { index: 3, name: 'Languages', startAngle: 270, endAngle: 360 },
    ],
    rings: [
      { index: 0, name: 'Adopt', innerRadius: 0, outerRadius: 25 },
      { index: 1, name: 'Trial', innerRadius: 25, outerRadius: 50 },
      { index: 2, name: 'Assess', innerRadius: 50, outerRadius: 75 },
      { index: 3, name: 'Hold', innerRadius: 75, outerRadius: 100 },
    ],
  };

  const mockItems: TechItemWithPosition[] = [
    {
      id: 'item-1',
      radarId: 'radar-1',
      name: 'React',
      quadrant: 0,
      ring: 0,
      description: 'UI library',
      url: 'https://react.dev',
      category: 'Frontend',
      createdAt: new Date(),
      updatedAt: new Date(),
      position: { x: 450, y: 450 },
    },
    {
      id: 'item-2',
      radarId: 'radar-1',
      name: 'TypeScript',
      quadrant: 3,
      ring: 0,
      description: 'Typed JavaScript',
      url: 'https://typescriptlang.org',
      category: 'Languages',
      createdAt: new Date(),
      updatedAt: new Date(),
      position: { x: 350, y: 380 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render SVG canvas with correct viewBox', () => {
      render(<RadarCanvas items={[]} config={mockConfig} />);

      const svg = screen.getByRole('img', { name: /technology radar visualization/i });
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 800 800');
    });

    it('should render all quadrant labels', () => {
      render(<RadarCanvas items={[]} config={mockConfig} />);

      expect(screen.getByText('Tools')).toBeInTheDocument();
      expect(screen.getByText('Techniques')).toBeInTheDocument();
      expect(screen.getByText('Platforms')).toBeInTheDocument();
      expect(screen.getByText('Languages')).toBeInTheDocument();
    });

    it('should render ring labels (excluding innermost)', () => {
      render(<RadarCanvas items={[]} config={mockConfig} />);

      // First ring (Adopt) should be skipped
      expect(screen.queryByText('Adopt')).not.toBeInTheDocument();

      // Other rings should be visible
      expect(screen.getByText('Trial')).toBeInTheDocument();
      expect(screen.getByText('Assess')).toBeInTheDocument();
      expect(screen.getByText('Hold')).toBeInTheDocument();
    });

    it('should render blips for all tech items', () => {
      render(<RadarCanvas items={mockItems} config={mockConfig} />);

      const reactBlip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      const tsBlip = screen.getByRole('button', { name: /typescript.*languages.*adopt/i });

      expect(reactBlip).toBeInTheDocument();
      expect(tsBlip).toBeInTheDocument();
    });

    it('should render empty radar when no items provided', () => {
      render(<RadarCanvas items={[]} config={mockConfig} />);

      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();

      // Should still have quadrant and ring labels
      expect(screen.getByText('Tools')).toBeInTheDocument();
      expect(screen.getByText('Trial')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onBlipClick when blip is clicked', () => {
      const handleClick = vi.fn();
      render(<RadarCanvas items={mockItems} config={mockConfig} onBlipClick={handleClick} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      fireEvent.click(blip);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should show tooltip on mouseenter', async () => {
      render(<RadarCanvas items={mockItems} config={mockConfig} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      fireEvent.mouseEnter(blip);

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText(/Tools.*Adopt/)).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouseleave', async () => {
      render(<RadarCanvas items={mockItems} config={mockConfig} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });

      // Show tooltip
      fireEvent.mouseEnter(blip);
      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      // Hide tooltip
      fireEvent.mouseLeave(blip);
      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should call onBlipClick when Enter key is pressed', () => {
      const handleClick = vi.fn();
      render(<RadarCanvas items={mockItems} config={mockConfig} onBlipClick={handleClick} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      fireEvent.keyDown(blip, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should call onBlipClick when Space key is pressed', () => {
      const handleClick = vi.fn();
      render(<RadarCanvas items={mockItems} config={mockConfig} onBlipClick={handleClick} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      fireEvent.keyDown(blip, { key: ' ' });

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should not call onBlipClick for other keys', () => {
      const handleClick = vi.fn();
      render(<RadarCanvas items={mockItems} config={mockConfig} onBlipClick={handleClick} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      fireEvent.keyDown(blip, { key: 'Escape' });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have proper ARIA labels for blips', () => {
      render(<RadarCanvas items={mockItems} config={mockConfig} />);

      const reactBlip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      const tsBlip = screen.getByRole('button', { name: /typescript.*languages.*adopt/i });

      expect(reactBlip).toHaveAttribute('aria-label');
      expect(tsBlip).toHaveAttribute('aria-label');
    });

    it('should have tabindex for keyboard navigation', () => {
      render(<RadarCanvas items={mockItems} config={mockConfig} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });
      expect(blip).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply custom className when provided', () => {
      const { container } = render(
        <RadarCanvas items={mockItems} config={mockConfig} className="custom-radar" />
      );

      const radarContainer = container.querySelector('.custom-radar');
      expect(radarContainer).toBeInTheDocument();
    });

    it('should handle different config dimensions', () => {
      const smallConfig = { ...mockConfig, width: 400, height: 400 };
      render(<RadarCanvas items={mockItems} config={smallConfig} />);

      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('viewBox', '0 0 400 400');
    });
  });

  describe('Edge Cases', () => {
    it('should handle items without optional fields', () => {
      const itemsWithoutOptional: TechItemWithPosition[] = [
        {
          id: 'item-minimal',
          radarId: 'radar-1',
          name: 'Minimal Item',
          quadrant: 0,
          ring: 0,
          description: null,
          url: null,
          category: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          position: { x: 450, y: 450 },
        },
      ];

      render(<RadarCanvas items={itemsWithoutOptional} config={mockConfig} />);

      const blip = screen.getByRole('button', { name: /minimal item/i });
      expect(blip).toBeInTheDocument();
    });

    it('should handle custom quadrant names', () => {
      const customConfig = {
        ...mockConfig,
        quadrants: [
          { index: 0, name: 'Custom Q1', startAngle: 0, endAngle: 90 },
          { index: 1, name: 'Custom Q2', startAngle: 90, endAngle: 180 },
          { index: 2, name: 'Custom Q3', startAngle: 180, endAngle: 270 },
          { index: 3, name: 'Custom Q4', startAngle: 270, endAngle: 360 },
        ],
      };

      render(<RadarCanvas items={[]} config={customConfig} />);

      expect(screen.getByText('Custom Q1')).toBeInTheDocument();
      expect(screen.getByText('Custom Q2')).toBeInTheDocument();
      expect(screen.getByText('Custom Q3')).toBeInTheDocument();
      expect(screen.getByText('Custom Q4')).toBeInTheDocument();
    });

    it('should handle missing onBlipClick handler gracefully', () => {
      render(<RadarCanvas items={mockItems} config={mockConfig} />);

      const blip = screen.getByRole('button', { name: /react.*tools.*adopt/i });

      // Should not throw error when clicking without handler
      expect(() => {
        fireEvent.click(blip);
      }).not.toThrow();
    });
  });
});
