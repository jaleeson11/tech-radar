'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Share2, Download, Settings, User } from 'lucide-react';
import styles from './TopNavigation.module.css';

interface TopNavigationProps {
  radarName?: string;
  onShare?: () => void;
  onExport?: () => void;
  onCustomize?: () => void;
  showAuthControls?: boolean;
  className?: string;
}

export function TopNavigation({
  radarName = 'Tech Radar',
  onShare,
  onExport,
  onCustomize,
  showAuthControls = true,
  className,
}: TopNavigationProps) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className={`${styles.topNav} ${className || ''}`} role="navigation" aria-label="Main navigation">
      <div className={styles.navContent}>
        {/* Left: Radar Name */}
        <div className={styles.leftSection}>
          <h1 className={styles.radarName}>{radarName}</h1>
        </div>

        {/* Right: Action Buttons & User */}
        <div className={styles.rightSection}>
          {/* Share Button */}
          {onShare && (
            <button
              onClick={onShare}
              className={styles.navButton}
              aria-label="Share radar"
              title="Share radar"
            >
              <Share2 className={styles.buttonIcon} size={18} aria-hidden="true" />
              <span className={styles.buttonText}>Share</span>
            </button>
          )}

          {/* Export Button */}
          {onExport && (
            <button
              onClick={onExport}
              className={styles.navButton}
              aria-label="Export radar"
              title="Export radar"
            >
              <Download className={styles.buttonIcon} size={18} aria-hidden="true" />
              <span className={styles.buttonText}>Export</span>
            </button>
          )}

          {/* Customize Button */}
          {onCustomize && (
            <button
              onClick={onCustomize}
              className={styles.navButton}
              aria-label="Customize radar"
              title="Customize radar"
            >
              <Settings className={styles.buttonIcon} size={18} aria-hidden="true" />
              <span className={styles.buttonText}>Settings</span>
            </button>
          )}

          {/* User Account Indicator */}
          {showAuthControls && session && (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <User className={styles.userIcon} size={18} aria-hidden="true" />
                <span className={styles.userName} title={session.user?.email || ''}>
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className={styles.signOutButton}
                aria-label="Sign out"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
