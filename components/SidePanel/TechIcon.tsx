'use client';

import React from 'react';
import * as simpleIcons from 'simple-icons';

interface TechIconProps {
  icon: string; // simple-icons slug
  name: string;
  size?: number;
  className?: string;
}

export function TechIcon({ icon, name, size = 24, className = '' }: TechIconProps) {
  // Convert slug to simple-icons format (e.g., 'react' -> 'siReact')
  const iconKey = `si${icon.charAt(0).toUpperCase()}${icon.slice(1).replace(/-/g, '')}`;

  // Get icon data from simple-icons
  const iconData = (simpleIcons as any)[iconKey];

  if (!iconData) {
    // Fallback if icon not found - show first letter
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#94a3b8',
          borderRadius: '4px',
          color: 'white',
          fontSize: size * 0.6,
          fontWeight: 600
        }}
        aria-label={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-label={name}
      fill={`#${iconData.hex}`}
    >
      <title>{iconData.title}</title>
      <path d={iconData.path} />
    </svg>
  );
}

export default TechIcon;
