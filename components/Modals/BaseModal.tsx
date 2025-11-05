'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './BaseModal.module.css';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  maxWidth = 'md',
  className = '',
}: BaseModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={`${styles.modal} ${styles[`modal-${maxWidth}`]} ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close modal"
                type="button"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

export default BaseModal;
