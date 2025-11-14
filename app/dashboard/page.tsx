'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { radarsApi, RadarListItem } from '@/lib/api';
import { AxiosError } from 'axios';
import { Button } from '@/components/Button';
import { RadarLoader } from '@/components/RadarLoader/RadarLoader';
import styles from './page.module.css';

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [radars, setRadars] = useState<RadarListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchRadars();
    }
  }, [status, router]);

  const fetchRadars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await radarsApi.getAll();
      setRadars(data);
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
      setError(null);
      const newRadar = await radarsApi.create({
        name: 'New Technology Radar',
      });
      router.push(`/radar/${newRadar.shareToken}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to create radar'
      );
    }
  };

  const handleDeleteRadar = async (radarId: string, radarName: string) => {
    if (!confirm(`Are you sure you want to delete "${radarName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      await radarsApi.delete(radarId);
      setRadars(radars.filter((r) => r.id !== radarId));
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to delete radar'
      );
    }
  };

  const filteredRadars = radars.filter((radar) =>
    radar.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingState}>
          <RadarLoader size={80} />
          <p>Loading your radars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>My Technology Radars</h1>
            <p>Manage and visualize your technology landscape</p>
          </div>
          <Button
            onClick={handleCreateRadar}
            variant="primary"
            leftIcon={<Plus size={20} />}
            aria-label="Create new radar"
          >
            Create Radar
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search radars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search radars"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage} role="alert">
          <p>{error}</p>
          <button onClick={() => setError(null)} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {/* Radars Grid */}
      {filteredRadars.length === 0 ? (
        <div className={styles.emptyState}>
          {searchQuery ? (
            <>
              <Search size={48} aria-hidden="true" />
              <h2>No radars found</h2>
              <p>No radars match your search query &quot;{searchQuery}&quot;</p>
            </>
          ) : (
            <>
              <Plus size={48} aria-hidden="true" />
              <h2>No radars yet</h2>
              <p>Create your first technology radar to get started</p>
              <Button
                onClick={handleCreateRadar}
                variant="primary"
                size="lg"
                leftIcon={<Plus size={20} />}
              >
                Create Your First Radar
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.radarsGrid}>
          {filteredRadars.map((radar) => (
            <div key={radar.id} className={styles.radarCard}>
              <div className={styles.cardHeader}>
                <h3>{radar.name}</h3>
              </div>

              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <Eye size={16} aria-hidden="true" />
                  <span>{radar._count.items} items</span>
                </div>
                <div className={styles.stat}>
                  <Calendar size={16} aria-hidden="true" />
                  <span>Updated {formatDate(radar.updatedAt)}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link
                  href={`/radar/${radar.shareToken}`}
                  className={styles.viewButton}
                >
                  <Eye size={18} aria-hidden="true" />
                  View
                </Link>
                <Link
                  href={`/radar/${radar.shareToken}?edit=true`}
                  className={styles.editButton}
                >
                  <Edit size={18} aria-hidden="true" />
                  Edit
                </Link>
                <Button
                  onClick={() => handleDeleteRadar(radar.id, radar.name)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={18} />}
                  aria-label={`Delete ${radar.name}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
