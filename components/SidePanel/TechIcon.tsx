'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface TechIconProps {
  icon: string; // Iconify icon reference (e.g., 'simple-icons:react', 'devicon:nuxtjs')
  name: string;
  size?: number;
  className?: string;
}

export function TechIcon({ icon, name, size = 24, className = '' }: TechIconProps) {
  // If icon doesn't have a prefix, assume it's from devicon (colored icons)
  const iconRef = icon.includes(':') ? icon : `devicon:${icon}`;

  return (
    <Icon
      icon={iconRef}
      width={size}
      height={size}
      className={className}
      aria-label={name}
    />
  );
}

export default TechIcon;
