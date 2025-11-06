import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechItemList } from './TechItemList';
import { TechItem } from '@/lib/types/radar.types';

describe('TechItemList', () => {
  const mockQuadrants = ['Tools', 'Techniques', 'Platforms', 'Languages'];
  const mockRings = ['Adopt', 'Trial', 'Assess', 'Hold'];

  const mockItems: TechItem[] = [
    {
      id: '1',
      radarId: 'radar-1',
      name: 'React',
      quadrant: 0,
      ring: 0,
      positionX: null,
      positionY: null,
      description: 'UI library',
      url: 'https://react.dev',
      category: 'Frontend',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      radarId: 'radar-1',
      name: 'TypeScript',
      quadrant: 3,
      ring: 0,
      positionX: null,
      positionY: null,
      description: 'Type-safe JavaScript',
      url: 'https://typescriptlang.org',
      category: 'Frontend',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      radarId: 'radar-1',
      name: 'PostgreSQL',
      quadrant: 2,
      ring: 1,
      positionX: null,
      positionY: null,
      description: 'Relational database',
      url: null,
      category: 'Backend',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      radarId: 'radar-1',
      name: 'Docker',
      quadrant: 2,
      ring: 0,
      positionX: null,
      positionY: null,
      description: null,
      url: null,
      category: null, // Uncategorized
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockOnItemClick = vi.fn();
  const mockOnEditClick = vi.fn();
  const mockOnDeleteClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state when no items provided', () => {
      render(
        <TechItemList
          items={[]}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      expect(screen.getByText('No tech items yet')).toBeInTheDocument();
      expect(screen.getByText('Click "Add Item" to get started')).toBeInTheDocument();
    });
  });

  describe('Category Grouping', () => {
    it('groups items by category', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('Uncategorized')).toBeInTheDocument();
    });

    it('displays item count for each category', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Get all category buttons (both expanded and collapsed)
      const frontendHeader = screen.getByRole('button', { name: /frontend/i });
      expect(frontendHeader.textContent).toMatch(/Frontend.*2/);

      const backendHeader = screen.getByRole('button', { name: /backend/i });
      expect(backendHeader.textContent).toMatch(/Backend.*1/);

      const uncategorizedHeader = screen.getByRole('button', { name: /uncategorized/i });
      expect(uncategorizedHeader.textContent).toMatch(/Uncategorized.*1/);
    });

    it('shows Uncategorized category first', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      const categoryHeaders = screen.getAllByRole('button', { expanded: true });
      expect(categoryHeaders[0].textContent).toContain('Uncategorized');
    });
  });

  describe('Category Expansion/Collapse', () => {
    it('starts with Uncategorized expanded by default', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Uncategorized should show its item (Docker)
      expect(screen.getByText('Docker')).toBeInTheDocument();
    });

    it('toggles category visibility when clicking header', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Frontend starts collapsed, so items shouldn't be visible
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();

      // Click to expand Frontend
      const frontendHeader = screen.getByRole('button', { name: /expand frontend/i });
      fireEvent.click(frontendHeader);

      // Now Frontend items should be visible
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();

      // Click to collapse Frontend
      const frontendHeaderCollapse = screen.getByRole('button', { name: /collapse frontend/i });
      fireEvent.click(frontendHeaderCollapse);

      // Frontend items should be hidden again
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });
  });

  describe('Item Display', () => {
    it('displays item name, quadrant, and ring', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Expand Frontend to see React
      fireEvent.click(screen.getByRole('button', { name: /expand frontend/i }));

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Tools')).toBeInTheDocument(); // quadrant 0
      expect(screen.getAllByText('Adopt').length).toBeGreaterThan(0); // ring 0
    });

    it('sorts items alphabetically within each category', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Expand Frontend
      fireEvent.click(screen.getByRole('button', { name: /expand frontend/i }));

      const itemNames = screen.getAllByRole('heading', { level: 3 });
      const frontendItems = itemNames.filter(h =>
        h.textContent === 'React' || h.textContent === 'TypeScript'
      );

      // React should come before TypeScript alphabetically
      expect(frontendItems[0].textContent).toBe('React');
      expect(frontendItems[1].textContent).toBe('TypeScript');
    });
  });

  describe('Item Interactions', () => {
    it('calls onItemClick when clicking an item', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Expand Uncategorized and click Docker
      const dockerCard = screen.getByRole('button', { name: /view details for docker/i });
      fireEvent.click(dockerCard);

      expect(mockOnItemClick).toHaveBeenCalledTimes(1);
      expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[3]); // Docker
    });

    it('calls onEditClick when clicking edit button', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Click edit button for Docker
      const editButton = screen.getByRole('button', { name: /edit docker/i });
      fireEvent.click(editButton);

      expect(mockOnEditClick).toHaveBeenCalledTimes(1);
      expect(mockOnEditClick).toHaveBeenCalledWith(mockItems[3]); // Docker
      expect(mockOnItemClick).not.toHaveBeenCalled(); // Should not trigger item click
    });

    it('calls onDeleteClick when clicking delete button', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Click delete button for Docker
      const deleteButton = screen.getByRole('button', { name: /delete docker/i });
      fireEvent.click(deleteButton);

      expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
      expect(mockOnDeleteClick).toHaveBeenCalledWith(mockItems[3]); // Docker
      expect(mockOnItemClick).not.toHaveBeenCalled(); // Should not trigger item click
    });

    it('supports keyboard navigation with Enter key', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      const dockerCard = screen.getByRole('button', { name: /view details for docker/i });
      fireEvent.keyDown(dockerCard, { key: 'Enter' });

      expect(mockOnItemClick).toHaveBeenCalledTimes(1);
      expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[3]);
    });

    it('supports keyboard navigation with Space key', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      const dockerCard = screen.getByRole('button', { name: /view details for docker/i });
      fireEvent.keyDown(dockerCard, { key: ' ' });

      expect(mockOnItemClick).toHaveBeenCalledTimes(1);
      expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[3]);
    });
  });

  describe('Edit Permissions', () => {
    it('hides action buttons when canEdit is false', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
          canEdit={false}
        />
      );

      // Edit and delete buttons should not be present
      expect(screen.queryByRole('button', { name: /edit docker/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete docker/i })).not.toBeInTheDocument();
    });

    it('shows action buttons by default', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      // Edit and delete buttons should be present
      expect(screen.getByRole('button', { name: /edit docker/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete docker/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for category headers', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      expect(screen.getByRole('button', { name: /collapse uncategorized/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /expand frontend/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /expand backend/i })).toBeInTheDocument();
    });

    it('has proper ARIA attributes for expandable sections', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      const uncategorizedHeader = screen.getByRole('button', { name: /collapse uncategorized/i });
      expect(uncategorizedHeader).toHaveAttribute('aria-expanded', 'true');

      const frontendHeader = screen.getByRole('button', { name: /expand frontend/i });
      expect(frontendHeader).toHaveAttribute('aria-expanded', 'false');
    });

    it('has proper labels for action buttons', () => {
      render(
        <TechItemList
          items={mockItems}
          quadrants={mockQuadrants}
          rings={mockRings}
          onItemClick={mockOnItemClick}
          onEditClick={mockOnEditClick}
          onDeleteClick={mockOnDeleteClick}
        />
      );

      expect(screen.getByLabelText('Edit Docker')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete Docker')).toBeInTheDocument();
    });
  });
});
