'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import styles from './page.module.css';

export default function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get error from URL params (NextAuth error callback)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'OAuthSignin':
          setError('Error constructing an authorization URL');
          break;
        case 'OAuthCallback':
          setError('Error in handling the response from the OAuth provider');
          break;
        case 'OAuthCreateAccount':
          setError('Could not create OAuth provider user in the database');
          break;
        case 'EmailCreateAccount':
          setError('Could not create email provider user in the database');
          break;
        case 'Callback':
          setError('Error in the OAuth callback handler route');
          break;
        case 'OAuthAccountNotLinked':
          setError('Email already associated with another account');
          break;
        case 'EmailSignin':
          setError('Check your email address');
          break;
        case 'CredentialsSignin':
          setError('Sign in failed. Check the details you provided are correct');
          break;
        case 'SessionRequired':
          setError('Please sign in to access this page');
          break;
        default:
          setError('An error occurred during sign in');
      }
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
    }
  }, [status, session, router, searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: searchParams.get('callbackUrl') || '/dashboard',
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        setEmailSent(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn('google', {
        callbackUrl: searchParams.get('callbackUrl') || '/dashboard',
      });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} aria-label="Loading" />
        <p>Loading...</p>
      </div>
    );
  }

  // Don't show login form if already authenticated (will redirect)
  if (status === 'authenticated') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} aria-label="Loading" />
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      {/* Logo/Title */}
      <div className={styles.header}>
        <h1>Technology Radar</h1>
        <p>Sign in to create and manage your technology radars</p>
      </div>

      {/* Email Sent Success State */}
      {emailSent ? (
        <div className={styles.successCard}>
          <Mail size={48} className={styles.successIcon} aria-hidden="true" />
          <h2>Check your email</h2>
          <p>
            We&apos;ve sent a magic link to <strong>{email}</strong>
          </p>
          <p className={styles.successHint}>
            Click the link in the email to sign in. You can close this page.
          </p>
          <Button
            onClick={() => {
              setEmailSent(false);
              setEmail('');
            }}
            variant="secondary"
          >
            Try a different email
          </Button>
        </div>
      ) : (
        <>
          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage} role="alert">
              <AlertCircle size={20} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className={styles.loginCard}>
            {/* Email Sign In */}
            <form onSubmit={handleEmailSignIn} className={styles.emailForm}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={styles.input}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                leftIcon={<Mail size={20} />}
              >
                {isLoading ? 'Sending...' : 'Sign in with Email'}
              </Button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              variant="secondary"
              fullWidth
              disabled={isLoading}
              leftIcon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>
          </div>

          {/* Guest Access Info */}
          <div className={styles.guestInfo}>
            <p>
              Don&apos;t need an account?{' '}
              <a href="/" className={styles.link}>
                View public radars
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
