'use client';

import React, { forwardRef } from 'react';
import styles from './Field.module.css';

export interface FieldProps {
  as?: 'input' | 'textarea';
  type?: string;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  // Common props for both input and textarea
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // ARIA attributes
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
  // Input-specific
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  // Textarea-specific
  rows?: number;
  cols?: number;
}

export const Field = forwardRef<HTMLInputElement | HTMLTextAreaElement, FieldProps>(
  (
    {
      as = 'input',
      type = 'text',
      error = false,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const fieldClasses = [
      styles.field,
      as === 'textarea' && styles.textarea,
      error && styles.error,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (as === 'textarea') {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={fieldClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        className={fieldClasses}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  }
);

Field.displayName = 'Field';

export default Field;
