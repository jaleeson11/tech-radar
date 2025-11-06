import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TechLibrary } from './TechLibrary';
import { TECH_LIBRARY } from '@/lib/data/tech-library';

// Mock TechIcon component
vi.mock('./TechIcon', () => ({
  TechIcon: ({ name }: { name: string }) => <div data-testid="tech-icon">{name}</div>,
}));

describe('TechLibrary', () => {
  const mockOnSelectItem = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with header', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    expect(screen.getByText('Tech Library')).toBeInTheDocument();
    expect(screen.getByText(`${TECH_LIBRARY.length} technologies`)).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders category filters', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    // Should include "All" and other categories
    expect(screen.getByRole('button', { name: /filter by all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by frontend/i })).toBeInTheDocument();
  });

  it('displays all tech items by default', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    // Check that some known items are rendered (use getAllByText since text appears in icon and title)
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vue.js').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Angular').length).toBeGreaterThan(0);
  });

  it('filters items by search query', async () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    fireEvent.change(searchInput, { target: { value: 'react' } });

    await waitFor(() => {
      expect(screen.getAllByText('React').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('Vue.js').length).toBe(0);
    });
  });

  it('filters items by category', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const frontendButton = screen.getByRole('button', { name: /filter by frontend/i });
    fireEvent.click(frontendButton);

    // Should show frontend items
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vue.js').length).toBeGreaterThan(0);
  });

  it('shows clear button when search has text', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const searchInput = screen.getByPlaceholderText(/search technologies/i);

    // Clear button should not be visible initially
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'react' } });

    // Clear button should now be visible
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const searchInput = screen.getByPlaceholderText(/search technologies/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'react' } });

    expect(searchInput.value).toBe('react');

    const clearButton = screen.getByLabelText(/clear search/i);
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe('');
  });

  it('calls onSelectItem when a tech item is clicked', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const reactCard = screen.getByRole('button', { name: 'Select React' });
    fireEvent.click(reactCard);

    expect(mockOnSelectItem).toHaveBeenCalledTimes(1);
    expect(mockOnSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'React',
      })
    );
  });

  it('calls onBack when back button is clicked', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no items match search', async () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent-tech-xyz123' } });

    await waitFor(() => {
      expect(screen.getByText('No technologies found')).toBeInTheDocument();
      expect(screen.getByText(/try adjusting your search or filters/i)).toBeInTheDocument();
    });
  });

  it('highlights active category filter', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const allButton = screen.getByRole('button', { name: /filter by all/i });
    const frontendButton = screen.getByRole('button', { name: /filter by frontend/i });

    // "All" should be active by default
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(frontendButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(frontendButton);

    // "Frontend" should now be active
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(frontendButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays tech item categories', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    // Look for items that have category badges
    const cards = screen.getAllByRole('button', { name: /select/i });
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders tech icons for each item', () => {
    const { getAllByTestId } = render(
      <TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />
    );

    const icons = getAllByTestId('tech-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('filters by both search and category simultaneously', async () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    // First filter by category
    const frontendButton = screen.getByRole('button', { name: /filter by frontend/i });
    fireEvent.click(frontendButton);

    // Then search
    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    fireEvent.change(searchInput, { target: { value: 'react' } });

    await waitFor(() => {
      // Should show React (matches both frontend category and search)
      expect(screen.getAllByText('React').length).toBeGreaterThan(0);
      // Should not show Vue (doesn't match search)
      expect(screen.queryAllByText('Vue.js').length).toBe(0);
    });
  });

  it('has proper accessibility attributes', () => {
    render(<TechLibrary onSelectItem={mockOnSelectItem} onBack={mockOnBack} />);

    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    expect(searchInput).toHaveAttribute('aria-label', 'Search technologies');

    const backButton = screen.getByRole('button', { name: /go back/i });
    expect(backButton).toHaveAttribute('aria-label');
  });
});
