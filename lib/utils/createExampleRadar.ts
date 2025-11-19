import { prisma } from '@/lib/prisma';
import { DEFAULT_QUADRANTS, DEFAULT_RINGS } from '@/lib/constants/defaults';

interface ExampleTechItem {
  name: string;
  quadrant: number;
  ring: number;
  description: string;
  url?: string;
  category?: string;
  icon?: string;
}

// Pre-populated tech items for the example radar
const EXAMPLE_TECH_ITEMS: ExampleTechItem[] = [
  // Tools Quadrant (0)
  {
    name: 'Docker',
    quadrant: 0,
    ring: 0, // Adopt
    description: 'Container platform that we use extensively for development and production deployments.',
    url: 'https://www.docker.com/',
    category: 'Containerization',
    icon: 'devicon:docker',
  },
  {
    name: 'Kubernetes',
    quadrant: 0,
    ring: 1, // Trial
    description: 'Container orchestration platform. We are evaluating for production workloads.',
    url: 'https://kubernetes.io/',
    category: 'Orchestration',
    icon: 'devicon:kubernetes',
  },
  {
    name: 'Terraform',
    quadrant: 0,
    ring: 2, // Assess
    description: 'Infrastructure as Code tool worth exploring for cloud resource management.',
    url: 'https://www.terraform.io/',
    category: 'Infrastructure',
    icon: 'devicon:terraform',
  },
  {
    name: 'Vagrant',
    quadrant: 0,
    ring: 3, // Hold
    description: 'VM management tool. Consider Docker instead for containerization needs.',
    url: 'https://www.vagrantup.com/',
    category: 'Virtualization',
    icon: 'devicon:vagrant',
  },

  // Techniques Quadrant (1)
  {
    name: 'Microservices',
    quadrant: 1,
    ring: 0, // Adopt
    description: 'Our standard architecture pattern for scalable, maintainable systems.',
    category: 'Architecture',
  },
  {
    name: 'Event Sourcing',
    quadrant: 1,
    ring: 1, // Trial
    description: 'Pattern for capturing state changes as events. Evaluating for audit-heavy features.',
    category: 'Architecture',
  },
  {
    name: 'CQRS',
    quadrant: 1,
    ring: 2, // Assess
    description: 'Command Query Responsibility Segregation. Worth exploring for complex domains.',
    category: 'Architecture',
  },
  {
    name: 'Waterfall',
    quadrant: 1,
    ring: 3, // Hold
    description: 'Traditional sequential development methodology. Prefer Agile approaches.',
    category: 'Process',
  },

  // Platforms Quadrant (2)
  {
    name: 'AWS',
    quadrant: 2,
    ring: 0, // Adopt
    description: 'Our primary cloud platform for hosting and infrastructure services.',
    url: 'https://aws.amazon.com/',
    category: 'Cloud',
    icon: 'devicon:amazonwebservices',
  },
  {
    name: 'Google Cloud',
    quadrant: 2,
    ring: 1, // Trial
    description: 'Evaluating for specific use cases like BigQuery and ML workloads.',
    url: 'https://cloud.google.com/',
    category: 'Cloud',
    icon: 'devicon:googlecloud',
  },
  {
    name: 'Azure',
    quadrant: 2,
    ring: 2, // Assess
    description: 'Worth exploring for enterprise integrations and hybrid cloud scenarios.',
    url: 'https://azure.microsoft.com/',
    category: 'Cloud',
    icon: 'devicon:azure',
  },
  {
    name: 'On-Premise',
    quadrant: 2,
    ring: 3, // Hold
    description: 'Legacy infrastructure. Migrating workloads to cloud platforms.',
    category: 'Infrastructure',
  },

  // Languages & Frameworks Quadrant (3)
  {
    name: 'React',
    quadrant: 3,
    ring: 0, // Adopt
    description: 'Our standard library for building user interfaces. Used across all projects.',
    url: 'https://react.dev/',
    category: 'Frontend',
    icon: 'devicon:react',
  },
  {
    name: 'Vue.js',
    quadrant: 3,
    ring: 1, // Trial
    description: 'Progressive framework worth considering for new projects requiring simplicity.',
    url: 'https://vuejs.org/',
    category: 'Frontend',
    icon: 'devicon:vuejs',
  },
  {
    name: 'Svelte',
    quadrant: 3,
    ring: 2, // Assess
    description: 'Compiler-based framework with excellent performance. Worth exploring.',
    url: 'https://svelte.dev/',
    category: 'Frontend',
    icon: 'devicon:svelte',
  },
  {
    name: 'Angular 1.x',
    quadrant: 3,
    ring: 3, // Hold
    description: 'Deprecated framework. Migrate to modern alternatives.',
    url: 'https://angularjs.org/',
    category: 'Frontend',
    icon: 'devicon:angularjs',
  },
];

/**
 * Creates a blank radar for new users
 * @param userId - The ID of the user to create the radar for
 * @returns The created blank radar
 */
export async function createBlankRadar(userId: string) {
  const radar = await prisma.radar.create({
    data: {
      name: 'My Tech Radar',
      ownerId: userId,
      quadrants: DEFAULT_QUADRANTS,
      rings: DEFAULT_RINGS,
    },
  });

  return radar;
}

/**
 * Creates a pre-populated example radar for new users
 * @param userId - The ID of the user to create the radar for
 * @returns The created radar with all tech items
 */
export async function createExampleRadar(userId: string) {
  // Create the radar
  const radar = await prisma.radar.create({
    data: {
      name: 'My First Tech Radar',
      ownerId: userId,
      quadrants: DEFAULT_QUADRANTS,
      rings: DEFAULT_RINGS,
      items: {
        create: EXAMPLE_TECH_ITEMS,
      },
    },
    include: {
      items: true,
    },
  });

  return radar;
}

/**
 * Gets example tech items for public radar display
 * @returns Array of example tech items
 */
export function getExampleTechItems() {
  return EXAMPLE_TECH_ITEMS;
}

/**
 * Gets the user's most recently edited radar
 * @param userId - The ID of the user
 * @returns The most recently edited radar or null
 */
export async function getMostRecentRadar(userId: string) {
  const radar = await prisma.radar.findFirst({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      items: true,
    },
  });

  return radar;
}
