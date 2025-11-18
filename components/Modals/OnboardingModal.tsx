'use client';

import React from 'react';
import { Radar, Check } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/Button';
import styles from './OnboardingModal.module.css';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  radarName: string;
}

export function OnboardingModal({
  isOpen,
  onClose,
  radarName,
}: OnboardingModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEscape={false}
      maxWidth="md"
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          <Radar size={48} />
        </div>

        <h2 className={styles.title}>Welcome to Technology Radar!</h2>

        <div className={styles.description}>
          <p>
            We've created an example radar called <strong>{radarName}</strong> to help you get started.
          </p>
          <p>
            It's pre-populated with various technologies organized into quadrants and rings.
            Feel free to explore, edit, or delete items to make it your own.
          </p>
          <ul className={styles.features}>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Click on any blip to view details</span>
            </li>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Drag and drop items to reposition them</span>
            </li>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Add new technologies using the button in the navigation</span>
            </li>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Customize quadrants and rings in settings</span>
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            size="lg"
            aria-label="Get started with your radar"
          >
            Get Started
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
