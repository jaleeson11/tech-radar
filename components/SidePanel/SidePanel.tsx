'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
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
          <Button
            onClick={onAddItem}
            variant="primary"
            size="sm"
            leftIcon={<Plus size={18} />}
            aria-label="Add tech item"
            title="Add tech item"
            className={styles.addButton}
          >
            Add Item
          </Button>
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
