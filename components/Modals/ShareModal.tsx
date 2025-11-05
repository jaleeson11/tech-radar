'use client';

import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/Button';
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const footer = (
    <div className={styles.actions}>
      <Button
        onClick={handleCopyLink}
        variant="secondary"
        leftIcon={copied ? <Check size={18} /> : <Link2 size={18} />}
        aria-label="Copy link"
      >
        {copied ? 'Link copied' : 'Copy link'}
      </Button>
      <Button onClick={onClose} variant="primary">
        Done
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Share radar"
      footer={footer}
      maxWidth="md"
    >
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
    </BaseModal>
  );
}
