'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { TECH_LIBRARY, getAllCategories, TechLibraryItem } from '@/lib/data/tech-library';
import { TechIcon } from './TechIcon';
import styles from './TechLibrary.module.css';

interface TechLibraryProps {
  onSelectItem: (item: TechLibraryItem) => void;
  onBack: () => void;
}

export function TechLibrary({ onSelectItem, onBack }: TechLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => ['All', ...getAllCategories()], []);

  const filteredItems = useMemo(() => {
    let items = TECH_LIBRARY;

    // Filter by category
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.categories.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
      );
    }

    return items;
  }, [searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={onBack}
          className={styles.backButton}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Tech Library</h2>
          <p className={styles.subtitle}>{TECH_LIBRARY.length} technologies</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search technologies"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className={styles.filterContainer}>
        <div className={styles.filterScroll}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.filterButton} ${
                selectedCategory === category ? styles.filterButtonActive : ''
              }`}
              aria-label={`Filter by ${category}`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className={styles.results}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No technologies found</p>
            <p className={styles.emptyHint}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={styles.techCard}
                aria-label={`Select ${item.name}`}
              >
                <div className={styles.techIcon}>
                  <TechIcon icon={item.icon} name={item.name} size={32} />
                </div>
                <div className={styles.techInfo}>
                  <h3 className={styles.techName}>{item.name}</h3>
                  <p className={styles.techDescription}>{item.description}</p>
                  <div className={styles.techCategories}>
                    {item.categories.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className={styles.techCategory}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TechLibrary;
