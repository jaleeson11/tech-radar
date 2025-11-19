import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBlankRadar, getMostRecentRadar } from '@/lib/utils/createExampleRadar';
import { PublicRadarView } from '@/components/PublicRadar/PublicRadarView';

export default async function HomePage() {
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
        // Scenario 1: First-time user - create blank radar and redirect to view
        const blankRadar = await createBlankRadar(user.id);
        redirect(`/radar/${blankRadar.shareToken}`);
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

  // Not authenticated - show public example radar
  return <PublicRadarView />;
}
