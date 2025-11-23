import React from 'react';
import { Radio } from 'lucide-react';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className || ''}`}>
      <Radio className={styles.icon} />
      <div className={styles.text}>
        <span className={styles.tech}>Tech</span>
        <span className={styles.radars}>Radars</span>
      </div>
    </div>
  );
}

export default Logo;
