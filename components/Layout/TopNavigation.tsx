'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Share2, Settings, User, LayoutGrid, LogIn, Pencil } from 'lucide-react';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field/Field';
import styles from './TopNavigation.module.css';

interface TopNavigationProps {
  radarName?: string;
  onShare?: () => void;
  onCustomize?: () => void;
  onUpdateName?: (name: string) => Promise<void>;
  onOpenRadarSwitcher?: () => void;
  showAuthControls?: boolean;
  isOwner?: boolean;
  className?: string;
}

export function TopNavigation({
  radarName = 'Tech Radar',
  onShare,
  onCustomize,
  onUpdateName,
  onOpenRadarSwitcher,
  showAuthControls = true,
  isOwner = false,
  className,
}: TopNavigationProps) {
  const { data: session } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(radarName);
  const [isSavingName, setIsSavingName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update editedName when radarName prop changes
  useEffect(() => {
    setEditedName(radarName);
  }, [radarName]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleStartEditing = () => {
    if (!isOwner || !onUpdateName) return;
    setIsEditingName(true);
    setEditedName(radarName);
    // Focus input after render
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleCancelEditing = () => {
    setIsEditingName(false);
    setEditedName(radarName);
  };

  const handleSaveName = async () => {
    if (!onUpdateName) return;

    const trimmedName = editedName.trim();

    // Validate name
    if (!trimmedName) {
      setEditedName(radarName);
      setIsEditingName(false);
      return;
    }

    // If no change, just exit edit mode
    if (trimmedName === radarName) {
      setIsEditingName(false);
      return;
    }

    try {
      setIsSavingName(true);
      await onUpdateName(trimmedName);
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update radar name:', error);
      // Revert to original name on error
      setEditedName(radarName);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEditing();
    }
  };

  return (
    <nav className={`${styles.topNav} ${className || ''}`} role="navigation" aria-label="Main navigation">
      <div className={styles.navContent}>
        {/* Left: Radar Name */}
        <div className={styles.leftSection}>
          {isEditingName ? (
            <div className={styles.radarNameEditContainer}>
              <Field
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveName}
                disabled={isSavingName}
                className={styles.radarNameInput}
                maxLength={100}
                aria-label="Edit radar name"
              />
            </div>
          ) : (
            <div
              className={`${styles.radarNameContainer} ${isOwner && onUpdateName ? styles.editable : ''}`}
              onClick={handleStartEditing}
              role={isOwner && onUpdateName ? 'button' : undefined}
              tabIndex={isOwner && onUpdateName ? 0 : undefined}
              onKeyDown={(e) => {
                if (isOwner && onUpdateName && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleStartEditing();
                }
              }}
              aria-label={isOwner && onUpdateName ? 'Click to edit radar name' : undefined}
            >
              <h1 className={styles.radarName}>{radarName}</h1>
              {isOwner && onUpdateName && (
                <Pencil size={16} className={styles.editIcon} aria-hidden="true" />
              )}
            </div>
          )}
        </div>

        {/* Center: My Radars Button */}
        {showAuthControls && session && onOpenRadarSwitcher && (
          <div className={styles.centerSection}>
            <Button
              onClick={onOpenRadarSwitcher}
              variant="ghost"
              size="sm"
              leftIcon={<LayoutGrid size={18} />}
              aria-label="Open radars switcher"
              className={styles.radarSwitcherButton}
            >
              <span className={styles.buttonText}>My Radars</span>
            </Button>
          </div>
        )}

        {/* Right: Action Buttons & User */}
        <div className={styles.rightSection}>
          {/* Share Button - Owner Only */}
          {isOwner && onShare && (
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

          {/* Settings Button - Owner Only */}
          {isOwner && onCustomize && (
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

          {/* Login Button - Guest Users Only */}
          {showAuthControls && !session && (
            <Button
              onClick={() => window.location.href = '/api/auth/signin'}
              variant="primary"
              size="sm"
              leftIcon={<LogIn size={18} />}
              aria-label="Log in"
              title="Log in to save your work"
              className={styles.navButton}
            >
              <span className={styles.buttonText}>Log In</span>
            </Button>
          )}

          {/* User Account Indicator - Authenticated Users */}
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
