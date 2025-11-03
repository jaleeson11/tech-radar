'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send error to logging service here
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className={styles.errorContainer} role="alert">
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>Something went wrong</h1>
            <p className={styles.errorMessage}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error Details (Development Only)</summary>
                <pre className={styles.errorStack}>
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className={styles.errorActions}>
              <button
                onClick={this.handleReset}
                className={styles.resetButton}
                type="button"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className={styles.reloadButton}
                type="button"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
