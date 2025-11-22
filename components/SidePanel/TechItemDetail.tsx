'use client';

import React from 'react';
import { TechItem } from '@prisma/client';
import { ExternalLink } from 'lucide-react';
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
      {/* Content sections */}
      <div className={styles.content}>
        {/* Position Info */}
        <div className={styles.section}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem} data-quadrant={item.quadrant}>
              <span className={styles.label}>Quadrant</span>
              <span className={styles.value}>
                {quadrantNames[item.quadrant] || `Quadrant ${item.quadrant + 1}`}
              </span>
            </div>
            <div className={styles.infoItem} data-ring={item.ring}>
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
      </div>
    </div>
  );
}

export default TechItemDetail;
