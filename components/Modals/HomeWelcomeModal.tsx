'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo/Logo';
import styles from './HomeWelcomeModal.module.css';

interface HomeWelcomeModalProps {
  isOpen: boolean;
  onExplore: () => void;
}

export function HomeWelcomeModal({
  isOpen,
  onExplore,
}: HomeWelcomeModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onExplore}
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEscape={false}
      maxWidth="md"
    >
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Logo size="lg" />
        </div>

        <div className={styles.description}>
          <p>
            Visualize and communicate your technology landscape. Map your tech stack,
            track adoption decisions, and share insights with your team.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <strong>Organize</strong> technologies into quadrants and rings
            </div>
            <div className={styles.feature}>
              <strong>Track</strong> adoption stages from Trial to Hold
            </div>
            <div className={styles.feature}>
              <strong>Share</strong> with your team for collaboration
            </div>
          </div>

          <p className={styles.ctaText}>
            Sign in to create your own radar and start building your technology strategy.
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleLogin}
            variant="primary"
            fullWidth
            size="lg"
            leftIcon={<LogIn size={20} />}
            aria-label="Sign in to create your radar"
          >
            Sign In to Get Started
          </Button>
          <Button
            onClick={onExplore}
            variant="ghost"
            fullWidth
            size="lg"
            leftIcon={<Eye size={20} />}
            aria-label="Explore the example"
          >
            Explore Example
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
