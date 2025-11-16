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
    icon: 'devicon:react',
    description: 'JavaScript library for building user interfaces',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Frontend', 'Framework'],
    url: 'https://react.dev'
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: 'devicon:vuejs',
    description: 'Progressive JavaScript framework',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Frontend', 'Framework'],
    url: 'https://vuejs.org'
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'devicon:angular',
    description: 'Platform for building web applications',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Frontend', 'Framework'],
    url: 'https://angular.io'
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: 'devicon:svelte',
    description: 'Cybernetically enhanced web apps',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Frontend', 'Framework'],
    url: 'https://svelte.dev'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'devicon:nextjs',
    description: 'React framework for production',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Frontend', 'Framework'],
    url: 'https://nextjs.org'
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    icon: 'devicon:nuxtjs',
    description: 'Vue.js framework for server-side rendering',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Frontend', 'Framework'],
    url: 'https://nuxt.com'
  },
  {
    id: 'remix',
    name: 'Remix',
    icon: 'simple-icons:remix',
    description: 'Full stack web framework',
    suggestedQuadrant: 3,
    suggestedRing: 2,
    categories: ['Frontend', 'Framework'],
    url: 'https://remix.run'
  },

  // Languages
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'devicon:typescript',
    description: 'Typed superset of JavaScript',
    suggestedQuadrant: 3, // Languages
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://www.typescriptlang.org'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'devicon:javascript',
    description: 'Programming language of the web',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'devicon:python',
    description: 'High-level programming language',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://www.python.org'
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: 'devicon:rust',
    description: 'Systems programming language',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Language'],
    url: 'https://www.rust-lang.org'
  },
  {
    id: 'go',
    name: 'Go',
    icon: 'devicon:go',
    description: 'Programming language by Google',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://go.dev'
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'devicon:java',
    description: 'Object-oriented programming language',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Language'],
    url: 'https://www.java.com'
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: 'devicon:kotlin',
    description: 'Modern programming language for JVM',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Language'],
    url: 'https://kotlinlang.org'
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: 'devicon:swift',
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
    icon: 'devicon:nodejs',
    description: 'JavaScript runtime built on Chrome V8',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Backend', 'Runtime'],
    url: 'https://nodejs.org'
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: 'devicon:express',
    description: 'Fast, unopinionated web framework for Node.js',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://expressjs.com'
  },
  {
    id: 'fastify',
    name: 'Fastify',
    icon: 'devicon:fastify',
    description: 'Fast and low overhead web framework',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://fastify.dev'
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: 'devicon:nestjs',
    description: 'Progressive Node.js framework',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://nestjs.com'
  },
  {
    id: 'django',
    name: 'Django',
    icon: 'simple-icons:django',
    description: 'High-level Python web framework',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://www.djangoproject.com'
  },
  {
    id: 'flask',
    name: 'Flask',
    icon: 'devicon:flask',
    description: 'Micro web framework for Python',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://flask.palletsprojects.com'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    icon: 'devicon:fastapi',
    description: 'Modern Python web framework',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://fastapi.tiangolo.com'
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    icon: 'devicon:spring',
    description: 'Java-based framework',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://spring.io/projects/spring-boot'
  },
  {
    id: 'laravel',
    name: 'Laravel',
    icon: 'devicon:laravel',
    description: 'PHP web application framework',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Backend', 'Framework'],
    url: 'https://laravel.com'
  },
  {
    id: 'rails',
    name: 'Ruby on Rails',
    icon: 'simple-icons:rubyonrails',
    description: 'Server-side web application framework',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Backend', 'Framework'],
    url: 'https://rubyonrails.org'
  },

  // Databases
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: 'devicon:postgresql',
    description: 'Advanced open source relational database',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.postgresql.org'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: 'devicon:mysql',
    description: 'Open source relational database',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.mysql.com'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: 'devicon:mongodb',
    description: 'Document-oriented NoSQL database',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://www.mongodb.com'
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: 'devicon:redis',
    description: 'In-memory data structure store',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Backend'],
    url: 'https://redis.io'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    icon: 'devicon:sqlite',
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
    icon: 'devicon:docker',
    description: 'Platform for containerized applications',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['DevOps', 'Infrastructure'],
    url: 'https://www.docker.com'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: 'devicon:kubernetes',
    description: 'Container orchestration platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['DevOps', 'Infrastructure'],
    url: 'https://kubernetes.io'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    icon: 'devicon:amazonwebservices',
    description: 'Cloud computing platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Infrastructure'],
    url: 'https://aws.amazon.com'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: 'devicon:googlecloud',
    description: 'Cloud computing services',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Infrastructure'],
    url: 'https://cloud.google.com'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    icon: 'devicon:azure',
    description: 'Cloud computing platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Infrastructure'],
    url: 'https://azure.microsoft.com'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: 'devicon:vercel',
    description: 'Platform for frontend frameworks',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Cloud', 'Deployment'],
    url: 'https://vercel.com'
  },
  {
    id: 'netlify',
    name: 'Netlify',
    icon: 'devicon:netlify',
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
    icon: 'simple-icons:jest',
    description: 'JavaScript testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Testing', 'Tools'],
    url: 'https://jestjs.io'
  },
  {
    id: 'vitest',
    name: 'Vitest',
    icon: 'devicon:vitest',
    description: 'Blazing fast unit test framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Testing', 'Tools'],
    url: 'https://vitest.dev'
  },
  {
    id: 'playwright',
    name: 'Playwright',
    icon: 'logos:playwright',
    description: 'End-to-end testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Testing', 'Tools'],
    url: 'https://playwright.dev'
  },
  {
    id: 'cypress',
    name: 'Cypress',
    icon: 'simple-icons:cypress',
    description: 'End-to-end testing framework',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Testing', 'Tools'],
    url: 'https://www.cypress.io'
  },
  {
    id: 'pytest',
    name: 'pytest',
    icon: 'devicon:pytest',
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
    icon: 'devicon:vite',
    description: 'Next generation frontend tooling',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Build Tool', 'Tools'],
    url: 'https://vitejs.dev'
  },
  {
    id: 'webpack',
    name: 'webpack',
    icon: 'devicon:webpack',
    description: 'JavaScript module bundler',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Build Tool', 'Tools'],
    url: 'https://webpack.js.org'
  },
  {
    id: 'esbuild',
    name: 'esbuild',
    icon: 'simple-icons:esbuild',
    description: 'Extremely fast JavaScript bundler',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Build Tool', 'Tools'],
    url: 'https://esbuild.github.io'
  },
  {
    id: 'npm',
    name: 'npm',
    icon: 'devicon:npm',
    description: 'Package manager for JavaScript',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Package Manager', 'Tools'],
    url: 'https://www.npmjs.com'
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    icon: 'devicon:pnpm',
    description: 'Fast, disk space efficient package manager',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Package Manager', 'Tools'],
    url: 'https://pnpm.io'
  },
  {
    id: 'yarn',
    name: 'Yarn',
    icon: 'devicon:yarn',
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
    icon: 'devicon:tailwindcss',
    description: 'Utility-first CSS framework',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'CSS'],
    url: 'https://tailwindcss.com'
  },
  {
    id: 'sass',
    name: 'Sass',
    icon: 'devicon:sass',
    description: 'CSS preprocessor',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'CSS'],
    url: 'https://sass-lang.com'
  },
  {
    id: 'styled-components',
    name: 'styled-components',
    icon: 'devicon:materializecss',
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
    icon: 'devicon:redux',
    description: 'Predictable state container',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Frontend', 'State Management'],
    url: 'https://redux.js.org'
  },
  {
    id: 'zustand',
    name: 'Zustand',
    icon: 'simple-icons:react',
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
    icon: 'simple-icons:graphql',
    description: 'Query language for APIs',
    suggestedQuadrant: 1, // Techniques
    suggestedRing: 0,
    categories: ['API', 'Backend'],
    url: 'https://graphql.org'
  },
  {
    id: 'apollo',
    name: 'Apollo GraphQL',
    icon: 'simple-icons:graphql',
    description: 'GraphQL implementation',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['API', 'Backend'],
    url: 'https://www.apollographql.com'
  },
  {
    id: 'rest',
    name: 'REST API',
    icon: 'devicon:fastapi',
    description: 'RESTful web services',
    suggestedQuadrant: 1,
    suggestedRing: 0,
    categories: ['API', 'Backend']
  },
  {
    id: 'grpc',
    name: 'gRPC',
    icon: 'devicon:grpc',
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
    icon: 'devicon:react',
    description: 'Framework for building native apps',
    suggestedQuadrant: 3,
    suggestedRing: 0,
    categories: ['Mobile', 'Framework'],
    url: 'https://reactnative.dev'
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: 'devicon:flutter',
    description: 'UI toolkit for mobile, web, and desktop',
    suggestedQuadrant: 3,
    suggestedRing: 1,
    categories: ['Mobile', 'Framework'],
    url: 'https://flutter.dev'
  },

  // Version Control
  {
    id: 'git',
    name: 'Git',
    icon: 'devicon:git',
    description: 'Distributed version control system',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Tools', 'DevOps'],
    url: 'https://git-scm.com'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'devicon:github',
    description: 'Development platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Platform', 'DevOps'],
    url: 'https://github.com'
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: 'devicon:gitlab',
    description: 'DevOps platform',
    suggestedQuadrant: 2,
    suggestedRing: 1,
    categories: ['Platform', 'DevOps'],
    url: 'https://gitlab.com'
  },

  // CI/CD
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    icon: 'devicon:githubactions',
    description: 'CI/CD automation platform',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['CI/CD', 'DevOps', 'Tools'],
    url: 'https://github.com/features/actions'
  },
  {
    id: 'circleci',
    name: 'CircleCI',
    icon: 'simple-icons:circleci',
    description: 'Continuous integration and delivery',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['CI/CD', 'DevOps', 'Tools'],
    url: 'https://circleci.com'
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    icon: 'devicon:jenkins',
    description: 'Open source automation server',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['CI/CD', 'DevOps', 'Tools'],
    url: 'https://www.jenkins.io'
  },

  // Infrastructure as Code
  {
    id: 'terraform',
    name: 'Terraform',
    icon: 'devicon:terraform',
    description: 'Infrastructure as code software',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Infrastructure', 'DevOps', 'Tools'],
    url: 'https://www.terraform.io'
  },
  {
    id: 'ansible',
    name: 'Ansible',
    icon: 'devicon:ansible',
    description: 'IT automation and configuration management',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Infrastructure', 'DevOps', 'Tools'],
    url: 'https://www.ansible.com'
  },
  {
    id: 'pulumi',
    name: 'Pulumi',
    icon: 'devicon:pulumi',
    description: 'Infrastructure as code using programming languages',
    suggestedQuadrant: 0,
    suggestedRing: 2,
    categories: ['Infrastructure', 'DevOps', 'Tools'],
    url: 'https://www.pulumi.com'
  },

  // Monitoring & Observability
  {
    id: 'datadog',
    name: 'Datadog',
    icon: 'devicon:datadog',
    description: 'Monitoring and analytics platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Monitoring', 'Observability', 'Platform'],
    url: 'https://www.datadoghq.com'
  },
  {
    id: 'sentry',
    name: 'Sentry',
    icon: 'devicon:sentry',
    description: 'Application monitoring and error tracking',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Monitoring', 'Observability', 'Platform'],
    url: 'https://sentry.io'
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    icon: 'devicon:prometheus',
    description: 'Systems monitoring and alerting toolkit',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Monitoring', 'Observability', 'Tools'],
    url: 'https://prometheus.io'
  },
  {
    id: 'grafana',
    name: 'Grafana',
    icon: 'devicon:grafana',
    description: 'Observability and data visualization platform',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Monitoring', 'Observability', 'Tools'],
    url: 'https://grafana.com'
  },

  // Message Queues & Streaming
  {
    id: 'kafka',
    name: 'Apache Kafka',
    icon: 'devicon:apachekafka',
    description: 'Distributed event streaming platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Messaging', 'Streaming', 'Platform'],
    url: 'https://kafka.apache.org'
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    icon: 'devicon:rabbitmq',
    description: 'Message broker software',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Messaging', 'Platform'],
    url: 'https://www.rabbitmq.com'
  },

  // Authentication & Backend Services
  {
    id: 'auth0',
    name: 'Auth0',
    icon: 'simple-icons:auth0',
    description: 'Authentication and authorization platform',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Authentication', 'Security', 'Platform'],
    url: 'https://auth0.com'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: 'devicon:supabase',
    description: 'Open source Firebase alternative',
    suggestedQuadrant: 2,
    suggestedRing: 1,
    categories: ['Backend', 'Database', 'Platform'],
    url: 'https://supabase.com'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: 'devicon:firebase',
    description: 'App development platform by Google',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Backend', 'Platform'],
    url: 'https://firebase.google.com'
  },

  // ORMs & Database Tools
  {
    id: 'prisma',
    name: 'Prisma',
    icon: 'devicon:prisma',
    description: 'Next-generation ORM for Node.js and TypeScript',
    suggestedQuadrant: 0,
    suggestedRing: 0,
    categories: ['Database', 'ORM', 'Tools'],
    url: 'https://www.prisma.io'
  },
  {
    id: 'typeorm',
    name: 'TypeORM',
    icon: 'devicon:typeorm',
    description: 'ORM for TypeScript and JavaScript',
    suggestedQuadrant: 0,
    suggestedRing: 1,
    categories: ['Database', 'ORM', 'Tools'],
    url: 'https://typeorm.io'
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'devicon:elasticsearch',
    description: 'Search and analytics engine',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Database', 'Search', 'Platform'],
    url: 'https://www.elastic.co/elasticsearch'
  },

  // Web Servers & Reverse Proxies
  {
    id: 'nginx',
    name: 'NGINX',
    icon: 'devicon:nginx',
    description: 'Web server and reverse proxy',
    suggestedQuadrant: 2,
    suggestedRing: 0,
    categories: ['Web Server', 'Infrastructure'],
    url: 'https://nginx.org'
  },
  {
    id: 'caddy',
    name: 'Caddy',
    icon: 'simple-icons:caddy',
    description: 'Web server with automatic HTTPS',
    suggestedQuadrant: 2,
    suggestedRing: 1,
    categories: ['Web Server', 'Infrastructure'],
    url: 'https://caddyserver.com'
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
