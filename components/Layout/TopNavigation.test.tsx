import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopNavigation } from './TopNavigation';
import { useSession, signOut } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

const mockUseSession = useSession as ReturnType<typeof vi.fn>;
const mockSignOut = signOut as ReturnType<typeof vi.fn>;

describe('TopNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  describe('Rendering', () => {
    it('should render with default radar name', () => {
      render(<TopNavigation />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Tech Radar')).toBeInTheDocument();
    });

    it('should render with custom radar name', () => {
      render(<TopNavigation radarName="My Custom Radar" />);

      expect(screen.getByText('My Custom Radar')).toBeInTheDocument();
    });

    it('should render Share button when onShare is provided', () => {
      const handleShare = vi.fn();
      render(<TopNavigation onShare={handleShare} />);

      const shareButton = screen.getByRole('button', { name: /share radar/i });
      expect(shareButton).toBeInTheDocument();
    });

    it('should render Export button when onExport is provided', () => {
      const handleExport = vi.fn();
      render(<TopNavigation onExport={handleExport} />);

      const exportButton = screen.getByRole('button', { name: /export radar/i });
      expect(exportButton).toBeInTheDocument();
    });

    it('should render Settings button when onCustomize is provided', () => {
      const handleCustomize = vi.fn();
      render(<TopNavigation onCustomize={handleCustomize} />);

      const settingsButton = screen.getByRole('button', { name: /customize radar/i });
      expect(settingsButton).toBeInTheDocument();
    });

    it('should not render buttons when handlers are not provided', () => {
      render(<TopNavigation />);

      expect(screen.queryByRole('button', { name: /share radar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /export radar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /customize radar/i })).not.toBeInTheDocument();
    });
  });

  describe('User Authentication', () => {
    it('should show user info when session exists', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        status: 'authenticated',
      });

      render(<TopNavigation />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    it('should show email when name is not available', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            email: 'john@example.com',
          },
        },
        status: 'authenticated',
      });

      render(<TopNavigation />);

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should not show user section when session does not exist', () => {
      mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(<TopNavigation />);

      expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
    });

    it('should not show auth controls when showAuthControls is false', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        status: 'authenticated',
      });

      render(<TopNavigation showAuthControls={false} />);

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
    });

    it('should call signOut when Sign Out button is clicked', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        status: 'authenticated',
      });

      render(<TopNavigation />);

      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });

  describe('Interactions', () => {
    it('should call onShare when Share button is clicked', () => {
      const handleShare = vi.fn();
      render(<TopNavigation onShare={handleShare} />);

      const shareButton = screen.getByRole('button', { name: /share radar/i });
      fireEvent.click(shareButton);

      expect(handleShare).toHaveBeenCalledTimes(1);
    });

    it('should call onExport when Export button is clicked', () => {
      const handleExport = vi.fn();
      render(<TopNavigation onExport={handleExport} />);

      const exportButton = screen.getByRole('button', { name: /export radar/i });
      fireEvent.click(exportButton);

      expect(handleExport).toHaveBeenCalledTimes(1);
    });

    it('should call onCustomize when Settings button is clicked', () => {
      const handleCustomize = vi.fn();
      render(<TopNavigation onCustomize={handleCustomize} />);

      const settingsButton = screen.getByRole('button', { name: /customize radar/i });
      fireEvent.click(settingsButton);

      expect(handleCustomize).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const handleShare = vi.fn();
      const handleExport = vi.fn();
      const handleCustomize = vi.fn();

      render(
        <TopNavigation
          onShare={handleShare}
          onExport={handleExport}
          onCustomize={handleCustomize}
        />
      );

      expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share radar/i })).toHaveAttribute('aria-label', 'Share radar');
      expect(screen.getByRole('button', { name: /export radar/i })).toHaveAttribute('aria-label', 'Export radar');
      expect(screen.getByRole('button', { name: /customize radar/i })).toHaveAttribute('aria-label', 'Customize radar');
    });

    it('should have proper heading hierarchy', () => {
      render(<TopNavigation radarName="My Radar" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('My Radar');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<TopNavigation className="custom-nav" />);

      const nav = container.querySelector('.custom-nav');
      expect(nav).toBeInTheDocument();
    });
  });
});
