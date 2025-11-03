import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowRight, Target, Users, Share2, TrendingUp } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createExampleRadar, getMostRecentRadar } from '@/lib/utils/createExampleRadar';
import styles from './page.module.css';

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
            <Link href="/dashboard" className={styles.primaryCta}>
              Get Started
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <Link href="/demo" className={styles.secondaryCta}>
              View Demo
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.radarPreview}>
            <svg viewBox="0 0 400 400" className={styles.radarSvg}>
              {/* Background circles */}
              <circle cx="200" cy="200" r="180" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="135" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="90" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1" />

              {/* Quadrant lines */}
              <line x1="200" y1="20" x2="200" y2="380" stroke="#d1d5db" strokeWidth="1" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="#d1d5db" strokeWidth="1" />

              {/* Sample blips */}
              <circle cx="250" cy="80" r="6" fill="#3b82f6" opacity="0.8" />
              <circle cx="150" cy="120" r="6" fill="#3b82f6" opacity="0.8" />
              <circle cx="280" cy="160" r="6" fill="#10b981" opacity="0.8" />
              <circle cx="120" cy="240" r="6" fill="#8b5cf6" opacity="0.8" />
              <circle cx="320" cy="280" r="6" fill="#f59e0b" opacity="0.8" />
              <circle cx="100" cy="320" r="6" fill="#f59e0b" opacity="0.8" />
              <circle cx="260" cy="300" r="6" fill="#10b981" opacity="0.8" />
              <circle cx="180" cy="260" r="6" fill="#8b5cf6" opacity="0.8" />

              {/* Quadrant labels */}
              <text x="300" y="100" textAnchor="middle" className={styles.quadrantLabel}>Tools</text>
              <text x="100" y="100" textAnchor="middle" className={styles.quadrantLabel}>Techniques</text>
              <text x="100" y="310" textAnchor="middle" className={styles.quadrantLabel}>Platforms</text>
              <text x="300" y="310" textAnchor="middle" className={styles.quadrantLabel}>Languages</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Why Technology Radar?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Target size={32} aria-hidden="true" />
            </div>
            <h3>Strategic Clarity</h3>
            <p>
              Visualize your technology landscape across four quadrants: Tools, Techniques,
              Platforms, and Languages. See the big picture at a glance.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <TrendingUp size={32} aria-hidden="true" />
            </div>
            <h3>Adoption Tracking</h3>
            <p>
              Track technologies through four rings: Adopt, Trial, Assess, and Hold.
              Monitor adoption progress over time.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Users size={32} aria-hidden="true" />
            </div>
            <h3>Team Collaboration</h3>
            <p>
              Work together to assess technologies, share insights, and make collective
              decisions about your tech stack.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Share2 size={32} aria-hidden="true" />
            </div>
            <h3>Easy Sharing</h3>
            <p>
              Share your radar with stakeholders via public links. Export to PDF or PNG
              for presentations and documentation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Get Started?</h2>
          <p>Create your first technology radar in minutes.</p>
          <Link href="/dashboard" className={styles.ctaButton}>
            Create Your Radar
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Technology Radar. Built with Next.js.
        </p>
      </footer>
    </div>
  );
}
