'use client';

import React from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/Button';
import styles from './DeleteConfirmModal.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  const footer = (
    <div className={styles.actions}>
      <Button
        onClick={onCancel}
        variant="secondary"
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="danger"
        isLoading={isDeleting}
      >
        Delete
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={footer}
      closeOnBackdrop={!isDeleting}
      closeOnEscape={!isDeleting}
      maxWidth="sm"
    >
      <p className={styles.message}>{message}</p>
    </BaseModal>
  );
}

export default DeleteConfirmModal;
