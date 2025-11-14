import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RadarSwitcherModal } from './RadarSwitcherModal';
import { radarsApi } from '@/lib/api';

// Mock dependencies
vi.mock('@/lib/api', () => ({
  radarsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockRadars = [
  {
    id: '1',
    name: 'Tech Radar 2024',
    shareToken: 'token1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    _count: { items: 12 },
  },
  {
    id: '2',
    name: 'Marketing Stack',
    shareToken: 'token2',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    _count: { items: 8 },
  },
];

describe('RadarSwitcherModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <RadarSwitcherModal
          isOpen={false}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue([]);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('My Radars')).toBeInTheDocument();
    });

    it('should show loading state while fetching radars', async () => {
      vi.mocked(radarsApi.getAll).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Loading your radars...')).toBeInTheDocument();
      });
    });

    it('should render list of radars', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue(mockRadars);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Tech Radar 2024')).toBeInTheDocument();
        expect(screen.getByText('Marketing Stack')).toBeInTheDocument();
        expect(screen.getByText('12 items')).toBeInTheDocument();
        expect(screen.getByText('8 items')).toBeInTheDocument();
      });
    });

    it('should highlight current radar', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue(mockRadars);

      const { container } = render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
          currentRadarId="1"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Tech Radar 2024')).toBeInTheDocument();
        const activeItem = container.querySelector('[class*="active"]');
        expect(activeItem).toBeInTheDocument();
      });
    });

    it('should show empty state when no radars', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue([]);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No radars yet. Create your first one!')).toBeInTheDocument();
      });
    });

    it('should show limit message when 10 radars exist', async () => {
      const tenRadars = Array.from({ length: 10 }, (_, i) => ({
        ...mockRadars[0],
        id: `${i}`,
        name: `Radar ${i}`,
      }));

      vi.mocked(radarsApi.getAll).mockResolvedValue(tenRadars);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("You've reached the maximum of 10 radars")).toBeInTheDocument();
      });
    });
  });

  describe('Create Radar', () => {
    it('should create new radar on button click', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue([]);
      vi.mocked(radarsApi.create).mockResolvedValue({
        id: '3',
        name: 'New Technology Radar',
        shareToken: 'new-token',
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z',
      } as any);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Create New Radar')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /create new radar/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(radarsApi.create).toHaveBeenCalledWith({
          name: 'New Technology Radar',
        });
      });
    });

    it('should disable create button when 10 radars exist', async () => {
      const tenRadars = Array.from({ length: 10 }, (_, i) => ({
        ...mockRadars[0],
        id: `${i}`,
        name: `Radar ${i}`,
      }));

      vi.mocked(radarsApi.getAll).mockResolvedValue(tenRadars);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create new radar/i });
        expect(createButton).toBeDisabled();
      });
    });

    it('should show error message when create fails', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue([]);
      vi.mocked(radarsApi.create).mockRejectedValue({
        response: { data: { error: 'Failed to create' } },
      });

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create new radar/i })).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /create new radar/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to create')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Delete Radar', () => {
    it('should show delete confirmation modal on trash click', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue(mockRadars);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Tech Radar 2024')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete Radar')).toBeInTheDocument();
        expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should delete radar on confirmation', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue(mockRadars);
      vi.mocked(radarsApi.delete).mockResolvedValue(undefined);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Tech Radar 2024')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for delete confirmation modal to appear
      await waitFor(() => {
        expect(screen.getByText('Delete Radar')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find and click the Delete button in the confirmation modal
      const confirmButton = screen.getByRole('button', { name: /^delete$/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(radarsApi.delete).toHaveBeenCalledWith('1');
      });
    });

    it('should cancel delete on cancel button', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue(mockRadars);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Tech Radar 2024')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);
      });

      expect(radarsApi.delete).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue([]);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('should support keyboard navigation for radar items', async () => {
      vi.mocked(radarsApi.getAll).mockResolvedValue(mockRadars);

      render(
        <RadarSwitcherModal
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        const radarItem = screen.getByText('Tech Radar 2024').closest('[role="button"]');
        expect(radarItem).toHaveAttribute('tabIndex', '0');
      });
    });
  });
});
