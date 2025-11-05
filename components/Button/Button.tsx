'use client';

import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[`button-${variant}`],
    styles[`button-${size}`],
    fullWidth && styles.fullWidth,
    isLoading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className={styles.content}>
        {isLoading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          leftIcon && <span className={styles.icon}>{leftIcon}</span>
        )}
        <span className={styles.text}>{children}</span>
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </span>
    </button>
  );
}

export default Button;
