'use client';

import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <p className={styles.description}>
              Anyone with this link can view and edit this radar
            </p>
            <div className={styles.linkBox}>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className={styles.linkInput}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
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
