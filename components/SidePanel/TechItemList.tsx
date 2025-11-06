'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { TechItem } from '@/lib/types/radar.types';
import { TechIcon } from './TechIcon';
import styles from './TechItemList.module.css';

interface TechItemListProps {
  items: TechItem[];
  quadrants: string[];
  rings: string[];
  onItemClick: (item: TechItem) => void;
  onEditClick: (item: TechItem) => void;
  onDeleteClick: (item: TechItem) => void;
  canEdit?: boolean;
}

interface GroupedItems {
  [category: string]: TechItem[];
}

export function TechItemList({
  items,
  quadrants,
  rings,
  onItemClick,
  onEditClick,
  onDeleteClick,
  canEdit = true
}: TechItemListProps) {
  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Uncategorized'])
  );

  // Group items by category
  const groupedItems = useMemo<GroupedItems>(() => {
    const groups: GroupedItems = {};

    items.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    // Sort items within each category by name
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [items]);

  // Get sorted category names (Uncategorized first, then alphabetically)
  const categoryNames = useMemo(() => {
    const categories = Object.keys(groupedItems);
    return categories.sort((a, b) => {
      if (a === 'Uncategorized') return -1;
      if (b === 'Uncategorized') return 1;
      return a.localeCompare(b);
    });
  }, [groupedItems]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleItemClick = (item: TechItem, e: React.MouseEvent) => {
    // Prevent triggering if clicking on action buttons
    if ((e.target as HTMLElement).closest(`.${styles.itemActions}`)) {
      return;
    }
    onItemClick(item);
  };

  const handleEditClick = (item: TechItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(item);
  };

  const handleDeleteClick = (item: TechItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(item);
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No tech items yet</p>
        <p className={styles.emptyHint}>Click "Add Item" to get started</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {categoryNames.map(category => {
        const categoryItems = groupedItems[category];
        const isExpanded = expandedCategories.has(category);
        const itemCount = categoryItems.length;

        return (
          <div key={category} className={styles.categorySection}>
            {/* Category Header */}
            <button
              className={styles.categoryHeader}
              onClick={() => toggleCategory(category)}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category} category`}
            >
              <span className={styles.categoryIcon}>
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
              <span className={styles.categoryName}>{category}</span>
              <span className={styles.categoryCount}>{itemCount}</span>
            </button>

            {/* Category Items */}
            {isExpanded && (
              <div className={styles.categoryItems}>
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={styles.itemCard}
                    data-quadrant={item.quadrant}
                    onClick={(e) => handleItemClick(item, e)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onItemClick(item);
                      }
                    }}
                    aria-label={`View details for ${item.name}`}
                  >
                    {item.icon && (
                      <div className={styles.itemIcon}>
                        <TechIcon icon={item.icon} name={item.name} size={32} />
                      </div>
                    )}
                    <div className={styles.itemContent}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <div className={styles.itemMeta}>
                        <span className={styles.metaItem}>
                          <span className={styles.metaLabel}>Quadrant:</span>
                          <span className={styles.metaValue}>
                            {quadrants[item.quadrant]}
                          </span>
                        </span>
                        <span className={styles.metaDivider}>•</span>
                        <span className={styles.metaItem}>
                          <span className={styles.metaLabel}>Ring:</span>
                          <span className={styles.metaValue}>
                            {rings[item.ring]}
                          </span>
                        </span>
                      </div>
                    </div>

                    {canEdit && (
                      <div className={styles.itemActions}>
                        <button
                          onClick={(e) => handleEditClick(item, e)}
                          className={styles.actionButton}
                          aria-label={`Edit ${item.name}`}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(item, e)}
                          className={styles.actionButton}
                          aria-label={`Delete ${item.name}`}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TechItemList;
