'use client';

import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  topNav?: React.ReactNode;
  sidePanel?: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, topNav, sidePanel, className }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close side panel when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidePanelOpen(false);
    }
  }, [isMobile]);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <ErrorBoundary>
      <div className={`${styles.appLayout} ${className || ''}`}>
        {/* Top Navigation */}
        {topNav && (
          <header className={styles.topNav} role="banner">
            {topNav}
          </header>
        )}

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Radar Canvas (Main Area) */}
          <main className={styles.radarArea} role="main">
            {children}
          </main>

          {/* Side Panel - Desktop (always visible) */}
          {!isMobile && sidePanel && (
            <aside
              className={styles.sidePanel}
              role="complementary"
              aria-label="Tech items panel"
            >
              {sidePanel}
            </aside>
          )}

          {/* Mobile Drawer Toggle Button */}
          {isMobile && sidePanel && (
            <button
              className={styles.mobileToggle}
              onClick={toggleSidePanel}
              aria-label={isSidePanelOpen ? 'Close items panel' : 'Open items panel'}
              aria-expanded={isSidePanelOpen}
            >
              {isSidePanelOpen ? '✕' : '☰'}
            </button>
          )}

          {/* Side Panel - Mobile (drawer) */}
          {isMobile && sidePanel && (
            <>
              {/* Overlay */}
              {isSidePanelOpen && (
                <div
                  className={styles.overlay}
                  onClick={toggleSidePanel}
                  aria-hidden="true"
                />
              )}

              {/* Drawer */}
              <aside
                className={`${styles.drawer} ${isSidePanelOpen ? styles.drawerOpen : ''}`}
                role="complementary"
                aria-label="Tech items panel"
                aria-hidden={!isSidePanelOpen}
              >
                {sidePanel}
              </aside>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AppLayout;
