'use client';

import { useEffect, useState, useMemo, use, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TechItem } from '@prisma/client';
import { radarsApi, itemsApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { RadarWithOwner } from '@/lib/types/radar.types';
import { AppLayout } from '@/components/Layout/AppLayout';
import { TopNavigation } from '@/components/Layout/TopNavigation';
import { SidePanel } from '@/components/SidePanel/SidePanel';
import { TechItemForm, TechItemFormData } from '@/components/SidePanel/TechItemForm';
import { RadarCanvas } from '@/components/Radar/RadarCanvas';
import { ShareModal } from '@/components/Modals/ShareModal';
import { WelcomeModal } from '@/components/Modals/WelcomeModal';
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
  const { data: session, status } = useSession();
  const router = useRouter();

  const [radar, setRadar] = useState<RadarWithOwner | null>(null);
  const [isLoadingRadar, setIsLoadingRadar] = useState(true);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Check if user is the owner
  const isOwner = session?.user?.email === radar?.owner?.email;

  // Anyone with the link can edit (owner or guest)
  const canEdit = true;

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

  // Show welcome modal for unauthenticated users
  useEffect(() => {
    // Only show modal when session status is definitively "unauthenticated"
    if (radar && status === 'unauthenticated' && !isLoadingRadar) {
      // Check if user has already dismissed the welcome modal in this session
      const hasSeenWelcome = sessionStorage.getItem(`welcome-seen-${shareToken}`);
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    } else if (status === 'authenticated') {
      // Hide modal if user becomes authenticated
      setShowWelcomeModal(false);
    }
  }, [radar, status, isLoadingRadar, shareToken]);

  // Cache for calculated positions to prevent recalculation during save process
  const positionCache = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Calculate blip positions
  const itemsWithPositions = useMemo(() => {
    if (!items.length) return [];
    const config = getDefaultPositioningConfig(800, 800);

    // Inject cached positions for items that don't have saved positions yet
    const itemsWithCached = items.map(item => {
      // If item has saved position in DB, use it
      if (item.positionX !== null && item.positionX !== undefined &&
          item.positionY !== null && item.positionY !== undefined) {
        return item;
      }

      // Check cache for this item
      const cached = positionCache.current.get(item.id);
      if (cached) {
        // Use cached position by temporarily injecting it
        return { ...item, positionX: cached.x, positionY: cached.y };
      }

      // No saved or cached position
      return item;
    });

    const result = calculateAllBlipPositions(itemsWithCached, config);

    // Store newly calculated positions in cache
    result.forEach(itemWithPos => {
      if (!positionCache.current.has(itemWithPos.id)) {
        positionCache.current.set(itemWithPos.id, {
          x: itemWithPos.position.x,
          y: itemWithPos.position.y
        });
      }
    });

    return result;
  }, [items]);

  // Save calculated positions for items that don't have saved positions
  useEffect(() => {
    if (!itemsWithPositions.length || !canEdit || !radar) return;

    // Find items that don't have saved positions
    const itemsNeedingSave = itemsWithPositions.filter(
      item => item.positionX === null || item.positionX === undefined ||
              item.positionY === null || item.positionY === undefined
    );

    if (itemsNeedingSave.length === 0) return;

    // Save positions for all items that need it
    const savePositions = async () => {
      // Save all positions in parallel
      await Promise.all(
        itemsNeedingSave.map(item =>
          updateTechItem(item.id, {
            positionX: item.position.x,
            positionY: item.position.y,
          })
        )
      );
    };

    savePositions();
  }, [itemsWithPositions, canEdit, radar, updateTechItem]);

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

  const handleBlipMove = async (item: TechItem, newQuadrant: number, newRing: number, finalX: number, finalY: number) => {
    // Update the tech item with new quadrant, ring, and saved position
    const result = await updateTechItem(item.id, {
      name: item.name,
      quadrant: newQuadrant,
      ring: newRing,
      positionX: finalX,
      positionY: finalY,
      description: item.description || undefined,
      url: item.url || undefined,
      category: item.category || undefined,
    });

    if (result.success) {
      // Items are automatically updated in the hook, no need for manual refresh
      console.log(`Moved ${item.name} to quadrant ${newQuadrant}, ring ${newRing} at (${finalX}, ${finalY})`);
    }
    // Error is handled by the hook
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleExport = () => {
    console.log('Export clicked');
    // TODO: Implement export functionality
  };

  const handleCustomize = () => {
    console.log('Customize clicked');
    // TODO: Open customize quadrants modal
  };


  const handleContinueAsVisitor = () => {
    // Remember that user has seen the welcome modal for this session
    sessionStorage.setItem(`welcome-seen-${shareToken}`, 'true');
    setShowWelcomeModal(false);
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
      onCustomize={canEdit ? handleCustomize : undefined}
      showAuthControls={true}
    />
  );

  const sidePanel = (
    <SidePanel onAddItem={canEdit ? handleAddItem : undefined}>
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
    <>
      <AppLayout topNav={topNav} sidePanel={sidePanel}>
        <RadarCanvas
          items={itemsWithPositions}
          config={radarConfig}
          onBlipClick={handleBlipClick}
          onBlipMove={canEdit ? handleBlipMove : undefined}
        />
      </AppLayout>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/radar/${shareToken}`}
      />

      <WelcomeModal
        isOpen={showWelcomeModal}
        onContinueAsVisitor={handleContinueAsVisitor}
        radarName={radar?.name || 'Tech Radar'}
      />
    </>
  );
}
