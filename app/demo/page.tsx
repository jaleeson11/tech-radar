'use client';

import React, { useMemo } from 'react';
import { RadarCanvas } from '@/components/Radar/RadarCanvas';
import { AppLayout } from '@/components/Layout/AppLayout';
import { calculateAllBlipPositions, getDefaultPositioningConfig } from '@/components/Radar/BlipPositioning';
import { TechItem, TechItemWithPosition, RadarVisualizationConfig } from '@/lib/types/radar.types';
import { DEFAULT_QUADRANTS, DEFAULT_RINGS } from '@/lib/constants/defaults';

export default function DemoPage() {
  // Mock tech items
  const mockItems: TechItem[] = [
    // Quadrant 0 (Tools) - Top Right
    { id: '1', radarId: 'demo', name: 'React', quadrant: 0, ring: 0, description: 'UI Library', url: 'https://react.dev', category: 'Frontend', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', radarId: 'demo', name: 'Next.js', quadrant: 0, ring: 0, description: 'React Framework', url: 'https://nextjs.org', category: 'Frontend', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', radarId: 'demo', name: 'Vite', quadrant: 0, ring: 1, description: 'Build Tool', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', radarId: 'demo', name: 'Webpack', quadrant: 0, ring: 3, description: 'Module Bundler', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },

    // Quadrant 1 (Techniques) - Top Left
    { id: '5', radarId: 'demo', name: 'TDD', quadrant: 1, ring: 0, description: 'Test-Driven Development', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', radarId: 'demo', name: 'Microservices', quadrant: 1, ring: 1, description: 'Architecture Pattern', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', radarId: 'demo', name: 'Event Sourcing', quadrant: 1, ring: 2, description: 'Data Pattern', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '8', radarId: 'demo', name: 'CQRS', quadrant: 1, ring: 2, description: 'Architecture Pattern', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },

    // Quadrant 2 (Platforms) - Bottom Left
    { id: '9', radarId: 'demo', name: 'AWS', quadrant: 2, ring: 0, description: 'Cloud Platform', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '10', radarId: 'demo', name: 'Vercel', quadrant: 2, ring: 0, description: 'Deployment Platform', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '11', radarId: 'demo', name: 'Docker', quadrant: 2, ring: 0, description: 'Containerization', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '12', radarId: 'demo', name: 'Kubernetes', quadrant: 2, ring: 1, description: 'Container Orchestration', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },

    // Quadrant 3 (Languages & Frameworks) - Bottom Right
    { id: '13', radarId: 'demo', name: 'TypeScript', quadrant: 3, ring: 0, description: 'Typed JavaScript', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '14', radarId: 'demo', name: 'Python', quadrant: 3, ring: 0, description: 'Programming Language', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '15', radarId: 'demo', name: 'Go', quadrant: 3, ring: 1, description: 'Programming Language', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '16', radarId: 'demo', name: 'Rust', quadrant: 3, ring: 2, description: 'Systems Programming', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '17', radarId: 'demo', name: 'PHP', quadrant: 3, ring: 3, description: 'Server Language', url: null, category: null, createdAt: new Date(), updatedAt: new Date() },
  ];

  // Calculate positions for blips
  const positioningConfig = getDefaultPositioningConfig(800, 800);
  const itemsWithPositions: TechItemWithPosition[] = useMemo(
    () => calculateAllBlipPositions(mockItems, positioningConfig),
    []
  );

  // Radar visualization config
  const radarConfig: RadarVisualizationConfig = {
    width: 800,
    height: 800,
    centerX: 400,
    centerY: 400,
    maxRadius: 360,
    quadrants: DEFAULT_QUADRANTS.map((name, index) => ({
      index,
      name,
      startAngle: index * 90,
      endAngle: (index + 1) * 90,
    })),
    rings: DEFAULT_RINGS.map((name, index) => ({
      index,
      name,
      innerRadius: index * 25,
      outerRadius: (index + 1) * 25,
    })),
  };

  const handleBlipClick = (item: TechItemWithPosition) => {
    alert(`Clicked: ${item.name}\nQuadrant: ${radarConfig.quadrants[item.quadrant].name}\nRing: ${radarConfig.rings[item.ring].name}`);
  };

  // Top navigation component
  const topNav = (
    <div style={{
      padding: '16px 24px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Demo Tech Radar</h1>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>
        {itemsWithPositions.length} items
      </div>
    </div>
  );

  // Side panel component
  const sidePanel = (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: 0, marginBottom: '16px' }}>
        Tech Items
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {itemsWithPositions.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onClick={() => handleBlipClick(item)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {radarConfig.quadrants[item.quadrant].name} • {radarConfig.rings[item.ring].name}
            </div>
          </div>
        ))}
      </div>
    </div>
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
