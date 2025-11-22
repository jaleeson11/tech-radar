'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TechItemWithPosition, RadarVisualizationConfig } from '@/lib/types/radar.types';
import styles from './RadarCanvas.module.css';

interface RadarCanvasProps {
  items: TechItemWithPosition[];
  config: RadarVisualizationConfig;
  onBlipClick?: (item: TechItemWithPosition) => void;
  onBlipMove?: (item: TechItemWithPosition, newQuadrant: number, newRing: number, finalX: number, finalY: number) => void;
  className?: string;
}

export function RadarCanvas({ items, config, onBlipClick, onBlipMove, className }: RadarCanvasProps) {
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

    // Draw quadrant background shading with gradient (behind everything)
    // Opacity gradient: inner ring (0) is darkest, outer ring (3) is lightest
    const bgOpacityScale = [0.35, 0.23, 0.14, 0.08]; // Decreasing opacity from inner to outer

    quadrants.forEach((quadrant) => {
      // Convert angles to radians and rotate 90 degrees clockwise (add 90)
      const startAngleRad = (quadrant.startAngle + 90) * (Math.PI / 180);
      const endAngleRad = (quadrant.endAngle + 90) * (Math.PI / 180);

      // Draw a background section for each ring within this quadrant
      rings.forEach((ring) => {
        const innerRadius = (ring.innerRadius / 100) * maxRadius;
        const outerRadius = (ring.outerRadius / 100) * maxRadius;
        const bgOpacity = bgOpacityScale[ring.index] || 0.08;

        // Create arc path for this ring section
        const arcGenerator = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngleRad)
          .endAngle(endAngleRad);

        const quadrantRingBg = g.append('path')
          .attr('d', arcGenerator as any)
          .attr('transform', `translate(${centerX}, ${centerY})`)
          .attr('class', `quadrant-bg quadrant-bg-${quadrant.index} ring-bg-${ring.index}`)
          .attr('fill', getBlipColor(quadrant.index))
          .attr('fill-opacity', shouldAnimate ? 0 : bgOpacity)
          .attr('opacity', shouldAnimate ? 0 : 1);

        if (shouldAnimate) {
          quadrantRingBg
            .transition()
            .duration(600)
            .ease(d3.easeCubicOut)
            .attr('opacity', 1)
            .attr('fill-opacity', bgOpacity);
        }
      });
    });

    // Draw rings as colored arc segments matching quadrants with gradient effect
    [...rings].reverse().forEach((ring, reverseIndex) => {
      const index = rings.length - 1 - reverseIndex;
      const radius = (ring.outerRadius / 100) * maxRadius;
      const delay = shouldAnimate ? index * 150 : 0;

      // Calculate opacity gradient: inner ring (0) is darkest, outer ring (3) is lightest
      // Ring indices: 0 = Adopt (inner), 1 = Trial, 2 = Assess, 3 = Hold (outer)
      const opacityScale = [0.5, 0.38, 0.28, 0.18]; // Decreasing opacity from inner to outer
      const ringOpacity = opacityScale[ring.index] || 0.4;

      // Draw a ring segment for each quadrant
      quadrants.forEach((quadrant) => {
        const startAngleRad = (quadrant.startAngle + 90) * (Math.PI / 180);
        const endAngleRad = (quadrant.endAngle + 90) * (Math.PI / 180);

        const arcGenerator = d3.arc()
          .innerRadius(radius - 0.5) // Slight inner offset for stroke effect
          .outerRadius(radius + 0.5) // Slight outer offset for stroke effect
          .startAngle(startAngleRad)
          .endAngle(endAngleRad);

        const ringArc = g.append('path')
          .attr('d', arcGenerator as any)
          .attr('transform', `translate(${centerX}, ${centerY})`)
          .attr('class', `ring-arc ring-${ring.index} quadrant-${quadrant.index}`)
          .attr('fill', 'none')
          .attr('stroke', getBlipColor(quadrant.index))
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', shouldAnimate ? 0 : ringOpacity)
          .attr('opacity', shouldAnimate ? 0 : 1);

        if (shouldAnimate) {
          ringArc
            .transition()
            .delay(delay)
            .duration(600)
            .ease(d3.easeCubicOut)
            .attr('opacity', 1)
            .attr('stroke-opacity', ringOpacity);
        }
      });
    });

    // Add quadrant labels outside the radar with fade-in
    const labelDelay = shouldAnimate ? rings.length * 150 + 500 : 0;

    quadrants.forEach((quadrant) => {
      // Calculate label position outside the radar (at 130% of radius)
      const labelRadius = maxRadius * 1.3;
      const midAngle = ((quadrant.startAngle + quadrant.endAngle) / 2) * (Math.PI / 180);
      const labelX = centerX + labelRadius * Math.cos(midAngle);
      const labelY = centerY + labelRadius * Math.sin(midAngle);

      // Create a group for the label elements
      const labelGroup = g.append('g')
        .attr('class', `quadrant-label-group quadrant-label-group-${quadrant.index}`)
        .attr('opacity', shouldAnimate ? 0 : 1);

      // Add "QUADRANT #" heading
      labelGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY - 35)
        .attr('text-anchor', 'middle')
        .attr('fill', getBlipColor(quadrant.index))
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.5px')
        .text(`QUADRANT ${quadrant.index + 1}`);

      // Add divider line under heading
      labelGroup.append('line')
        .attr('x1', labelX - 40)
        .attr('y1', labelY - 23)
        .attr('x2', labelX + 40)
        .attr('y2', labelY - 23)
        .attr('stroke', getBlipColor(quadrant.index))
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.6);

      // Add quadrant name with text wrapping
      const nameText = labelGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold');

      // Split text by '&' or long words and wrap if needed
      const words = quadrant.name.split(/(\s+|&)/);
      const maxWidth = 150; // Max width before wrapping
      let line = '';
      let lineNumber = 0;
      const lineHeight = 20; // Line height in pixels

      // Create a temporary text element to measure width
      const tempText = g.append('text')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold')
        .style('visibility', 'hidden');

      words.forEach((word, i) => {
        const testLine = line + word;
        tempText.text(testLine);
        const testWidth = tempText.node()?.getBBox().width || 0;

        if (testWidth > maxWidth && line !== '') {
          // Add the current line
          nameText.append('tspan')
            .attr('x', labelX)
            .attr('dy', lineNumber === 0 ? 0 : lineHeight)
            .text(line.trim());
          line = word;
          lineNumber++;
        } else {
          line = testLine;
        }
      });

      // Add the last line
      if (line.trim()) {
        nameText.append('tspan')
          .attr('x', labelX)
          .attr('dy', lineNumber === 0 ? 0 : lineHeight)
          .text(line.trim());
      }

      // Remove temporary text
      tempText.remove();

      if (shouldAnimate) {
        labelGroup
          .transition()
          .delay(labelDelay)
          .duration(400)
          .attr('opacity', 1);
      }
    });

    // Add ring labels with fade-in (positioned horizontally on both sides)
    // Color gradient: darker for inner rings (more important) to lighter for outer rings
    const ringLabelColors = ['#334155', '#475569', '#64748b', '#94a3b8']; // Adopt (darkest) to Hold (lightest)

    rings.forEach((ring, index) => {
      // Calculate the midpoint radius between inner and outer for centering
      const midRadius = ((ring.innerRadius + ring.outerRadius) / 2 / 100) * maxRadius;
      const ringColor = ringLabelColors[ring.index] || '#64748b';

      // Right side label
      const ringLabelRight = g.append('text')
        .attr('x', centerX + midRadius)
        .attr('y', centerY - 5)
        .attr('class', `ring-label ring-label-${ring.index}`)
        .attr('fill', ringColor)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('text-anchor', 'middle')
        .attr('opacity', shouldAnimate ? 0 : 1)
        .text(ring.name.toUpperCase());

      // Left side label
      const ringLabelLeft = g.append('text')
        .attr('x', centerX - midRadius)
        .attr('y', centerY - 5)
        .attr('class', `ring-label ring-label-${ring.index}`)
        .attr('fill', ringColor)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('text-anchor', 'middle')
        .attr('opacity', shouldAnimate ? 0 : 1)
        .text(ring.name.toUpperCase());

      if (shouldAnimate) {
        ringLabelRight
          .transition()
          .delay(labelDelay)
          .duration(400)
          .attr('opacity', 1);

        ringLabelLeft
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
      });

    // Add drag behavior for moving blips between quadrants/rings
    if (onBlipMove) {
      let dragStartPos: { x: number; y: number } | null = null;
      let isDragging = false;
      const DRAG_THRESHOLD = 5; // pixels - minimum movement to be considered a drag

      const drag = d3.drag<SVGCircleElement, TechItemWithPosition>()
        .on('start', function (event, d) {
          // Store starting position
          dragStartPos = { x: event.x, y: event.y };
          isDragging = false;
        })
        .on('drag', function (event, d) {
          // Check if we've moved enough to be considered dragging
          if (!isDragging && dragStartPos) {
            const dx = event.x - dragStartPos.x;
            const dy = event.y - dragStartPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < DRAG_THRESHOLD) {
              // Not enough movement yet, don't start dragging
              return;
            }

            // Now we're actually dragging - show visual feedback
            isDragging = true;
            d3.select(this)
              .raise() // Bring to front
              .attr('r', 10)
              .attr('stroke-width', 3)
              .style('cursor', 'grabbing');

            // Hide tooltip during drag
            setHoveredItem(null);
          }

          if (!isDragging) return; // Don't move until threshold is reached
          // Get current transform for zoom/pan adjustment
          const transform = zoomTransformRef.current || d3.zoomIdentity;

          // Calculate position in the coordinate system of the group
          const [mouseX, mouseY] = d3.pointer(event, g.node());

          // Move the blip with mouse
          d3.select(this)
            .attr('cx', mouseX)
            .attr('cy', mouseY);
        })
        .on('end', function (event, d) {
          // If we never started dragging (just a click), don't do anything
          if (!isDragging) {
            dragStartPos = null;
            return;
          }

          const [mouseX, mouseY] = d3.pointer(event, g.node());

          // Calculate which quadrant and ring based on final position
          const dx = mouseX - centerX;
          const dy = mouseY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate angle in degrees (0-360), starting from east (right) going clockwise
          // This matches the coordinate system used in BlipPositioning.ts
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          // Determine quadrant (0-3)
          const newQuadrant = Math.floor(angle / 90);

          // Determine ring (0-3) based on distance from center
          let newRing = 0;
          const ringThresholds = rings.map(r => (r.outerRadius / 100) * maxRadius);
          for (let i = 0; i < ringThresholds.length; i++) {
            if (distance <= ringThresholds[i]) {
              newRing = i;
              break;
            }
          }

          // Clamp to valid values
          const clampedQuadrant = Math.max(0, Math.min(3, newQuadrant));
          const clampedRing = Math.max(0, Math.min(rings.length - 1, newRing));

          // Reset visual state
          d3.select(this)
            .attr('r', 6)
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');

          // Only trigger callback if position actually changed
          if (clampedQuadrant !== d.quadrant || clampedRing !== d.ring) {
            onBlipMove(d, clampedQuadrant, clampedRing, mouseX, mouseY);
          } else {
            // Reset position to original if no change
            d3.select(this)
              .transition()
              .duration(200)
              .attr('cx', d.position.x)
              .attr('cy', d.position.y);
          }

          // Reset drag state
          dragStartPos = null;
          isDragging = false;
        });

      blips.call(drag);
    }

    // Add zoom and pan behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 3]) // Allow zoom from 1x (default) to 3x, no zoom out beyond default
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

  }, [items, config, onBlipClick, onBlipMove]);

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
    '#dc2626', // Red - Quadrant 0 (bottom-left)
    '#14b8a6', // Teal - Quadrant 1 (top-left)
    '#3b82f6', // Blue - Quadrant 2 (top-right)
    '#f97316', // Orange - Quadrant 3 (bottom-right)
  ];
  return colors[quadrant] || '#6b7280';
}

export default RadarCanvas;
