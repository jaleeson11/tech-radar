'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Calendar, FileText, User } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Button } from '@/components/Button';
import { RadarLoader } from '@/components/RadarLoader/RadarLoader';
import { radarsApi, RadarListItem, SharedRadarListItem } from '@/lib/api';
import { AxiosError } from 'axios';
import styles from './RadarSwitcherModal.module.css';

type TabType = 'owned' | 'shared';

interface RadarSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRadarId?: string;
}

export function RadarSwitcherModal({
  isOpen,
  onClose,
  currentRadarId,
}: RadarSwitcherModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('owned');
  const [radars, setRadars] = useState<RadarListItem[]>([]);
  const [sharedRadars, setSharedRadars] = useState<SharedRadarListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [radarToDelete, setRadarToDelete] = useState<RadarListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRadars();
    }
  }, [isOpen]);

  const fetchRadars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ownedData, sharedData] = await Promise.all([
        radarsApi.getAll(),
        radarsApi.getShared(),
      ]);
      setRadars(ownedData);
      setSharedRadars(sharedData);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to load radars'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRadar = async () => {
    try {
      setIsCreating(true);
      setError(null);
      const newRadar = await radarsApi.create({
        name: 'New Technology Radar',
      });
      onClose();
      router.push(`/radar/${newRadar.shareToken}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to create radar'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (radar: RadarListItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent radar click
    setRadarToDelete(radar);
  };

  const handleConfirmDelete = async () => {
    if (!radarToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);
      await radarsApi.delete(radarToDelete.id);

      // Remove from list
      setRadars(radars.filter((r) => r.id !== radarToDelete.id));

      // If deleting current radar, redirect to first remaining radar or home
      if (radarToDelete.id === currentRadarId) {
        const remainingRadars = radars.filter((r) => r.id !== radarToDelete.id);
        if (remainingRadars.length > 0) {
          setRadarToDelete(null);
          onClose();
          router.push(`/radar/${remainingRadars[0].shareToken}`);
        } else {
          setRadarToDelete(null);
          onClose();
          router.push('/');
        }
      } else {
        setRadarToDelete(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to delete radar'
      );
      setRadarToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setRadarToDelete(null);
  };

  const handleRadarClick = (shareToken: string) => {
    onClose();
    router.push(`/radar/${shareToken}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const currentRadars = activeTab === 'owned' ? radars : sharedRadars;

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="My Radars"
        maxWidth="md"
      >
      <div className={styles.content}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'owned' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('owned')}
          >
            My Radars {radars.length > 0 && `(${radars.length})`}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'shared' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('shared')}
          >
            Shared with me {sharedRadars.length > 0 && `(${sharedRadars.length})`}
          </button>
        </div>

        {/* Create New Button (only for owned tab) */}
        {activeTab === 'owned' && (
          <>
            <Button
              onClick={handleCreateRadar}
              variant="primary"
              fullWidth
              leftIcon={<Plus size={18} />}
              isLoading={isCreating}
              disabled={isLoading || radars.length >= 10}
            >
              Create New Radar
            </Button>

            {radars.length >= 10 && (
              <p className={styles.limitMessage}>
                You've reached the maximum of 10 radars
              </p>
            )}
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingState}>
            <RadarLoader size={60} />
            <p>Loading radars...</p>
          </div>
        )}

        {/* Radars List */}
        {!isLoading && currentRadars.length > 0 && (
          <div className={styles.radarsList}>
            {currentRadars.map((radar) => {
              const isShared = activeTab === 'shared';
              const sharedRadar = isShared ? (radar as SharedRadarListItem) : null;

              return (
                <div
                  key={radar.id}
                  className={`${styles.radarItem} ${radar.id === currentRadarId ? styles.active : ''}`}
                  onClick={() => handleRadarClick(radar.shareToken)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRadarClick(radar.shareToken);
                    }
                  }}
                >
                  <div className={styles.radarInfo}>
                    <h3 className={styles.radarName}>{radar.name}</h3>
                    <div className={styles.radarMeta}>
                      {sharedRadar && (
                        <span className={styles.metaItem}>
                          <User size={14} />
                          {sharedRadar.owner.name || sharedRadar.owner.email}
                        </span>
                      )}
                      <span className={styles.metaItem}>
                        <FileText size={14} />
                        {radar._count.items} {radar._count.items === 1 ? 'item' : 'items'}
                      </span>
                      <span className={styles.metaItem}>
                        <Calendar size={14} />
                        {formatDate(isShared && sharedRadar ? sharedRadar.lastViewed : radar.updatedAt)}
                      </span>
                    </div>
                  </div>
                  {!isShared && (
                    <button
                      onClick={(e) => handleDeleteClick(radar, e)}
                      className={styles.deleteButton}
                      aria-label={`Delete ${radar.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && currentRadars.length === 0 && (
          <div className={styles.emptyState}>
            <p>
              {activeTab === 'owned'
                ? 'No radars yet. Create your first one!'
                : 'No shared radars yet. Ask someone to share their radar with you!'}
            </p>
          </div>
        )}
      </div>
      </BaseModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!radarToDelete}
        title="Delete Radar"
        message={`Are you sure you want to delete "${radarToDelete?.name}"? This action cannot be undone. All items in this radar will be permanently deleted.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default RadarSwitcherModal;
