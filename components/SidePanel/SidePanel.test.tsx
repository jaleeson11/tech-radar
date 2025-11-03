import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidePanel } from './SidePanel';

describe('SidePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with title', () => {
      render(<SidePanel />);

      expect(screen.getByText('Tech Items')).toBeInTheDocument();
    });

    it('should render Add Item button when onAddItem is provided', () => {
      const handleAddItem = vi.fn();
      render(<SidePanel onAddItem={handleAddItem} />);

      const addButton = screen.getByRole('button', { name: /add tech item/i });
      expect(addButton).toBeInTheDocument();
      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    it('should not render Add Item button when onAddItem is not provided', () => {
      render(<SidePanel />);

      expect(screen.queryByRole('button', { name: /add tech item/i })).not.toBeInTheDocument();
    });

    it('should render empty state when no children provided', () => {
      render(<SidePanel />);

      expect(screen.getByText('No tech items yet')).toBeInTheDocument();
    });

    it('should render empty state with hint when onAddItem is provided', () => {
      const handleAddItem = vi.fn();
      render(<SidePanel onAddItem={handleAddItem} />);

      expect(screen.getByText('No tech items yet')).toBeInTheDocument();
      expect(screen.getByText('Click "Add Item" to get started')).toBeInTheDocument();
    });

    it('should render children when provided', () => {
      render(
        <SidePanel>
          <div data-testid="custom-content">Custom Content</div>
        </SidePanel>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
      expect(screen.queryByText('No tech items yet')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onAddItem when Add Item button is clicked', () => {
      const handleAddItem = vi.fn();
      render(<SidePanel onAddItem={handleAddItem} />);

      const addButton = screen.getByRole('button', { name: /add tech item/i });
      fireEvent.click(addButton);

      expect(handleAddItem).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when Add Item button is clicked without handler', () => {
      render(<SidePanel />);

      // Should not have button when no handler
      expect(screen.queryByRole('button', { name: /add tech item/i })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for Add Item button', () => {
      const handleAddItem = vi.fn();
      render(<SidePanel onAddItem={handleAddItem} />);

      const addButton = screen.getByRole('button', { name: /add tech item/i });
      expect(addButton).toHaveAttribute('aria-label', 'Add tech item');
      expect(addButton).toHaveAttribute('title', 'Add tech item');
    });

    it('should have proper heading hierarchy', () => {
      render(<SidePanel />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Tech Items');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<SidePanel className="custom-panel" />);

      const panel = container.querySelector('.custom-panel');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Content area', () => {
    it('should render multiple children', () => {
      render(
        <SidePanel>
          <div data-testid="item-1">Item 1</div>
          <div data-testid="item-2">Item 2</div>
          <div data-testid="item-3">Item 3</div>
        </SidePanel>
      );

      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      expect(screen.getByTestId('item-3')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <SidePanel onAddItem={vi.fn()}>
          <ul>
            <li>Tech Item 1</li>
            <li>Tech Item 2</li>
          </ul>
        </SidePanel>
      );

      expect(screen.getByText('Tech Item 1')).toBeInTheDocument();
      expect(screen.getByText('Tech Item 2')).toBeInTheDocument();
    });
  });
});
