'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Share2, Download, Settings, User, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/Button';
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

        {/* Center: My Radars Link */}
        {showAuthControls && session && (
          <div className={styles.centerSection}>
            <Link href="/dashboard" className={styles.dashboardLink}>
              <LayoutGrid className={styles.buttonIcon} size={18} aria-hidden="true" />
              <span>My Radars</span>
            </Link>
          </div>
        )}

        {/* Right: Action Buttons & User */}
        <div className={styles.rightSection}>
          {/* Share Button */}
          {onShare && (
            <Button
              onClick={onShare}
              variant="ghost"
              size="sm"
              leftIcon={<Share2 size={18} />}
              aria-label="Share radar"
              title="Share radar"
              className={styles.navButton}
            >
              <span className={styles.buttonText}>Share</span>
            </Button>
          )}

          {/* Export Button */}
          {onExport && (
            <Button
              onClick={onExport}
              variant="ghost"
              size="sm"
              leftIcon={<Download size={18} />}
              aria-label="Export radar"
              title="Export radar"
              className={styles.navButton}
            >
              <span className={styles.buttonText}>Export</span>
            </Button>
          )}

          {/* Customize Button */}
          {onCustomize && (
            <Button
              onClick={onCustomize}
              variant="ghost"
              size="sm"
              leftIcon={<Settings size={18} />}
              aria-label="Customize radar"
              title="Customize radar"
              className={styles.navButton}
            >
              <span className={styles.buttonText}>Settings</span>
            </Button>
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
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                aria-label="Sign out"
                title="Sign out"
                className={styles.signOutButton}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
