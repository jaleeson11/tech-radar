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

        <h2 className={styles.title}>Welcome to Your Tech Radar!</h2>

        <div className={styles.description}>
          <p>
            We've created <strong>{radarName}</strong> for you - your blank canvas to map out your technology landscape.
          </p>
          <p>
            Build your radar by adding technologies and organizing them into quadrants (categories) and rings (adoption stages).
          </p>
          <ul className={styles.features}>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Click "Add Item" to add your first technology</span>
            </li>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Browse our tech library or create custom items</span>
            </li>
            <li>
              <Check className={styles.checkIcon} size={18} />
              <span>Drag and drop items to reposition them</span>
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
