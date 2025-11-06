/**
 * Tech Library - Curated list of popular technologies with icons
 * Icons use simple-icons slugs: https://simpleicons.org/
 */

export interface TechLibraryItem {
  id: string;
  name: string;
  icon: string; // simple-icons slug
  description: string;
  suggestedQuadrant: number; // 0-3
  suggestedRing: number; // 0-3
  categories: string[];
  url?: string;
}

export const TECH_LIBRARY: TechLibraryItem[] = [
  // Languages & Frameworks - Frontend
  {
    id: 'react',
    name: 'React',
    icon: 'react',
    description: 'JavaScript library for building user interfaces',
    suggestedQuadrant: 0, // Tools
    suggestedRing: 0, // Adopt
    categories: ['Frontend', 'Framework'],
    url: 'https://react.dev'
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: 'vuedotjs',
    description: 'Progressive JavaScript framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'Framework'],
    url: 'https://vuejs.org'
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'angular',
    description: 'Platform for building web applications',
    suggestedQuadrant: 0,
    suggestedRing: 1, // Trial
    categories: ['Frontend', 'Framework'],
    url: 'https://angular.io'
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: 'svelte',
    description: 'Cybernetically enhanced web apps',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Frontend', 'Framework'],
    url: 'https://svelte.dev'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'nextdotjs',
    description: 'React framework for production',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'Framework'],
    url: 'https://nextjs.org'
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    icon: 'nuxtdotjs',
    description: 'Vue.js framework for server-side rendering',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Frontend', 'Framework'],
    url: 'https://nuxt.com'
  },
  {
    id: 'remix',
    name: 'Remix',
    icon: 'remix',
    description: 'Full stack web framework',
    suggestedQuadrant: 0,
    suggestedRing: 2, // Assess
    categories: ['Frontend', 'Framework'],
    url: 'https://remix.run'
  },

  // Languages
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'typescript',
    description: 'Typed superset of JavaScript',
    suggestedQuadrant: 3, // Languages
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://www.typescriptlang.org'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'javascript',
    description: 'Programming language of the web',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'python',
    description: 'High-level programming language',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://www.python.org'
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: 'rust',
    description: 'Systems programming language',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Language'],
    url: 'https://www.rust-lang.org'
  },
  {
    id: 'go',
    name: 'Go',
    icon: 'go',
    description: 'Programming language by Google',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://go.dev'
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'openjdk',
    description: 'Object-oriented programming language',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://www.java.com'
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: 'kotlin',
    description: 'Modern programming language for JVM',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Language'],
    url: 'https://kotlinlang.org'
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: 'swift',
    description: 'Apple programming language',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language', 'Mobile'],
    url: 'https://swift.org'
  },

  // Backend Frameworks
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: 'nodedotjs',
    description: 'JavaScript runtime built on Chrome V8',
    suggestedQuadrant: 2, // Platforms
    suggestedRing: 0,
    categories: ['Backend', 'Runtime'],
    url: 'https://nodejs.org'
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: 'express',
    description: 'Fast, unopinionated web framework for Node.js',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://expressjs.com'
  },
  {
    id: 'fastify',
    name: 'Fastify',
    icon: 'fastify',
    description: 'Fast and low overhead web framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://fastify.dev'
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: 'nestjs',
    description: 'Progressive Node.js framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://nestjs.com'
  },
  {
    id: 'django',
    name: 'Django',
    icon: 'django',
    description: 'High-level Python web framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://www.djangoproject.com'
  },
  {
    id: 'flask',
    name: 'Flask',
    icon: 'flask',
    description: 'Micro web framework for Python',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://flask.palletsprojects.com'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    icon: 'fastapi',
    description: 'Modern Python web framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://fastapi.tiangolo.com'
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    icon: 'springboot',
    description: 'Java-based framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://spring.io/projects/spring-boot'
  },
  {
    id: 'laravel',
    name: 'Laravel',
    icon: 'laravel',
    description: 'PHP web application framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://laravel.com'
  },
  {
    id: 'rails',
    name: 'Ruby on Rails',
    icon: 'rubyonrails',
    description: 'Server-side web application framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://rubyonrails.org'
  },

  // Databases
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: 'postgresql',
    description: 'Advanced open source relational database',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.postgresql.org'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: 'mysql',
    description: 'Open source relational database',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.mysql.com'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: 'mongodb',
    description: 'Document-oriented NoSQL database',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.mongodb.com'
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: 'redis',
    description: 'In-memory data structure store',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://redis.io'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    icon: 'sqlite',
    description: 'Self-contained SQL database engine',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.sqlite.org'
  },

  // Cloud & DevOps
  {
    id: 'docker',
    name: 'Docker',
    icon: 'docker',
    description: 'Platform for containerized applications',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['DevOps', 'Infrastructure'],
    url: 'https://www.docker.com'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: 'kubernetes',
    description: 'Container orchestration platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['DevOps', 'Infrastructure'],
    url: 'https://kubernetes.io'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    icon: 'amazonwebservices',
    description: 'Cloud computing platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Infrastructure'],
    url: 'https://aws.amazon.com'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: 'googlecloud',
    description: 'Cloud computing services',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Infrastructure'],
    url: 'https://cloud.google.com'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    icon: 'microsoftazure',
    description: 'Cloud computing platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Infrastructure'],
    url: 'https://azure.microsoft.com'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: 'vercel',
    description: 'Platform for frontend frameworks',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Deployment'],
    url: 'https://vercel.com'
  },
  {
    id: 'netlify',
    name: 'Netlify',
    icon: 'netlify',
    description: 'Platform for web development',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Deployment'],
    url: 'https://www.netlify.com'
  },

  // Testing
  {
    id: 'jest',
    name: 'Jest',
    icon: 'jest',
    description: 'JavaScript testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Testing', 'Tools'],
    url: 'https://jestjs.io'
  },
  {
    id: 'vitest',
    name: 'Vitest',
    icon: 'vitest',
    description: 'Blazing fast unit test framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Testing', 'Tools'],
    url: 'https://vitest.dev'
  },
  {
    id: 'playwright',
    name: 'Playwright',
    icon: 'playwright',
    description: 'End-to-end testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Testing', 'Tools'],
    url: 'https://playwright.dev'
  },
  {
    id: 'cypress',
    name: 'Cypress',
    icon: 'cypress',
    description: 'End-to-end testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Testing', 'Tools'],
    url: 'https://www.cypress.io'
  },
  {
    id: 'pytest',
    name: 'pytest',
    icon: 'pytest',
    description: 'Python testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Testing', 'Tools'],
    url: 'https://pytest.org'
  },

  // Build Tools & Package Managers
  {
    id: 'vite',
    name: 'Vite',
    icon: 'vite',
    description: 'Next generation frontend tooling',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Build Tool', 'Tools'],
    url: 'https://vitejs.dev'
  },
  {
    id: 'webpack',
    name: 'webpack',
    icon: 'webpack',
    description: 'JavaScript module bundler',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Build Tool', 'Tools'],
    url: 'https://webpack.js.org'
  },
  {
    id: 'esbuild',
    name: 'esbuild',
    icon: 'esbuild',
    description: 'Extremely fast JavaScript bundler',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Build Tool', 'Tools'],
    url: 'https://esbuild.github.io'
  },
  {
    id: 'npm',
    name: 'npm',
    icon: 'npm',
    description: 'Package manager for JavaScript',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Package Manager', 'Tools'],
    url: 'https://www.npmjs.com'
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    icon: 'pnpm',
    description: 'Fast, disk space efficient package manager',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Package Manager', 'Tools'],
    url: 'https://pnpm.io'
  },
  {
    id: 'yarn',
    name: 'Yarn',
    icon: 'yarn',
    description: 'Fast, reliable JavaScript package manager',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Package Manager', 'Tools'],
    url: 'https://yarnpkg.com'
  },

  // CSS & Styling
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    icon: 'tailwindcss',
    description: 'Utility-first CSS framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'CSS'],
    url: 'https://tailwindcss.com'
  },
  {
    id: 'sass',
    name: 'Sass',
    icon: 'sass',
    description: 'CSS preprocessor',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'CSS'],
    url: 'https://sass-lang.com'
  },
  {
    id: 'styled-components',
    name: 'styled-components',
    icon: 'styledcomponents',
    description: 'CSS-in-JS library',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Frontend', 'CSS'],
    url: 'https://styled-components.com'
  },

  // State Management
  {
    id: 'redux',
    name: 'Redux',
    icon: 'redux',
    description: 'Predictable state container',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'State Management'],
    url: 'https://redux.js.org'
  },
  {
    id: 'zustand',
    name: 'Zustand',
    icon: 'zustand',
    description: 'Small, fast state-management solution',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Frontend', 'State Management'],
    url: 'https://github.com/pmndrs/zustand'
  },

  // GraphQL & APIs
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: 'graphql',
    description: 'Query language for APIs',
    suggestedQuadrant: 1, // Techniques
    suggestedRing: 0,
    categories: ['API', 'Backend'],
    url: 'https://graphql.org'
  },
  {
    id: 'apollo',
    name: 'Apollo GraphQL',
    icon: 'apollographql',
    description: 'GraphQL implementation',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['API', 'Backend'],
    url: 'https://www.apollographql.com'
  },
  {
    id: 'rest',
    name: 'REST API',
    icon: 'fastapi',
    description: 'RESTful web services',
    suggestedQuadrant: 1,
    suggestedRing: 0,
    categories: ['API', 'Backend']
  },
  {
    id: 'grpc',
    name: 'gRPC',
    icon: 'grpc',
    description: 'High performance RPC framework',
    suggestedQuadrant: 1,
    suggestedRing: 1,
    categories: ['API', 'Backend'],
    url: 'https://grpc.io'
  },

  // Mobile
  {
    id: 'react-native',
    name: 'React Native',
    icon: 'react',
    description: 'Framework for building native apps',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Mobile', 'Framework'],
    url: 'https://reactnative.dev'
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: 'flutter',
    description: 'UI toolkit for mobile, web, and desktop',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Mobile', 'Framework'],
    url: 'https://flutter.dev'
  },

  // Version Control
  {
    id: 'git',
    name: 'Git',
    icon: 'git',
    description: 'Distributed version control system',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Tools', 'DevOps'],
    url: 'https://git-scm.com'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    description: 'Development platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Platform', 'DevOps'],
    url: 'https://github.com'
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: 'gitlab',
    description: 'DevOps platform',
    suggestedQuadrant: 2,
    suggestedRing: 1,
    categories: ['Platform', 'DevOps'],
    url: 'https://gitlab.com'
  }
];

// Helper to search library
export function searchTechLibrary(query: string): TechLibraryItem[] {
  const lowerQuery = query.toLowerCase();
  return TECH_LIBRARY.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
}

// Helper to filter by category
export function filterByCategory(category: string): TechLibraryItem[] {
  return TECH_LIBRARY.filter(item =>
    item.categories.includes(category)
  );
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  TECH_LIBRARY.forEach(item => {
    item.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
}
