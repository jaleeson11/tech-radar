'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { RadarLoader } from '@/components/RadarLoader/RadarLoader';
import styles from './page.module.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <RadarLoader size={80} />
            <p>Loading...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
