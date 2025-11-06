'use client';

import React from 'react';
import { Plus, ArrowLeft, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import styles from './SidePanel.module.css';

type ViewMode = 'list' | 'detail' | 'add' | 'edit';

interface SidePanelProps {
  viewMode?: ViewMode;
  itemName?: string;
  onAddItem?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function SidePanel({
  viewMode = 'list',
  itemName,
  onAddItem,
  onBack,
  onCancel,
  onEdit,
  onDelete,
  canEdit = true,
  children,
  className
}: SidePanelProps) {

  const renderHeader = () => {
    switch (viewMode) {
      case 'detail':
        return (
          <div className={styles.header}>
            <button
              onClick={onBack}
              className={styles.backButton}
              aria-label="Back to list"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className={styles.title}>{itemName || 'Item Details'}</h2>
            {canEdit && (
              <div className={styles.actions}>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className={styles.iconButton}
                    aria-label="Edit item"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className={styles.iconButton}
                    aria-label="Delete item"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case 'add':
        return (
          <div className={styles.header}>
            <h2 className={styles.title}>Add Tech Item</h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className={styles.iconButton}
                aria-label="Cancel"
                title="Cancel"
              >
                <X size={20} />
              </button>
            )}
          </div>
        );

      case 'edit':
        return (
          <div className={styles.header}>
            <h2 className={styles.title}>Edit {itemName || 'Item'}</h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className={styles.iconButton}
                aria-label="Cancel"
                title="Cancel"
              >
                <X size={20} />
              </button>
            )}
          </div>
        );

      case 'list':
      default:
        return (
          <div className={styles.header}>
            <h2 className={styles.title}>Tech Items</h2>
            {onAddItem && canEdit && (
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
        );
    }
  };

  return (
    <div className={`${styles.sidePanel} ${className || ''}`}>
      {renderHeader()}

      {/* Content Area */}
      <div className={styles.content}>
        {children || (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No tech items yet</p>
            {onAddItem && canEdit && (
              <p className={styles.emptyHint}>Click "Add Item" to get started</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SidePanel;
