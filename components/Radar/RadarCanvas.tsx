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
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<TechItemWithPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const zoomTransformRef = useRef<d3.ZoomTransform | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Store current zoom transform before clearing
    const currentTransform = zoomTransformRef.current;

    // Clear previous content
    svg.selectAll('*').remove();

    const { width, height, centerX, centerY, maxRadius, quadrants, rings } = config;

    // Create main group
    const g = svg
      .append('g')
      .attr('class', 'radar-group');

    // Only animate on first render (page load)
    const shouldAnimate = !hasAnimated;

    // Draw rings (concentric circles) with ripple animation
    rings.forEach((ring, index) => {
      const radius = (ring.outerRadius / 100) * maxRadius;
      const delay = shouldAnimate ? index * 150 : 0; // Stagger delay for ripple effect

      const circle = g.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', shouldAnimate ? 0 : radius) // Start from center or final size
        .attr('class', `ring ring-${ring.index}`)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('opacity', shouldAnimate ? 0 : 1);

      if (shouldAnimate) {
        circle
          .transition()
          .delay(delay)
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr('r', radius)
          .attr('opacity', 1);
      }
    });

    // Draw quadrant dividers with fade-in after rings
    const dividerDelay = shouldAnimate ? rings.length * 150 + 300 : 0; // After all rings

    // Vertical line
    const verticalLine = g.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY - maxRadius)
      .attr('x2', centerX)
      .attr('y2', centerY + maxRadius)
      .attr('class', 'quadrant-divider')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('opacity', shouldAnimate ? 0 : 1);

    if (shouldAnimate) {
      verticalLine
        .transition()
        .delay(dividerDelay)
        .duration(400)
        .attr('opacity', 1);
    }

    // Horizontal line
    const horizontalLine = g.append('line')
      .attr('x1', centerX - maxRadius)
      .attr('y1', centerY)
      .attr('x2', centerX + maxRadius)
      .attr('y2', centerY)
      .attr('class', 'quadrant-divider')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('opacity', shouldAnimate ? 0 : 1);

    if (shouldAnimate) {
      horizontalLine
        .transition()
        .delay(dividerDelay)
        .duration(400)
        .attr('opacity', 1);
    }

    // Add quadrant labels with fade-in
    const labelDelay = shouldAnimate ? dividerDelay + 200 : 0;

    quadrants.forEach((quadrant) => {
      // Calculate label position (midpoint of quadrant arc at 70% radius)
      const labelRadius = maxRadius * 0.7;
      const midAngle = ((quadrant.startAngle + quadrant.endAngle) / 2) * (Math.PI / 180);
      const labelX = centerX + labelRadius * Math.cos(midAngle);
      const labelY = centerY + labelRadius * Math.sin(midAngle);

      const label = g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('class', `quadrant-label quadrant-label-${quadrant.index}`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#333')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('opacity', shouldAnimate ? 0 : 1)
        .text(quadrant.name);

      if (shouldAnimate) {
        label
          .transition()
          .delay(labelDelay)
          .duration(400)
          .attr('opacity', 1);
      }
    });

    // Add ring labels with fade-in
    rings.forEach((ring, index) => {
      if (index === 0) return; // Skip innermost ring label to avoid crowding

      const radius = (ring.innerRadius / 100) * maxRadius + 10;

      const ringLabel = g.append('text')
        .attr('x', centerX + 5)
        .attr('y', centerY - radius)
        .attr('class', `ring-label ring-label-${ring.index}`)
        .attr('fill', '#666')
        .attr('font-size', '12px')
        .attr('opacity', shouldAnimate ? 0 : 1)
        .text(ring.name);

      if (shouldAnimate) {
        ringLabel
          .transition()
          .delay(labelDelay)
          .duration(400)
          .attr('opacity', 1);
      }
    });

    // Draw blips with staggered entrance animation
    const blipBaseDelay = shouldAnimate ? labelDelay + 400 : 0; // Start after labels

    const blips = g
      .selectAll('.blip')
      .data(items)
      .enter()
      .append('circle')
      .attr('class', (d) => `blip blip-quadrant-${d.quadrant} blip-ring-${d.ring}`)
      .attr('cx', (d) => d.position.x)
      .attr('cy', (d) => d.position.y)
      .attr('r', shouldAnimate ? 0 : 6) // Start from 0 or final size
      .attr('fill', (d) => getBlipColor(d.quadrant))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr('opacity', shouldAnimate ? 0 : 1)
      .attr('aria-label', (d) => `${d.name} - ${quadrants[d.quadrant].name}, ${rings[d.ring].name}`);

    // Apply entrance animation
    if (shouldAnimate) {
      blips
        .transition()
        .delay((d, i) => blipBaseDelay + i * 30) // Stagger by 30ms per blip
        .duration(400)
        .ease(d3.easeBackOut.overshoot(1.2)) // Slight bounce effect
        .attr('r', 6)
        .attr('opacity', 1);
    }

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
        // Save the transform so we can restore it if the component re-renders
        zoomTransformRef.current = event.transform;
      });

    svg.call(zoom);

    // Restore previous zoom transform if it exists
    if (currentTransform) {
      svg.call(zoom.transform as any, currentTransform);
    }

    // Mark as animated after first render with items
    // Only set hasAnimated if we actually have items to animate
    if (shouldAnimate && items.length > 0) {
      setHasAnimated(true);
    }

  }, [items, config]);

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
