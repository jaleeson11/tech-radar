'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TechItemWithPosition, RadarVisualizationConfig } from '@/lib/types/radar.types';
import styles from './RadarCanvas.module.css';

interface RadarCanvasProps {
  items: TechItemWithPosition[];
  config: RadarVisualizationConfig;
  onBlipClick?: (item: TechItemWithPosition) => void;
  className?: string;
}

export function RadarCanvas({ items, config, onBlipClick, className }: RadarCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredItem, setHoveredItem] = useState<TechItemWithPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll('*').remove();

    const { width, height, centerX, centerY, maxRadius, quadrants, rings } = config;

    // Create main group
    const g = svg
      .append('g')
      .attr('class', 'radar-group');

    // Draw rings (concentric circles)
    rings.forEach((ring) => {
      const radius = (ring.outerRadius / 100) * maxRadius;

      g.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('class', `ring ring-${ring.index}`)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);
    });

    // Draw quadrant dividers
    // Vertical line
    g.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY - maxRadius)
      .attr('x2', centerX)
      .attr('y2', centerY + maxRadius)
      .attr('class', 'quadrant-divider')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    // Horizontal line
    g.append('line')
      .attr('x1', centerX - maxRadius)
      .attr('y1', centerY)
      .attr('x2', centerX + maxRadius)
      .attr('y2', centerY)
      .attr('class', 'quadrant-divider')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    // Add quadrant labels
    quadrants.forEach((quadrant) => {
      // Calculate label position (midpoint of quadrant arc at 70% radius)
      const labelRadius = maxRadius * 0.7;
      const midAngle = ((quadrant.startAngle + quadrant.endAngle) / 2) * (Math.PI / 180);
      const labelX = centerX + labelRadius * Math.cos(midAngle);
      const labelY = centerY + labelRadius * Math.sin(midAngle);

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('class', `quadrant-label quadrant-label-${quadrant.index}`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#333')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(quadrant.name);
    });

    // Add ring labels
    rings.forEach((ring, index) => {
      if (index === 0) return; // Skip innermost ring label to avoid crowding

      const radius = (ring.innerRadius / 100) * maxRadius + 10;

      g.append('text')
        .attr('x', centerX + 5)
        .attr('y', centerY - radius)
        .attr('class', `ring-label ring-label-${ring.index}`)
        .attr('fill', '#666')
        .attr('font-size', '12px')
        .text(ring.name);
    });

    // Draw blips
    const blips = g
      .selectAll('.blip')
      .data(items)
      .enter()
      .append('circle')
      .attr('class', (d) => `blip blip-quadrant-${d.quadrant} blip-ring-${d.ring}`)
      .attr('cx', (d) => d.position.x)
      .attr('cy', (d) => d.position.y)
      .attr('r', 6)
      .attr('fill', (d) => getBlipColor(d.quadrant))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr('aria-label', (d) => `${d.name} - ${quadrants[d.quadrant].name}, ${rings[d.ring].name}`);

    // Add hover interactions
    blips
      .on('mouseenter', function (event, d) {
        // Highlight blip
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('stroke-width', 3);

        // Update tooltip
        setHoveredItem(d);
        setTooltipPosition({ x: event.pageX, y: event.pageY });
      })
      .on('mousemove', function (event) {
        setTooltipPosition({ x: event.pageX, y: event.pageY });
      })
      .on('mouseleave', function () {
        // Reset blip
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6)
          .attr('stroke-width', 2);

        setHoveredItem(null);
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        onBlipClick?.(d);
      })
      .on('keydown', function (event, d) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onBlipClick?.(d);
        }
      });

    // Add zoom and pan behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3]) // Allow zoom from 0.5x to 3x
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [items, config, onBlipClick]);

  return (
    <div className={`${styles.radarContainer} ${className || ''}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className={styles.radarSvg}
        role="img"
        aria-label="Technology Radar visualization"
      >
        {/* D3.js will render content here */}
      </svg>

      {/* Tooltip */}
      {hoveredItem && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <div className={styles.tooltipName}>{hoveredItem.name}</div>
          <div className={styles.tooltipDetails}>
            {config.quadrants[hoveredItem.quadrant].name} • {config.rings[hoveredItem.ring].name}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get color for each quadrant
function getBlipColor(quadrant: number): string {
  const colors = [
    '#3b82f6', // Blue - Quadrant 0
    '#10b981', // Green - Quadrant 1
    '#f59e0b', // Orange - Quadrant 2
    '#ef4444', // Red - Quadrant 3
  ];
  return colors[quadrant] || '#6b7280';
}

export default RadarCanvas;
