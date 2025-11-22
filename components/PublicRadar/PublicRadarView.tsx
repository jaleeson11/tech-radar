'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { TopNavigation } from '@/components/Layout/TopNavigation';
import { SidePanel } from '@/components/SidePanel/SidePanel';
import { TechItemList } from '@/components/SidePanel/TechItemList';
import { RadarCanvas } from '@/components/Radar/RadarCanvas';
import { HomeWelcomeModal } from '@/components/Modals/HomeWelcomeModal';
import { getExampleTechItems } from '@/lib/utils/createExampleRadar';
import { DEFAULT_QUADRANTS, DEFAULT_RINGS } from '@/lib/constants/defaults';
import {
  calculateAllBlipPositions,
  getDefaultPositioningConfig,
} from '@/components/Radar/BlipPositioning';
import type {
  RadarVisualizationConfig,
  QuadrantConfig,
  RingConfig,
} from '@/lib/types/radar.types';

export function PublicRadarView() {
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Delay modal appearance until after radar animation completes (~2.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Get example tech items and calculate positions
  const items = useMemo(() => {
    const exampleItems = getExampleTechItems();
    const config = getDefaultPositioningConfig(800, 800);

    // Transform example items to match TechItem structure
    const itemsWithIds = exampleItems.map((item, index) => ({
      id: `example-${index}`,
      radarId: 'public-example',
      name: item.name,
      quadrant: item.quadrant,
      ring: item.ring,
      description: item.description,
      url: item.url || null,
      category: item.category || null,
      icon: item.icon || null,
      positionX: null,
      positionY: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return calculateAllBlipPositions(itemsWithIds, config);
  }, []);

  // Build radar visualization config
  const radarConfig: RadarVisualizationConfig = useMemo(() => {
    const quadrants: QuadrantConfig[] = DEFAULT_QUADRANTS.map((name, index) => ({
      index,
      name,
      startAngle: index * 90,
      endAngle: (index + 1) * 90,
    }));

    const rings: RingConfig[] = DEFAULT_RINGS.map((name, index) => {
      // Make Adopt ring larger (35%) and distribute remaining space (65%) equally among 3 rings
      // Adopt: 0-35%, Trial: 35-56.67%, Assess: 56.67-78.33%, Hold: 78.33-100%
      const ringBoundaries = [0, 35, 56.67, 78.33, 100];
      return {
        index,
        name,
        innerRadius: ringBoundaries[index],
        outerRadius: ringBoundaries[index + 1],
      };
    });

    return {
      width: 800,
      height: 800,
      centerX: 400,
      centerY: 400,
      maxRadius: 360,
      quadrants,
      rings,
    };
  }, []);

  const handleExplore = () => {
    setShowWelcomeModal(false);
  };

  const topNav = (
    <TopNavigation
      radarName="Example Tech Radar"
      showAuthControls={true}
      isOwner={false}
    />
  );

  const sidePanel = (
    <SidePanel
      viewMode="list"
      canEdit={false}
    >
      <TechItemList
        items={items.map(item => ({
          id: item.id,
          radarId: item.radarId,
          name: item.name,
          quadrant: item.quadrant,
          ring: item.ring,
          description: item.description,
          url: item.url,
          category: item.category,
          icon: item.icon,
          positionX: item.position.x,
          positionY: item.position.y,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))}
        quadrants={DEFAULT_QUADRANTS}
        rings={DEFAULT_RINGS}
        onItemClick={() => {}} // No-op for read-only
        onEditClick={() => {}} // No-op for read-only
        onDeleteClick={() => {}} // No-op for read-only
        canEdit={false}
      />
    </SidePanel>
  );

  return (
    <>
      <AppLayout topNav={topNav} sidePanel={sidePanel}>
        <RadarCanvas
          items={items}
          config={radarConfig}
        />
      </AppLayout>

      <HomeWelcomeModal
        isOpen={showWelcomeModal}
        onExplore={handleExplore}
      />
    </>
  );
}
