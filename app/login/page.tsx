'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';
import styles from './page.module.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} aria-label="Loading" />
            <p>Loading...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
