'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Share2, Settings, User, LayoutGrid, LogIn, Pencil, MoreVertical, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field/Field';
import { Logo } from '@/components/Logo/Logo';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Update editedName when radarName prop changes
  useEffect(() => {
    setEditedName(radarName);
  }, [radarName]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  const handleMobileMenuAction = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
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
        {/* Left: Logo & Radar Name */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logoLink}>
            <Logo size="sm" />
          </Link>
          <div className={styles.divider} />
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

        {/* Right: Action Buttons & User */}
        <div className={styles.rightSection}>
          {/* Mobile Menu Button */}
          <div className={styles.mobileMenuContainer} ref={mobileMenuRef}>
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className={styles.mobileMenuDropdown}>
                {/* My Radars */}
                {showAuthControls && session && onOpenRadarSwitcher && (
                  <button
                    className={styles.mobileMenuItem}
                    onClick={() => handleMobileMenuAction(onOpenRadarSwitcher)}
                  >
                    <LayoutGrid size={20} />
                    <span>My Radars</span>
                  </button>
                )}

                {/* Share */}
                {isOwner && onShare && (
                  <button
                    className={styles.mobileMenuItem}
                    onClick={() => handleMobileMenuAction(onShare)}
                  >
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                )}

                {/* Settings */}
                {isOwner && onCustomize && (
                  <button
                    className={styles.mobileMenuItem}
                    onClick={() => handleMobileMenuAction(onCustomize)}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                )}

                {/* Divider if authenticated */}
                {showAuthControls && (session || !session) && (
                  <div className={styles.mobileMenuDivider} />
                )}

                {/* User Info & Sign Out */}
                {showAuthControls && session && (
                  <>
                    <div className={styles.mobileMenuUser}>
                      <User size={20} />
                      <div className={styles.mobileMenuUserInfo}>
                        <span className={styles.mobileMenuUserName}>
                          {session.user?.name || session.user?.email}
                        </span>
                        <span className={styles.mobileMenuUserEmail}>
                          {session.user?.email}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`${styles.mobileMenuItem} ${styles.signOutItem}`}
                      onClick={handleSignOut}
                    >
                      <span>Sign Out</span>
                    </button>
                  </>
                )}

                {/* Log In for guests */}
                {showAuthControls && !session && (
                  <button
                    className={styles.mobileMenuItem}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.location.href = '/api/auth/signin';
                    }}
                  >
                    <LogIn size={20} />
                    <span>Log In</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Items */}
          <div className={styles.desktopNav}>
          {/* My Radars Button */}
          {showAuthControls && session && onOpenRadarSwitcher && (
            <Button
              onClick={onOpenRadarSwitcher}
              variant="ghost"
              size="sm"
              leftIcon={<LayoutGrid size={18} />}
              aria-label="Open radars switcher"
              className={styles.navButton}
            >
              <span className={styles.buttonText}>My Radars</span>
            </Button>
          )}

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
      </div>
    </nav>
  );
}

export default TopNavigation;
