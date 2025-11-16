import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TechIcon } from './TechIcon';

// Mock the Iconify Icon component since it loads icons asynchronously
vi.mock('@iconify/react', () => ({
  Icon: ({ icon, width, height, className, 'aria-label': ariaLabel }: any) => (
    <svg
      data-icon={icon}
      width={width}
      height={height}
      className={className}
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
    </svg>
  ),
}));

describe('TechIcon', () => {
  it('renders an icon with correct attributes', () => {
    const { container } = render(<TechIcon icon="react" name="React" size={24} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('aria-label', 'React');
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

  it('handles icons with dashes in the name', () => {
    const { container } = render(<TechIcon icon="vue-dot-js" name="Vue.js" size={24} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('adds devicon prefix when no prefix is provided', () => {
    const { container } = render(<TechIcon icon="react" name="React" size={24} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('data-icon', 'devicon:react');
  });

  it('uses explicit prefix when provided', () => {
    const { container } = render(<TechIcon icon="simple-icons:react" name="React" size={24} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('data-icon', 'simple-icons:react');
  });
});
