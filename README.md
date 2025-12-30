# Tech Radar

An interactive web application for visualising and managing your technology landscape. Create collaborative tech radars to track technology adoption across your team or organisation.

**Live site:** [techradars.app](https://techradars.app)

![Screenshot](screenshot.png)

## Features

- **Interactive radar visualisation** - D3.js-powered radar with four rings (Adopt, Trial, Assess, Hold) and customisable quadrants
- **Collaborative editing** - Share radars via public links with zero-barrier collaboration
- **Tech Library** - Browse and add from a curated list of popular technologies with icons
- **Multiple radars** - Create and manage up to 10 radars per account

## Tech Stack

- [Next.js](https://nextjs.org) 16 with React 19
- [TypeScript](https://www.typescriptlang.org)
- [D3.js](https://d3js.org) for radar visualisation
- [Prisma](https://www.prisma.io) with PostgreSQL
- [NextAuth.js](https://next-auth.js.org) for authentication
- [Resend](https://resend.com) for transactional emails
- [Vitest](https://vitest.dev) & [Playwright](https://playwright.dev) for testing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Environment Variables

Create an `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/techradar"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@your-domain.com"
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/jaleeson11/tech-radar.git
```

2. Navigate to the project directory
```bash
cd tech-radar
```

3. Install dependencies
```bash
npm install
```

4. Set up the database
```bash
npx prisma migrate dev
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits & Acknowledgements

- Inspired by the [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar)

## License

MIT
