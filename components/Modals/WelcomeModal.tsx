'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/Button';
import styles from './WelcomeModal.module.css';

interface WelcomeModalProps {
  isOpen: boolean;
  onContinueAsVisitor: () => void;
  radarName: string;
}

export function WelcomeModal({
  isOpen,
  onContinueAsVisitor,
  radarName,
}: WelcomeModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    // Pass current URL as callbackUrl so user is redirected back after login
    const callbackUrl = encodeURIComponent(window.location.href);
    router.push(`/login?callbackUrl=${callbackUrl}`);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onContinueAsVisitor}
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEscape={false}
      maxWidth="sm"
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          <Users size={48} />
        </div>

        <h2 className={styles.title}>{radarName}</h2>

        <p className={styles.description}>
          Collaborate with your team on this tech radar
        </p>

        <div className={styles.actions}>
          <Button
            onClick={handleLogin}
            variant="primary"
            fullWidth
            size="lg"
            aria-label="Log in to your account"
          >
            Log in
          </Button>
          <Button
            onClick={onContinueAsVisitor}
            variant="secondary"
            fullWidth
            size="lg"
            aria-label="Continue as a visitor"
          >
            Enter as a visitor
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
