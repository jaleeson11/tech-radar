'use client';

import { useEffect, useState, useMemo, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Radar, TechItem } from '@prisma/client';
import { radarsApi, itemsApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { AppLayout } from '@/components/Layout/AppLayout';
import { TopNavigation } from '@/components/Layout/TopNavigation';
import { SidePanel } from '@/components/SidePanel/SidePanel';
import { TechItemForm, TechItemFormData } from '@/components/SidePanel/TechItemForm';
import { RadarCanvas } from '@/components/Radar/RadarCanvas';
import {
  calculateAllBlipPositions,
  getDefaultPositioningConfig,
} from '@/components/Radar/BlipPositioning';
import { DEFAULT_QUADRANTS, DEFAULT_RINGS } from '@/lib/constants/defaults';
import { useTechItems } from '@/hooks/useTechItems';
import type {
  RadarVisualizationConfig,
  QuadrantConfig,
  RingConfig,
} from '@/lib/types/radar.types';
import styles from './page.module.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface RadarViewPageProps {
  params: Promise<{ shareToken: string }>;
}

export default function RadarViewPage({ params }: RadarViewPageProps) {
  const resolvedParams = use(params);
  const { shareToken } = resolvedParams;
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [radar, setRadar] = useState<Radar | null>(null);
  const [isLoadingRadar, setIsLoadingRadar] = useState(true);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use the useTechItems hook for managing items
  const {
    items,
    isLoading: isLoadingItems,
    error: itemsError,
    addTechItem,
    updateTechItem,
    deleteTechItem,
    refreshItems,
  } = useTechItems(radar?.id || '', []);

  useEffect(() => {
    fetchRadarData();
  }, [shareToken]);

  const fetchRadarData = async () => {
    try {
      setIsLoadingRadar(true);
      setRadarError(null);

      // Fetch radar by shareToken (API uses radarId param but accepts shareToken)
      const radarData = await radarsApi.getById(shareToken);
      setRadar(radarData);

      // Items will be loaded via useTechItems hook once radar.id is set
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      if (axiosError.response?.status === 404) {
        setRadarError('Radar not found');
      } else {
        setRadarError(
          axiosError.response?.data?.error ||
          axiosError.message ||
          'Failed to load radar'
        );
      }
    } finally {
      setIsLoadingRadar(false);
    }
  };

  // Load items when radar is loaded
  useEffect(() => {
    if (radar?.id) {
      refreshItems();
    }
  }, [radar?.id]);

  // Calculate blip positions
  const itemsWithPositions = useMemo(() => {
    if (!items.length) return [];
    const config = getDefaultPositioningConfig(800, 800);
    return calculateAllBlipPositions(items, config);
  }, [items]);

  // Build radar visualization config
  const radarConfig: RadarVisualizationConfig | null = useMemo(() => {
    if (!radar) return null;

    const quadrantNames = (radar.quadrants as string[]) || DEFAULT_QUADRANTS;
    const ringNames = (radar.rings as string[]) || DEFAULT_RINGS;

    const quadrants: QuadrantConfig[] = quadrantNames.map((name, index) => ({
      index,
      name,
      startAngle: index * 90,
      endAngle: (index + 1) * 90,
    }));

    const rings: RingConfig[] = ringNames.map((name, index) => ({
      index,
      name,
      innerRadius: (index * 100) / 4,
      outerRadius: ((index + 1) * 100) / 4,
    }));

    return {
      width: 800,
      height: 800,
      centerX: 400,
      centerY: 400,
      maxRadius: 360,
      quadrants,
      rings,
    };
  }, [radar]);

  const handleBlipClick = (item: TechItem) => {
    console.log('Blip clicked:', item);
    // TODO: Open item detail modal
  };

  const handleAddItem = () => {
    setShowAddForm(true);
    setSuccessMessage(null);
  };

  const handleSaveItem = async (data: TechItemFormData) => {
    const result = await addTechItem(data);

    if (result.success) {
      setSuccessMessage('Tech item added successfully!');
      setShowAddForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    // Error is handled by the hook and passed to the form
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setSuccessMessage(null);
  };

  const handleShare = () => {
    const url = window.location.origin + `/radar/${shareToken}`;
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  };

  const handleExport = () => {
    console.log('Export clicked');
    // TODO: Implement export functionality
  };

  const handleCustomize = () => {
    console.log('Customize clicked');
    // TODO: Open customize quadrants modal
  };

  // Loading state
  if (isLoadingRadar) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} aria-label="Loading" />
        <p>Loading radar...</p>
      </div>
    );
  }

  // Error state
  if (radarError || !radar || !radarConfig) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>{radarError || 'Failed to load radar'}</p>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const topNav = (
    <TopNavigation
      radarName={radar.name}
      onShare={handleShare}
      onExport={handleExport}
      onCustomize={isEditMode ? handleCustomize : undefined}
      showAuthControls={true}
    />
  );

  const sidePanel = (
    <SidePanel onAddItem={isEditMode ? handleAddItem : undefined}>
      {showAddForm && radar ? (
        <TechItemForm
          mode="add"
          radarId={radar.id}
          quadrantNames={(radar.quadrants as string[]) || DEFAULT_QUADRANTS}
          onSave={handleSaveItem}
          onCancel={handleCancelForm}
          successMessage={successMessage}
          errorMessage={itemsError}
          isLoading={isLoadingItems}
        />
      ) : items.length === 0 ? (
        <p className={styles.noItems}>No tech items yet</p>
      ) : (
        <ul className={styles.itemsList}>
          {items.map((item) => (
            <li key={item.id} className={styles.itemCard}>
              <h4>{item.name}</h4>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </SidePanel>
  );

  return (
    <AppLayout topNav={topNav} sidePanel={sidePanel}>
      <RadarCanvas
        items={itemsWithPositions}
        config={radarConfig}
        onBlipClick={handleBlipClick}
      />
    </AppLayout>
  );
}
