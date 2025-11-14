'use client';

import React from 'react';
import styles from './RadarLoader.module.css';

interface RadarLoaderProps {
  size?: number;
  className?: string;
}

export function RadarLoader({ size = 80, className = '' }: RadarLoaderProps) {
  return (
    <div
      className={`${styles.radarLoader} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {/* Radar rings */}
      <div className={styles.ring} style={{ width: '100%', height: '100%' }} />
      <div className={styles.ring} style={{ width: '75%', height: '75%' }} />
      <div className={styles.ring} style={{ width: '50%', height: '50%' }} />
      <div className={styles.ring} style={{ width: '25%', height: '25%' }} />

      {/* Center dot */}
      <div className={styles.centerDot} />

      {/* Sweeping line with gradient */}
      <div className={styles.sweepContainer}>
        <div className={styles.sweep} />
      </div>
    </div>
  );
}

export default RadarLoader;
