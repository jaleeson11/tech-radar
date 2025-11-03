import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    // Store original window.innerWidth
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const mockTopNav = <div data-testid="top-nav">Top Navigation</div>;
  const mockSidePanel = <div data-testid="side-panel">Side Panel Content</div>;
  const mockChildren = <div data-testid="main-content">Main Content</div>;

  describe('Desktop Layout', () => {
    beforeEach(() => {
      // Set desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should render all layout sections', () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      expect(screen.getByTestId('top-nav')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('side-panel')).toBeInTheDocument();
    });

    it('should render side panel in desktop mode', () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const sidePanel = screen.getByRole('complementary', { name: /tech items panel/i });
      expect(sidePanel).toBeInTheDocument();
      expect(sidePanel).toBeVisible();
    });

    it('should not render mobile toggle button in desktop mode', () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.queryByRole('button', { name: /open items panel/i });
      expect(toggleButton).not.toBeInTheDocument();
    });

    it('should render without topNav when not provided', () => {
      render(
        <AppLayout sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      expect(screen.queryByTestId('top-nav')).not.toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('should render without sidePanel when not provided', () => {
      render(
        <AppLayout topNav={mockTopNav}>
          {mockChildren}
        </AppLayout>
      );

      expect(screen.getByTestId('top-nav')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.queryByTestId('side-panel')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      // Set mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should render mobile toggle button', () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should initially hide drawer in mobile mode', () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const drawer = container.querySelector('aside[aria-hidden="true"]');
      expect(drawer).toBeInTheDocument();
      expect(drawer).toHaveAttribute('aria-label', 'Tech items panel');
    });

    it('should open drawer when toggle button is clicked', async () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const drawer = container.querySelector('aside[aria-hidden="false"]');
        expect(drawer).toBeInTheDocument();
      });
    });

    it('should close drawer when toggle button is clicked again', async () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });

      // Open drawer
      fireEvent.click(toggleButton);
      await waitFor(() => {
        const drawer = container.querySelector('aside[aria-hidden="false"]');
        expect(drawer).toBeInTheDocument();
      });

      // Close drawer
      const closeButton = screen.getByRole('button', { name: /close items panel/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        const drawer = container.querySelector('aside[aria-hidden="true"]');
        expect(drawer).toBeInTheDocument();
      });
    });

    it('should show overlay when drawer is open', async () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const overlay = container.querySelector('[aria-hidden="true"]');
        expect(overlay).toBeInTheDocument();
      });
    });

    it('should close drawer when overlay is clicked', async () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });

      // Open drawer
      fireEvent.click(toggleButton);
      await waitFor(() => {
        const drawer = container.querySelector('aside[aria-hidden="false"]');
        expect(drawer).toBeInTheDocument();
      });

      // Click overlay
      const overlays = container.querySelectorAll('[aria-hidden="true"]');
      const overlay = Array.from(overlays).find((el) => el.classList.contains('_overlay_96b5d7'));
      if (overlay) {
        fireEvent.click(overlay);
      }

      await waitFor(() => {
        const drawer = container.querySelector('aside[aria-hidden="true"]');
        expect(drawer).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should detect mobile on resize', async () => {
      // Start with desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { rerender } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      // Should not have mobile toggle
      expect(screen.queryByRole('button', { name: /open items panel/i })).not.toBeInTheDocument();

      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // Wait for state update
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /open items panel/i })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should have proper ARIA labels', () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      const sidePanel = container.querySelector('aside[aria-label="Tech items panel"]');
      expect(sidePanel).toBeInTheDocument();
      expect(sidePanel).toHaveAttribute('aria-label', 'Tech items panel');
    });

    it('should update aria-expanded when drawer is opened', async () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      const toggleButton = screen.getByRole('button', { name: /open items panel/i });

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(toggleButton);

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close items panel/i });
        expect(closeButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have banner role for top navigation', () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have main role for radar area', () => {
      render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel}>
          {mockChildren}
        </AppLayout>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <AppLayout topNav={mockTopNav} sidePanel={mockSidePanel} className="custom-layout">
          {mockChildren}
        </AppLayout>
      );

      const layout = container.querySelector('.custom-layout');
      expect(layout).toBeInTheDocument();
    });
  });
});
