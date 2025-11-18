import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowRight } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createExampleRadar, getMostRecentRadar } from '@/lib/utils/createExampleRadar';
import styles from './page.module.css';
import buttonStyles from '@/components/Button/Button.module.css';

export default async function LandingPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        _count: {
          select: { radars: true },
        },
      },
    });

    if (user) {
      const radarCount = user._count.radars;

      if (radarCount === 0) {
        // Scenario 1: First-time user - create example radar and redirect to view
        const exampleRadar = await createExampleRadar(user.id);
        redirect(`/radar/${exampleRadar.shareToken}`);
      } else if (radarCount === 1) {
        // Scenario 2: User with exactly 1 radar - redirect to that radar
        const radar = await prisma.radar.findFirst({
          where: { ownerId: user.id },
          select: { shareToken: true },
        });
        if (radar) {
          redirect(`/radar/${radar.shareToken}`);
        }
      } else {
        // Scenario 3: User with multiple radars - redirect to most recently edited
        const mostRecentRadar = await getMostRecentRadar(user.id);
        if (mostRecentRadar) {
          redirect(`/radar/${mostRecentRadar.shareToken}`);
        }
      }
    }
  }

  // Not authenticated - show landing page
  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Visualize Your Technology Landscape
          </h1>
          <p className={styles.heroSubtitle}>
            Create interactive technology radars to track and communicate your organization's
            technology adoption strategy. Make informed decisions about tools, techniques,
            platforms, and languages.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              href="/login"
              className={`${buttonStyles.button} ${buttonStyles['button-primary']} ${buttonStyles['button-lg']} ${styles.heroButton}`}
            >
              <span className={buttonStyles.content}>
                <span className={buttonStyles.text}>Create Your Radar</span>
                <span className={buttonStyles.icon}>
                  <ArrowRight size={20} aria-hidden="true" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Radar Preview Section */}
      <section className={styles.radarSection}>
        <div className={styles.radarPreview}>
          <Image
            src="/images/radar-screenshot.png"
            alt="Technology Radar Example"
            width={1200}
            height={800}
            className={styles.radarImage}
            priority
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Technology Radar
        </p>
      </footer>
    </div>
  );
}
