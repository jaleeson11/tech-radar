'use client';

import React, { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/Button';
import styles from './CustomizeQuadrantsModal.module.css';

interface CustomizeQuadrantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuadrants: string[];
  onSave: (quadrants: string[]) => void | Promise<void>;
  isSaving?: boolean;
}

export function CustomizeQuadrantsModal({
  isOpen,
  onClose,
  currentQuadrants,
  onSave,
  isSaving = false,
}: CustomizeQuadrantsModalProps) {
  const [quadrants, setQuadrants] = useState<string[]>(currentQuadrants);
  const [errors, setErrors] = useState<string[]>([]);

  // Reset quadrants when modal opens or currentQuadrants change
  useEffect(() => {
    if (isOpen) {
      setQuadrants(currentQuadrants);
      setErrors([]);
    }
  }, [isOpen, currentQuadrants]);

  const handleChange = (index: number, value: string) => {
    const newQuadrants = [...quadrants];
    newQuadrants[index] = value;
    setQuadrants(newQuadrants);

    // Clear error for this field
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = '';
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];
    let isValid = true;

    quadrants.forEach((name, index) => {
      if (!name.trim()) {
        newErrors[index] = 'Required';
        isValid = false;
      } else {
        newErrors[index] = '';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    // Trim all quadrant names
    const trimmedQuadrants = quadrants.map((q) => q.trim());
    await onSave(trimmedQuadrants);
  };

  const handleCancel = () => {
    setQuadrants(currentQuadrants);
    setErrors([]);
    onClose();
  };

  const footer = (
    <div className={styles.footerActions}>
      <Button
        onClick={handleCancel}
        variant="secondary"
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        variant="primary"
        isLoading={isSaving}
      >
        Save Changes
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Customize Quadrants"
      footer={footer}
      closeOnBackdrop={!isSaving}
      closeOnEscape={!isSaving}
      maxWidth="md"
    >
      <p className={styles.description}>
        Customize the names of the four quadrants in your radar.
      </p>

      <div className={styles.form}>
        {quadrants.map((name, index) => (
          <div key={index} className={styles.formGroup}>
            <label htmlFor={`quadrant-${index}`} className={styles.label}>
              Quadrant {index + 1}
            </label>
            <input
              id={`quadrant-${index}`}
              type="text"
              value={name}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`${styles.input} ${errors[index] ? styles.inputError : ''}`}
              placeholder={`Enter quadrant ${index + 1} name`}
              disabled={isSaving}
              maxLength={50}
            />
            {errors[index] && (
              <span className={styles.error} role="alert">
                {errors[index]}
              </span>
            )}
          </div>
        ))}
      </div>
    </BaseModal>
  );
}

export default CustomizeQuadrantsModal;
