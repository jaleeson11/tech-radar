'use client';

import React from 'react';
import { Library, PlusCircle } from 'lucide-react';
import styles from './AddItemChoice.module.css';

interface AddItemChoiceProps {
  onBrowseLibrary: () => void;
  onCreateCustom: () => void;
}

export function AddItemChoice({ onBrowseLibrary, onCreateCustom }: AddItemChoiceProps) {
  return (
    <div className={styles.container}>

      <div className={styles.choices}>
        <button
          onClick={onBrowseLibrary}
          className={styles.choiceCard}
          aria-label="Browse tech library"
        >
          <div className={styles.iconWrapper}>
            <Library size={32} className={styles.icon} />
          </div>
          <h3 className={styles.choiceTitle}>Browse Library</h3>
          <p className={styles.choiceDescription}>
            Choose from 85+ popular technologies with pre-filled information and icons
          </p>
        </button>

        <button
          onClick={onCreateCustom}
          className={styles.choiceCard}
          aria-label="Create custom item"
        >
          <div className={styles.iconWrapper}>
            <PlusCircle size={32} className={styles.icon} />
          </div>
          <h3 className={styles.choiceTitle}>Create Custom</h3>
          <p className={styles.choiceDescription}>
            Add your own technology with custom details
          </p>
        </button>
      </div>
    </div>
  );
}

export default AddItemChoice;
