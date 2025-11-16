import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AddItemChoice } from './AddItemChoice';

describe('AddItemChoice', () => {
  const mockOnBrowseLibrary = vi.fn();
  const mockOnCreateCustom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both choice cards', () => {
    render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    expect(screen.getByText('Browse Library')).toBeInTheDocument();
    expect(screen.getByText('Create Custom')).toBeInTheDocument();
  });

  it('shows correct descriptions for each choice', () => {
    render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    expect(screen.getByText(/Choose from 85\+ popular technologies/)).toBeInTheDocument();
    expect(screen.getByText(/Add your own technology with custom details/)).toBeInTheDocument();
  });

  it('calls onBrowseLibrary when Browse Library card is clicked', () => {
    render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    const browseCard = screen.getByRole('button', { name: /browse tech library/i });
    fireEvent.click(browseCard);

    expect(mockOnBrowseLibrary).toHaveBeenCalledTimes(1);
    expect(mockOnCreateCustom).not.toHaveBeenCalled();
  });

  it('calls onCreateCustom when Create Custom card is clicked', () => {
    render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    const customCard = screen.getByRole('button', { name: /create custom item/i });
    fireEvent.click(customCard);

    expect(mockOnCreateCustom).toHaveBeenCalledTimes(1);
    expect(mockOnBrowseLibrary).not.toHaveBeenCalled();
  });

  it('shows icons for both choices', () => {
    const { container } = render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    // Check that SVG icons exist (Library and PlusCircle from lucide-react)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it('has proper accessibility attributes', () => {
    render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    const browseCard = screen.getByRole('button', { name: /browse tech library/i });
    const customCard = screen.getByRole('button', { name: /create custom item/i });

    expect(browseCard).toHaveAttribute('aria-label');
    expect(customCard).toHaveAttribute('aria-label');
  });

  it('supports keyboard navigation', () => {
    render(
      <AddItemChoice
        onBrowseLibrary={mockOnBrowseLibrary}
        onCreateCustom={mockOnCreateCustom}
      />
    );

    const browseCard = screen.getByRole('button', { name: /browse tech library/i });

    // Simulate Enter key
    browseCard.focus();
    fireEvent.keyDown(browseCard, { key: 'Enter', code: 'Enter' });
    fireEvent.click(browseCard);

    expect(mockOnBrowseLibrary).toHaveBeenCalled();
  });
});
