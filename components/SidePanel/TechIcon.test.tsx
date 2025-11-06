import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TechIcon } from './TechIcon';

describe('TechIcon', () => {
  it('renders an SVG icon when the icon exists in simple-icons', () => {
    const { container } = render(<TechIcon icon="react" name="React" size={24} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('aria-label', 'React');
  });

  it('renders a fallback div when the icon does not exist', () => {
    const { container } = render(<TechIcon icon="nonexistent-icon" name="Unknown" size={32} />);

    const fallback = container.querySelector('div');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent('U'); // First letter of "Unknown"
    expect(fallback).toHaveAttribute('aria-label', 'Unknown');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TechIcon icon="react" name="React" size={24} className="custom-class" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('uses correct size prop', () => {
    const { container } = render(<TechIcon icon="react" name="React" size={48} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('shows first letter in uppercase for fallback', () => {
    const { container } = render(<TechIcon icon="invalid" name="test item" size={24} />);

    const fallback = container.querySelector('div');
    expect(fallback).toHaveTextContent('T'); // Capital T from "test item"
  });

  it('handles icons with dashes in the name', () => {
    const { container } = render(<TechIcon icon="vue-dot-js" name="Vue.js" size={24} />);

    // Should attempt to find the icon (may render SVG or fallback depending on icon existence)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('includes title element in SVG', () => {
    const { container } = render(<TechIcon icon="react" name="React" size={24} />);

    const title = container.querySelector('title');
    expect(title).toBeInTheDocument();
  });
});
