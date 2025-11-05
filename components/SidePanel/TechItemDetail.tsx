'use client';

import React from 'react';
import { TechItem } from '@prisma/client';
import { ExternalLink, Trash2 } from 'lucide-react';
import styles from './TechItemDetail.module.css';

interface TechItemDetailProps {
  item: TechItem;
  quadrantNames: string[];
  ringNames: string[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  canEdit?: boolean;
}

export function TechItemDetail({
  item,
  quadrantNames,
  ringNames,
  onEdit,
  onDelete,
  onClose,
  canEdit = true,
}: TechItemDetailProps) {
  return (
    <div className={styles.container}>
      {/* Header with Edit button */}
      <div className={styles.header}>
        <h3 className={styles.title}>{item.name}</h3>
        <div className={styles.headerActions}>
          {canEdit && (
            <button
              onClick={onEdit}
              className={styles.editButton}
              aria-label="Edit tech item"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close detail view"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content sections */}
      <div className={styles.content}>
        {/* Position Info */}
        <div className={styles.section}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Quadrant</span>
              <span className={styles.value}>
                {quadrantNames[item.quadrant] || `Quadrant ${item.quadrant + 1}`}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Ring</span>
              <span className={styles.value}>
                {ringNames[item.ring] || `Ring ${item.ring + 1}`}
              </span>
            </div>
          </div>
        </div>

        {/* Category */}
        {item.category && (
          <div className={styles.section}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{item.category}</span>
          </div>
        )}

        {/* Description */}
        {item.description && (
          <div className={styles.section}>
            <span className={styles.label}>Description</span>
            <p className={styles.description}>{item.description}</p>
          </div>
        )}

        {/* URL */}
        {item.url && (
          <div className={styles.section}>
            <span className={styles.label}>Link</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {item.url}
              <ExternalLink className={styles.externalIcon} size={14} aria-hidden="true" />
            </a>
          </div>
        )}

        {/* Metadata */}
        <div className={styles.metadata}>
          <span className={styles.metaLabel}>Created</span>
          <span className={styles.metaValue}>
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          {item.updatedAt && item.updatedAt !== item.createdAt && (
            <>
              <span className={styles.metaSeparator}>•</span>
              <span className={styles.metaLabel}>Updated</span>
              <span className={styles.metaValue}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </>
          )}
        </div>

        {/* Delete Button */}
        {canEdit && (
          <div className={styles.dangerZone}>
            <button
              onClick={onDelete}
              className={styles.deleteButton}
              aria-label="Delete tech item"
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechItemDetail;
