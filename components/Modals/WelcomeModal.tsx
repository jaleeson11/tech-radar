'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleLogin = () => {
    // Pass current URL as callbackUrl so user is redirected back after login
    const callbackUrl = encodeURIComponent(window.location.href);
    router.push(`/login?callbackUrl=${callbackUrl}`);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} role="dialog" aria-labelledby="welcome-modal-title">
        <div className={styles.content}>
          <div className={styles.icon}>
            <Users size={48} />
          </div>

          <h2 id="welcome-modal-title" className={styles.title}>
            {radarName}
          </h2>

          <p className={styles.description}>
            Collaborate with your team on this tech radar
          </p>

          <div className={styles.actions}>
            <button
              onClick={handleLogin}
              className={styles.loginButton}
              aria-label="Log in to your account"
            >
              Log in
            </button>
            <button
              onClick={onContinueAsVisitor}
              className={styles.visitorButton}
              aria-label="Continue as a visitor"
            >
              Enter as a visitor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
