'use client';

import { useEffect, useState, useMemo, use, useRef, useCallback } from 'react';
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
import { TechItemDetail } from '@/components/SidePanel/TechItemDetail';
import { TechItemList } from '@/components/SidePanel/TechItemList';
import { AddItemChoice } from '@/components/SidePanel/AddItemChoice';
import { TechLibrary } from '@/components/SidePanel/TechLibrary';
import { TechLibraryItem } from '@/lib/data/tech-library';
import { RadarCanvas } from '@/components/Radar/RadarCanvas';
import { ShareModal } from '@/components/Modals/ShareModal';
import { WelcomeModal } from '@/components/Modals/WelcomeModal';
import { DeleteConfirmModal } from '@/components/Modals/DeleteConfirmModal';
import { CustomizeQuadrantsModal } from '@/components/Modals/CustomizeQuadrantsModal';
import { RadarLoader } from '@/components/RadarLoader/RadarLoader';
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
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showLibraryBrowse, setShowLibraryBrowse] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [libraryItemData, setLibraryItemData] = useState<TechLibraryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<TechItem | null>(null);
  const [editingItem, setEditingItem] = useState<TechItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TechItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [isSavingQuadrants, setIsSavingQuadrants] = useState(false);
  const [mobileSidePanelOpen, setMobileSidePanelOpen] = useState(false);
  const [hasLoadedItems, setHasLoadedItems] = useState(false);

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
      refreshItems().then(() => {
        setHasLoadedItems(true);
      });
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

  const handleBlipClick = useCallback((item: TechItem) => {
    // Open item detail view in side panel
    setViewingItem(item);
    setEditingItem(null);
    // Close any add-related views
    setShowAddForm(false);
    setShowAddChoice(false);
    setShowLibraryBrowse(false);
    setLibraryItemData(null);
    setSuccessMessage(null);
    // Open mobile drawer to show detail view
    setMobileSidePanelOpen(true);
  }, []);

  const handleAddItem = () => {
    setShowAddChoice(true);
    setShowLibraryBrowse(false);
    setShowAddForm(false);
    setLibraryItemData(null);
    setViewingItem(null);
    setEditingItem(null);
    setSuccessMessage(null);
    // Open mobile drawer to show choice
    setMobileSidePanelOpen(true);
  };

  const handleBrowseLibrary = () => {
    setShowAddChoice(false);
    setShowLibraryBrowse(true);
    setShowAddForm(false);
  };

  const handleCreateCustom = () => {
    setShowAddChoice(false);
    setShowLibraryBrowse(false);
    setShowAddForm(true);
    setLibraryItemData(null);
  };

  const handleSelectLibraryItem = (item: TechLibraryItem) => {
    setLibraryItemData(item);
    setShowLibraryBrowse(false);
    setShowAddForm(true);
  };

  const handleBackFromLibrary = () => {
    setShowLibraryBrowse(false);
    setShowAddChoice(true);
  };

  const handleBackFromChoice = () => {
    setShowAddChoice(false);
    setShowAddForm(false);
    setShowLibraryBrowse(false);
    setLibraryItemData(null);
  };

  const handleSaveItem = async (data: TechItemFormData) => {
    const result = await addTechItem(data);

    if (result.success) {
      setSuccessMessage('Tech item added successfully!');
      setShowAddForm(false);
      setShowAddChoice(false);
      setShowLibraryBrowse(false);
      setLibraryItemData(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    // Error is handled by the hook and passed to the form
  };

  const handleEditItem = async (data: TechItemFormData) => {
    if (!editingItem) return;

    // Check if quadrant or ring changed - if so, clear saved positions to force recalculation
    const quadrantChanged = data.quadrant !== editingItem.quadrant;
    const ringChanged = data.ring !== editingItem.ring;
    const shouldClearPosition = quadrantChanged || ringChanged;

    // Clear from cache if position needs recalculation
    if (shouldClearPosition) {
      positionCache.current.delete(editingItem.id);
    }

    const updateData = {
      ...data,
      // Clear saved positions if ring or quadrant changed
      ...(shouldClearPosition && { positionX: null, positionY: null }),
    };

    const result = await updateTechItem(editingItem.id, updateData);

    if (result.success) {
      setSuccessMessage('Tech item updated successfully!');
      // Return to detail view after successful edit
      setViewingItem(result.item || null);
      setEditingItem(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    // Error is handled by the hook and passed to the form
  };

  const handleEditFromDetail = () => {
    // Switch from detail view to edit mode
    if (viewingItem) {
      setEditingItem(viewingItem);
      setViewingItem(null);
    }
  };

  const handleCloseDetail = () => {
    setViewingItem(null);
    setSuccessMessage(null);
    // Close mobile drawer when closing detail view
    setMobileSidePanelOpen(false);
  };

  const handleDeleteClick = () => {
    if (viewingItem) {
      setItemToDelete(viewingItem);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const result = await deleteTechItem(itemToDelete.id);

    if (result.success) {
      setSuccessMessage('Tech item deleted successfully!');
      setShowDeleteModal(false);
      setItemToDelete(null);
      setViewingItem(null);
      // Close mobile drawer after deletion
      setMobileSidePanelOpen(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    // Error is handled by the hook and will show in the error state
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCancelForm = () => {
    // If we were editing, return to detail view
    if (editingItem) {
      setViewingItem(editingItem);
      setEditingItem(null);
    } else {
      // If we were adding from library, go back to library
      if (libraryItemData) {
        setShowAddForm(false);
        setShowLibraryBrowse(true);
        setLibraryItemData(null);
      } else {
        // Otherwise just close the form and go back to choice
        setShowAddForm(false);
        setShowAddChoice(true);
      }
    }
    setSuccessMessage(null);
  };

  const handleBlipMove = useCallback(async (item: TechItem, newQuadrant: number, newRing: number, finalX: number, finalY: number) => {
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

    if (result.success && result.item) {
      // If this item is currently being viewed, update the detail view with the returned item
      setViewingItem(currentViewingItem => {
        if (currentViewingItem && currentViewingItem.id === item.id) {
          return result.item!;
        }
        return currentViewingItem;
      });
    }
    // Error is handled by the hook
  }, [updateTechItem]);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCustomize = () => {
    setShowCustomizeModal(true);
  };

  const handleUpdateName = async (name: string) => {
    if (!radar) return;

    try {
      // Update radar with new name
      const updatedRadar = await radarsApi.update(radar.id, { name });

      // Update local state directly instead of refetching
      setRadar({ ...radar, name: updatedRadar.name });
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      console.error('Failed to update radar name:', axiosError);
      throw err; // Re-throw so the component can handle it
    }
  };

  const handleSaveQuadrants = async (quadrants: string[]) => {
    if (!radar) return;

    try {
      setIsSavingQuadrants(true);

      // Update radar with new quadrant names
      await radarsApi.update(radar.id, { quadrants });

      // Refresh radar data to get the updated quadrants
      await fetchRadarData();

      // Close modal on success
      setShowCustomizeModal(false);
      setSuccessMessage('Quadrants updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      console.error('Failed to update quadrants:', axiosError);
      // Note: Error will be shown in the modal/UI
      // You could add error handling to show a toast or error message
    } finally {
      setIsSavingQuadrants(false);
    }
  };


  const handleContinueAsVisitor = () => {
    // Remember that user has seen the welcome modal for this session
    sessionStorage.setItem(`welcome-seen-${shareToken}`, 'true');
    setShowWelcomeModal(false);
  };

  // Loading state - only show for initial load, not for updates
  if (isLoadingRadar || (isLoadingItems && !hasLoadedItems)) {
    return (
      <div className={styles.loadingContainer}>
        <RadarLoader size={80} />
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
      onCustomize={handleCustomize}
      onUpdateName={handleUpdateName}
      showAuthControls={true}
      isOwner={isOwner}
    />
  );

  // Determine view mode for side panel header
  const getViewMode = (): 'list' | 'detail' | 'add' | 'edit' | 'add-choice' | 'library-browse' => {
    if (showAddChoice) return 'add-choice';
    if (showLibraryBrowse) return 'library-browse';
    if (showAddForm) return 'add';
    if (editingItem) return 'edit';
    if (viewingItem) return 'detail';
    return 'list';
  };

  const sidePanel = (
    <SidePanel
      viewMode={getViewMode()}
      itemName={viewingItem?.name || editingItem?.name}
      itemIcon={viewingItem?.icon || undefined}
      onAddItem={canEdit ? handleAddItem : undefined}
      onBack={viewingItem ? handleCloseDetail : undefined}
      onCancel={(showAddForm || editingItem || showAddChoice) ? (showAddChoice ? handleBackFromChoice : handleCancelForm) : undefined}
      onEdit={viewingItem ? handleEditFromDetail : undefined}
      onDelete={viewingItem ? handleDeleteClick : undefined}
      canEdit={canEdit}
    >
      {showAddChoice ? (
        <AddItemChoice
          onBrowseLibrary={handleBrowseLibrary}
          onCreateCustom={handleCreateCustom}
        />
      ) : showLibraryBrowse ? (
        <TechLibrary
          onSelectItem={handleSelectLibraryItem}
          onBack={handleBackFromLibrary}
        />
      ) : (showAddForm || editingItem) && radar ? (
        <TechItemForm
          mode={editingItem ? 'edit' : 'add'}
          radarId={radar.id}
          quadrantNames={(radar.quadrants as string[]) || DEFAULT_QUADRANTS}
          initialData={editingItem || (libraryItemData ? {
            name: libraryItemData.name,
            description: libraryItemData.description,
            url: libraryItemData.url,
            quadrant: libraryItemData.suggestedQuadrant,
            ring: libraryItemData.suggestedRing,
            category: libraryItemData.categories[0] || undefined,
            icon: libraryItemData.icon,
          } : undefined)}
          onSave={editingItem ? handleEditItem : handleSaveItem}
          onCancel={handleCancelForm}
          successMessage={successMessage}
          errorMessage={itemsError}
          isLoading={isLoadingItems}
        />
      ) : viewingItem && radar ? (
        <TechItemDetail
          item={viewingItem}
          quadrantNames={(radar.quadrants as string[]) || DEFAULT_QUADRANTS}
          ringNames={(radar.rings as string[]) || DEFAULT_RINGS}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteClick}
          onClose={handleCloseDetail}
          canEdit={canEdit}
        />
      ) : (
        <TechItemList
          items={items}
          quadrants={(radar.quadrants as string[]) || DEFAULT_QUADRANTS}
          rings={(radar.rings as string[]) || DEFAULT_RINGS}
          onItemClick={(item) => {
            setViewingItem(item);
            setMobileSidePanelOpen(true);
          }}
          onEditClick={(item) => {
            setEditingItem(item);
            setViewingItem(null);
            setShowAddForm(false);
            setMobileSidePanelOpen(true);
          }}
          onDeleteClick={(item) => {
            setItemToDelete(item);
            setShowDeleteModal(true);
          }}
          canEdit={canEdit}
        />
      )}
    </SidePanel>
  );

  return (
    <>
      <AppLayout
        topNav={topNav}
        sidePanel={sidePanel}
        openSidePanel={mobileSidePanelOpen}
        onSidePanelToggle={setMobileSidePanelOpen}
      >
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

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Tech Item"
        message="Are you sure you want to delete this tech item?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isLoadingItems}
      />

      <CustomizeQuadrantsModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        currentQuadrants={(radar.quadrants as string[]) || DEFAULT_QUADRANTS}
        onSave={handleSaveQuadrants}
        isSaving={isSavingQuadrants}
      />
    </>
  );
}
