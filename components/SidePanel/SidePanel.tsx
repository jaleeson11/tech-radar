'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  onAddItem?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function SidePanel({ onAddItem, children, className }: SidePanelProps) {
  return (
    <div className={`${styles.sidePanel} ${className || ''}`}>
      {/* Header with Add Button */}
      <div className={styles.header}>
        <h2 className={styles.title}>Tech Items</h2>
        {onAddItem && (
          <button
            onClick={onAddItem}
            className={styles.addButton}
            aria-label="Add tech item"
            title="Add tech item"
          >
            <Plus size={18} aria-hidden="true" />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        {children || (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No tech items yet</p>
            {onAddItem && (
              <p className={styles.emptyHint}>Click "Add Item" to get started</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SidePanel;
