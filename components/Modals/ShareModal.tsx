'use client';

import React, { useState } from 'react';
import { Link2, Check, Lock, Globe } from 'lucide-react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  permission: 'view' | 'edit';
  onPermissionChange: (permission: 'view' | 'edit') => Promise<void>;
  isOwner: boolean;
}

export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  permission,
  onPermissionChange,
  isOwner,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePermissionChange = async (newPermission: 'view' | 'edit') => {
    if (!isOwner || isUpdating) return;

    setIsUpdating(true);
    try {
      await onPermissionChange(newPermission);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-labelledby="share-modal-title">
        <div className={styles.header}>
          <h2 id="share-modal-title" className={styles.title}>
            Share radar
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="permission-select">
              General access
            </label>
            <div className={styles.permissionControl}>
              <div className={styles.permissionIcon}>
                {permission === 'view' ? (
                  <Lock size={20} />
                ) : (
                  <Globe size={20} />
                )}
              </div>
              <select
                id="permission-select"
                value={permission}
                onChange={(e) => handlePermissionChange(e.target.value as 'view' | 'edit')}
                className={styles.permissionSelect}
                disabled={!isOwner || isUpdating}
              >
                <option value="view">Restricted</option>
                <option value="edit">Anyone with the link</option>
              </select>
            </div>
            <p className={styles.permissionDescription}>
              {permission === 'view'
                ? 'Only people with access can open with the link'
                : 'Anyone with the link can edit'}
            </p>
          </div>

          <div className={styles.actions}>
            <button
              onClick={handleCopyLink}
              className={styles.copyButton}
              aria-label="Copy link"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  <span>Link copied</span>
                </>
              ) : (
                <>
                  <Link2 size={18} />
                  <span>Copy link</span>
                </>
              )}
            </button>
            <button onClick={onClose} className={styles.doneButton}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
