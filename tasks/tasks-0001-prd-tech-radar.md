# Task List: Tech Radar Web Application

**Source PRD:** `0001-prd-tech-radar.md`
**Status:** Phase 2 Complete - Ready for Implementation
**Last Updated:** 2025-10-27

---

## Current State Assessment

**Codebase Status:** Greenfield project - no existing code infrastructure

**Technology Decisions (from PRD):**

- Frontend: React with Next.js + TypeScript
- Backend: Node.js with Next.js API Routes + TypeScript
- Database: PostgreSQL (relational model)
- Visualization: D3.js for radar diagram
- Authentication: NextAuth.js (magic links + Google OAuth)
- Styling: CSS Modules with CSS Custom Properties (theming)
- Testing: Jest + Playwright

**Key Constraints:**

- Maximum 200 tech items per radar
- Maximum 10 radars per user
- WCAG 2.1 Level AA accessibility compliance
- No real-time collaboration (manual refresh)
- Last write wins for conflicts

---

## Relevant Files

### Configuration & Setup

- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env.local` - Environment variables (database URL, auth secrets)
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Code formatting configuration
- `next.config.ts` - Next.js configuration
- `jest.config.js` - Jest testing configuration
- `playwright.config.ts` - Playwright E2E testing configuration

### Database & Schema

- `prisma/schema.prisma` - Database schema definition (Radar, TechItem, User models)
- `prisma/migrations/` - Database migration files
- `lib/prisma.ts` - Prisma client singleton instance

### API Routes (Next.js App Router)

- `app/api/radars/route.ts` - POST (create radar), GET (list radars for user)
- `app/api/radars/[id]/route.ts` - GET, PATCH, DELETE specific radar
- `app/api/radars/[radarId]/items/route.ts` - POST (add item), GET (list items)
- `app/api/items/[id]/route.ts` - PATCH, DELETE specific tech item
- `app/api/radars/[radarId]/export/[format]/route.ts` - GET export (png, svg, pdf, json)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth authentication endpoints

### API Tests

- `app/api/radars/route.test.ts` - Unit tests for radar API
- `app/api/radars/[radarId]/items/route.test.ts` - Unit tests for tech items API
- `app/api/items/[id]/route.test.ts` - Unit tests for individual item operations

### Components - Radar Visualization

- `components/Radar/RadarCanvas.tsx` - Main radar D3.js visualization component
- `components/Radar/RadarCanvas.test.tsx` - Tests for radar canvas
- `components/Radar/RadarQuadrant.tsx` - Individual quadrant rendering
- `components/Radar/RadarRing.tsx` - Ring rendering and labels
- `components/Radar/RadarBlip.tsx` - Tech item blip component
- `components/Radar/RadarBlip.test.tsx` - Tests for blip component
- `components/Radar/BlipPositioning.ts` - Algorithm for auto-positioning blips
- `components/Radar/BlipPositioning.test.ts` - Tests for positioning algorithm

### Components - Layout & Navigation

- `components/Layout/AppLayout.tsx` - Main application layout wrapper
- `components/Layout/TopNavigation.tsx` - Top navigation bar with share/export/settings
- `components/Layout/TopNavigation.test.tsx` - Navigation tests
- `components/Layout/MobileDrawer.tsx` - Mobile collapsible drawer component
- `components/Layout/MobileDrawer.test.tsx` - Mobile drawer tests

### Components - Side Panel & Tech Items

- `components/SidePanel/SidePanel.tsx` - Main side panel container
- `components/SidePanel/SidePanel.test.tsx` - Side panel tests
- `components/SidePanel/TechItemForm.tsx` - Form for adding/editing tech items
- `components/SidePanel/TechItemForm.test.tsx` - Form validation tests
- `components/SidePanel/TechItemList.tsx` - List view of tech items
- `components/SidePanel/TechItemList.test.tsx` - List component tests
- `components/SidePanel/FolderOrganizer.tsx` - Folder/category organization UI
- `components/SidePanel/TechItemDetail.tsx` - Detail view/modal for tech items

### Components - Modals & Dialogs

- `components/Modals/CreateRadarModal.tsx` - Modal for creating new radar
- `components/Modals/CreateRadarModal.test.tsx` - Modal tests
- `components/Modals/CustomizeQuadrantsModal.tsx` - Modal for editing quadrant names
- `components/Modals/ShareLinkModal.tsx` - Modal displaying shareable link
- `components/Modals/ExportModal.tsx` - Export options modal
- `components/Modals/DeleteConfirmModal.tsx` - Confirmation dialog for deletions
- `components/Modals/DeleteConfirmModal.test.tsx` - Confirmation dialog tests

### Pages (Next.js App Router)

- `app/page.tsx` - Landing page with "Create New Radar" CTA
- `app/dashboard/page.tsx` - User dashboard showing all radars (authenticated)
- `app/radar/[shareToken]/page.tsx` - Public radar view (guest access)
- `app/radar/[shareToken]/edit/page.tsx` - Radar edit view
- `app/login/page.tsx` - Login page for radar owners

### Utilities & Helpers

- `lib/utils/validation.ts` - Input validation functions
- `lib/utils/validation.test.ts` - Validation tests
- `lib/utils/shareToken.ts` - Generate unique share tokens
- `lib/utils/shareToken.test.ts` - Token generation tests
- `lib/utils/exportHelpers.ts` - Helper functions for exports (PNG, SVG, PDF, JSON)
- `lib/utils/exportHelpers.test.ts` - Export utility tests
- `lib/constants/defaults.ts` - Default quadrants, rings, limits
- `lib/types/radar.types.ts` - TypeScript type definitions for Radar, TechItem, etc.

### Hooks

- `hooks/useRadar.ts` - Custom hook for radar data fetching and mutations
- `hooks/useRadar.test.ts` - Hook tests
- `hooks/useTechItems.ts` - Custom hook for tech item CRUD operations
- `hooks/useTechItems.test.ts` - Hook tests
- `hooks/useMediaQuery.ts` - Responsive design helper hook

### Styles

- `app/globals.css` - Global styles, CSS resets, and font imports
- `styles/themes.css` - CSS Custom Properties for theming (light/dark mode)
- `styles/variables.css` - Non-theme CSS variables (spacing, typography, etc.)
- `context/ThemeContext.tsx` - Theme provider for dark/light mode switching
- Component-specific CSS Modules co-located with components (e.g., `RadarCanvas.module.css`)

### E2E Tests

- `e2e/createRadar.spec.ts` - E2E test for creating a radar
- `e2e/addTechItem.spec.ts` - E2E test for adding tech items
- `e2e/shareRadar.spec.ts` - E2E test for sharing and guest access
- `e2e/exportRadar.spec.ts` - E2E test for export functionality
- `e2e/accessibility.spec.ts` - Accessibility compliance tests

### Documentation

- `README.md` - Project setup and development instructions
- `docs/ARCHITECTURE.md` - Architecture decisions and patterns
- `docs/API.md` - API endpoint documentation

### Notes

- Unit tests should be co-located with implementation files (`.test.tsx` or `.test.ts`)
- Use `npm test` or `npx jest` to run unit tests
- Use `npm run test:e2e` or `npx playwright test` to run E2E tests
- Follow Next.js 14+ App Router conventions
- Use TypeScript strict mode for all files

---

## Tasks

- [ ] **1.0 Project Setup & Infrastructure**
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript using `npx create-next-app@latest` with App Router enabled
  - [x] 1.2 Configure TypeScript with strict mode in `tsconfig.json`
  - [x] 1.3 Install and configure ESLint with React and Next.js plugins
  - [x] 1.4 Install and configure Prettier for code formatting
  - [x] 1.5 Set up CSS Modules with global theme variables and styles structure
  - [x] 1.6 Create project folder structure following Next.js App Router conventions (`app/`, `components/`, `lib/`, `hooks/`, `prisma/`)
  - [x] 1.7 Install core dependencies: `d3`, `@prisma/client`, `next-auth`, `zod` (validation), `axios` or `swr` (data fetching)
  - [x] 1.8 Install dev dependencies: `@types/d3`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test` (Note: Later migrated to Vitest)
  - [x] 1.9 Configure Vitest for unit testing with `vitest.config.ts` and setup file (Migrated from Jest for better Next.js compatibility)
  - [x] 1.10 Configure Playwright for E2E testing with `playwright.config.ts`
  - [x] 1.11 Set up environment variables in `.env.local` (database URL, NextAuth secret, OAuth credentials)
  - [x] 1.12 Create `.gitignore` to exclude `node_modules/`, `.env.local`, `.next/`, build artifacts
  - [x] 1.13 Initialize Git repository and create initial commit
  - [ ] 1.14 Create `README.md` with setup instructions and project overview

- [ ] **2.0 Backend & Data Layer**
  - [x] 2.1 Install Prisma: `npm install prisma @prisma/client` and initialize with `npx prisma init`
  - [x] 2.2 Design database schema in `prisma/schema.prisma`:
    - [x] 2.2.1 Create `User` model (id, email, authProvider, createdAt)
    - [x] 2.2.2 Create `Radar` model (id, name, ownerId, shareToken, quadrants, rings, createdAt, updatedAt)
    - [x] 2.2.3 Create `TechItem` model (id, radarId, name, quadrant, ring, description, url, category, createdAt, updatedAt)
    - [x] 2.2.4 Define relationships: User has many Radars, Radar has many TechItems
  - [x] 2.3 Create initial database migration: `npx prisma migrate dev --name init`
  - [x] 2.4 Create Prisma client singleton in `lib/prisma.ts` for database connections
  - [x] 2.5 Implement NextAuth configuration in `app/api/auth/[...nextauth]/route.ts`:
    - [x] 2.5.1 Configure Google OAuth provider
    - [x] 2.5.2 Configure Email (magic link) provider
    - [x] 2.5.3 Set up database session strategy with Prisma adapter
  - [x] 2.6 Create API route `app/api/radars/route.ts`:
    - [x] 2.6.1 Implement POST endpoint to create new radar (validate name, generate shareToken, enforce 10 radar limit)
    - [x] 2.6.2 Implement GET endpoint to list all radars for authenticated user
    - [x] 2.6.3 Add input validation using Zod schemas
    - [x] 2.6.4 Write unit tests in `app/api/radars/route.test.ts`
  - [x] 2.7 Create API route `app/api/radars/[id]/route.ts`:
    - [x] 2.7.1 Implement GET endpoint to fetch radar by ID or shareToken
    - [x] 2.7.2 Implement PATCH endpoint to update radar (name, quadrants)
    - [x] 2.7.3 Implement DELETE endpoint to delete radar (owner only)
    - [x] 2.7.4 Write unit tests
  - [x] 2.8 Create API route `app/api/radars/[radarId]/items/route.ts`:
    - [x] 2.8.1 Implement POST endpoint to add tech item (validate required fields, enforce 200 item limit)
    - [x] 2.8.2 Implement GET endpoint to fetch all items for a radar
    - [x] 2.8.3 Add validation for quadrant index (0-3) and ring index (0-3)
    - [x] 2.8.4 Write unit tests in `app/api/radars/[radarId]/items/route.test.ts`
  - [x] 2.9 Create API route `app/api/items/[id]/route.ts`:
    - [x] 2.9.1 Implement PATCH endpoint to update tech item (allow changing all fields)
    - [x] 2.9.2 Implement DELETE endpoint to delete tech item
    - [x] 2.9.3 Write unit tests in `app/api/items/[id]/route.test.ts`
  - [x] 2.10 Create validation utilities in `lib/validations/`:
    - [x] 2.10.1 Create Zod schemas for Radar creation/update (in lib/validations/radar.ts)
    - [x] 2.10.2 Create Zod schemas for TechItem creation/update (in lib/validations/techItem.ts)
    - [x] 2.10.3 Add URL validation helper (included in techItem schema)
    - [ ] 2.10.4 Write tests in `lib/utils/validation.test.ts`
  - [x] 2.11 Create share token generator in `lib/utils/shareToken.ts` (handled by Prisma @default(cuid()) in schema)
  - [ ] 2.12 Implement rate limiting middleware for public API endpoints (optional but recommended)
  - [x] 2.13 Add database indexes for performance (added in Prisma schema: shareToken, ownerId, radarId)

- [ ] **3.0 Radar Visualization & Core UI**
  - [ ] 3.1 Create TypeScript types in `lib/types/radar.types.ts`:
    - [ ] 3.1.1 Define `Radar` interface
    - [ ] 3.1.2 Define `TechItem` interface
    - [ ] 3.1.3 Define `BlipPosition` interface (x, y coordinates)
    - [ ] 3.1.4 Define `QuadrantConfig` and `RingConfig` types
  - [ ] 3.2 Create constants file in `lib/constants/defaults.ts`:
    - [ ] 3.2.1 Define default quadrant names array
    - [ ] 3.2.2 Define default ring names array
    - [ ] 3.2.3 Define MAX_ITEMS_PER_RADAR = 200
    - [ ] 3.2.4 Define MAX_RADARS_PER_USER = 10
  - [ ] 3.3 Implement blip positioning algorithm in `components/Radar/BlipPositioning.ts`:
    - [ ] 3.3.1 Create function to calculate blip position based on quadrant and ring
    - [ ] 3.3.2 Implement collision detection to prevent overlapping blips
    - [ ] 3.3.3 Add randomization within ring boundaries for natural distribution
    - [ ] 3.3.4 Write tests in `components/Radar/BlipPositioning.test.ts`
  - [ ] 3.4 Create main radar component `components/Radar/RadarCanvas.tsx`:
    - [ ] 3.4.1 Set up D3.js SVG canvas with responsive viewBox
    - [ ] 3.4.2 Render 4 quadrants with dividing lines and labels
    - [ ] 3.4.3 Render 4 concentric rings with ring labels
    - [ ] 3.4.4 Implement blip rendering for tech items
    - [ ] 3.4.5 Add hover state to show tech item name tooltip
    - [ ] 3.4.6 Add click handler to open tech item detail view
    - [ ] 3.4.7 Ensure responsive sizing (use container queries or window resize listeners)
    - [ ] 3.4.8 Write tests in `components/Radar/RadarCanvas.test.tsx`
  - [ ] 3.5 Create `components/Radar/RadarBlip.tsx`:
    - [ ] 3.5.1 Render individual blip as SVG circle
    - [ ] 3.5.2 Apply hover and active states
    - [ ] 3.5.3 Add ARIA labels for accessibility
    - [ ] 3.5.4 Write tests in `components/Radar/RadarBlip.test.tsx`
  - [ ] 3.6 Create app layout `components/Layout/AppLayout.tsx`:
    - [ ] 3.6.1 Implement responsive grid: radar (main area) + side panel (desktop)
    - [ ] 3.6.2 Add mobile detection and conditional rendering for drawer vs panel
    - [ ] 3.6.3 Include top navigation component
    - [ ] 3.6.4 Add global error boundary
  - [ ] 3.7 Create top navigation `components/Layout/TopNavigation.tsx`:
    - [ ] 3.7.1 Display radar name/title
    - [ ] 3.7.2 Add "Share" button
    - [ ] 3.7.3 Add "Export" dropdown button
    - [ ] 3.7.4 Add "Customize" or "Settings" button
    - [ ] 3.7.5 Add user account indicator (for authenticated users)
    - [ ] 3.7.6 Write tests in `components/Layout/TopNavigation.test.tsx`
  - [ ] 3.8 Create side panel `components/SidePanel/SidePanel.tsx`:
    - [ ] 3.8.1 Implement fixed-width panel (desktop) or collapsible drawer (mobile)
    - [ ] 3.8.2 Add "Add Item" button at top
    - [ ] 3.8.3 Include tech item list component
    - [ ] 3.8.4 Include folder/category organizer
    - [ ] 3.8.5 Write tests in `components/SidePanel/SidePanel.test.tsx`
  - [ ] 3.9 Create mobile drawer `components/Layout/MobileDrawer.tsx`:
    - [ ] 3.9.1 Implement slide-in drawer from side with overlay
    - [ ] 3.9.2 Add open/close toggle button
    - [ ] 3.9.3 Ensure drawer closes when selecting an item (UX optimization)
    - [ ] 3.9.4 Write tests in `components/Layout/MobileDrawer.test.tsx`
  - [ ] 3.10 Create customize quadrants modal `components/Modals/CustomizeQuadrantsModal.tsx`:
    - [ ] 3.10.1 Display 4 input fields for quadrant names
    - [ ] 3.10.2 Pre-fill with current quadrant names
    - [ ] 3.10.3 Validate that all 4 names are provided
    - [ ] 3.10.4 Add Save and Cancel buttons
    - [ ] 3.10.5 Call API to update radar on save
  - [ ] 3.11 Create landing page `app/page.tsx`:
    - [ ] 3.11.1 Display hero section explaining Tech Radar
    - [ ] 3.11.2 Add prominent "Create New Radar" CTA button
    - [ ] 3.11.3 Redirect to dashboard if user is authenticated
  - [ ] 3.12 Create dashboard page `app/dashboard/page.tsx`:
    - [ ] 3.12.1 Fetch and display list of user's radars
    - [ ] 3.12.2 Show radar cards with name, created date, and link
    - [ ] 3.12.3 Add "Create New Radar" button
    - [ ] 3.12.4 Enforce 10 radar limit with appropriate messaging
    - [ ] 3.12.5 Require authentication (redirect to login if not authenticated)
  - [ ] 3.13 Create radar view page `app/radar/[shareToken]/page.tsx`:
    - [ ] 3.13.1 Fetch radar data by shareToken (public access, no auth required)
    - [ ] 3.13.2 Render RadarCanvas component with tech items
    - [ ] 3.13.3 Render SidePanel component
    - [ ] 3.13.4 Handle loading and error states
    - [ ] 3.13.5 Add manual refresh button or auto-refresh interval option

- [ ] **4.0 Tech Item Management & Collaboration**
  - [ ] 4.1 Create tech item form `components/SidePanel/TechItemForm.tsx`:
    - [ ] 4.1.1 Add form fields: Name (text, required), Quadrant (dropdown, required), Ring (dropdown, required), Description (textarea, optional), URL (text, optional)
    - [ ] 4.1.2 Populate quadrant dropdown with radar's custom quadrant names
    - [ ] 4.1.3 Populate ring dropdown with ring names (Adopt, Trial, Assess, Hold)
    - [ ] 4.1.4 Implement client-side validation (required fields, URL format)
    - [ ] 4.1.5 Add Save and Cancel buttons
    - [ ] 4.1.6 Support both "Add" and "Edit" modes
    - [ ] 4.1.7 Write tests in `components/SidePanel/TechItemForm.test.tsx`
  - [ ] 4.2 Implement add tech item functionality:
    - [ ] 4.2.1 Create custom hook `hooks/useTechItems.ts` for CRUD operations
    - [ ] 4.2.2 Implement `addTechItem` mutation function
    - [ ] 4.2.3 Check item count before adding (enforce 200 limit on client and server)
    - [ ] 4.2.4 Show success message on successful addition
    - [ ] 4.2.5 Show error message if limit reached or validation fails
    - [ ] 4.2.6 Refresh radar visualization after adding item
    - [ ] 4.2.7 Write tests in `hooks/useTechItems.test.ts`
  - [ ] 4.3 Implement edit tech item functionality:
    - [ ] 4.3.1 Add `updateTechItem` mutation to useTechItems hook
    - [ ] 4.3.2 Pre-populate form with existing tech item data
    - [ ] 4.3.3 Allow changing any field including quadrant and ring
    - [ ] 4.3.4 Handle "last write wins" conflict resolution (no optimistic locking)
    - [ ] 4.3.5 Refresh radar after successful update
  - [ ] 4.4 Implement delete tech item functionality:
    - [ ] 4.4.1 Add `deleteTechItem` mutation to useTechItems hook
    - [ ] 4.4.2 Create delete confirmation modal `components/Modals/DeleteConfirmModal.tsx`
    - [ ] 4.4.3 Show confirmation dialog before deletion
    - [ ] 4.4.4 Remove item from radar on successful deletion
    - [ ] 4.4.5 Write tests in `components/Modals/DeleteConfirmModal.test.tsx`
  - [ ] 4.5 Create tech item list `components/SidePanel/TechItemList.tsx`:
    - [ ] 4.5.1 Display all tech items in a scrollable list
    - [ ] 4.5.2 Show item name, quadrant, and ring for each item
    - [ ] 4.5.3 Add click handler to open detail view or edit form
    - [ ] 4.5.4 Add edit and delete action buttons for each item
    - [ ] 4.5.5 Write tests in `components/SidePanel/TechItemList.test.tsx`
  - [ ] 4.6 Create tech item detail view `components/SidePanel/TechItemDetail.tsx`:
    - [ ] 4.6.1 Display full tech item information (name, quadrant, ring, description, URL)
    - [ ] 4.6.2 Make URL clickable (open in new tab)
    - [ ] 4.6.3 Add "Edit" button to switch to edit mode
    - [ ] 4.6.4 Add "Delete" button
    - [ ] 4.6.5 Add "Close" button to return to list view
  - [ ] 4.7 Implement folder/category organization `components/SidePanel/FolderOrganizer.tsx`:
    - [ ] 4.7.1 Create tree/accordion structure for categories
    - [ ] 4.7.2 Allow users to create new categories
    - [ ] 4.7.3 Allow dragging items between categories (optional for MVP)
    - [ ] 4.7.4 Store category assignment in TechItem model (category field)
    - [ ] 4.7.5 Note: Categories are organizational only, don't affect radar visualization
  - [ ] 4.8 Implement shareable link system:
    - [ ] 4.8.1 Create share modal `components/Modals/ShareLinkModal.tsx`
    - [ ] 4.8.2 Display full shareable URL (origin + /radar/[shareToken])
    - [ ] 4.8.3 Add "Copy Link" button with clipboard API
    - [ ] 4.8.4 Show success confirmation when link is copied
    - [ ] 4.8.5 Include instructions: "Share this link with anyone to collaborate"
  - [ ] 4.9 Implement guest access:
    - [ ] 4.9.1 Ensure radar view page allows unauthenticated access via shareToken
    - [ ] 4.9.2 Provide full edit permissions to all users with the link (no auth check)
    - [ ] 4.9.3 Add refresh button or guidance to manually refresh to see others' changes
  - [ ] 4.10 Create "Create New Radar" modal `components/Modals/CreateRadarModal.tsx`:
    - [ ] 4.10.1 Show input field for radar name
    - [ ] 4.10.2 Validate radar name is not empty
    - [ ] 4.10.3 Call API to create radar with default quadrants/rings
    - [ ] 4.10.4 Check user's radar count and show error if limit reached
    - [ ] 4.10.5 Redirect to new radar page after creation
    - [ ] 4.10.6 Write tests in `components/Modals/CreateRadarModal.test.tsx`
  - [ ] 4.11 Create custom hook for radar operations `hooks/useRadar.ts`:
    - [ ] 4.11.1 Implement `createRadar` mutation
    - [ ] 4.11.2 Implement `updateRadar` mutation (for quadrant customization)
    - [ ] 4.11.3 Implement `deleteRadar` mutation
    - [ ] 4.11.4 Implement `fetchRadar` query by shareToken or ID
    - [ ] 4.11.5 Write tests in `hooks/useRadar.test.ts`

- [ ] **5.0 Export, Accessibility & Deployment**
  - [ ] 5.1 Implement export utilities in `lib/utils/exportHelpers.ts`:
    - [ ] 5.1.1 Create function to export radar as PNG (use html2canvas or similar library)
    - [ ] 5.1.2 Create function to export radar as SVG (extract SVG element from D3)
    - [ ] 5.1.3 Create function to export as PDF (use jsPDF or similar, include radar + item list)
    - [ ] 5.1.4 Create function to export as JSON (serialize radar and tech items)
    - [ ] 5.1.5 Write tests in `lib/utils/exportHelpers.test.ts`
  - [ ] 5.2 Create export modal `components/Modals/ExportModal.tsx`:
    - [ ] 5.2.1 Display dropdown with export format options (PNG, SVG, PDF, JSON)
    - [ ] 5.2.2 Trigger appropriate export function on selection
    - [ ] 5.2.3 Show loading indicator during export generation
    - [ ] 5.2.4 Handle export errors gracefully
  - [ ] 5.3 Create API route for server-side exports `app/api/radars/[radarId]/export/[format]/route.ts`:
    - [ ] 5.3.1 Implement GET endpoint for each format
    - [ ] 5.3.2 Generate export file on server (consider using headless browser for PNG/PDF)
    - [ ] 5.3.3 Return file as download response with appropriate Content-Type
  - [ ] 5.4 Implement ARIA labels throughout application:
    - [ ] 5.4.1 Add aria-label to all interactive elements (buttons, links, form inputs)
    - [ ] 5.4.2 Add role attributes where appropriate (e.g., role="navigation")
    - [ ] 5.4.3 Ensure form inputs have associated labels (use <label> or aria-labelledby)
    - [ ] 5.4.4 Add aria-live regions for dynamic content updates
  - [ ] 5.5 Implement keyboard navigation:
    - [ ] 5.5.1 Ensure all interactive elements are keyboard accessible (tab order)
    - [ ] 5.5.2 Add keyboard shortcuts for common actions (e.g., "N" for new item)
    - [ ] 5.5.3 Implement focus management for modals (trap focus, return focus on close)
    - [ ] 5.5.4 Add visible focus indicators with adequate contrast
  - [ ] 5.6 Ensure color contrast compliance:
    - [ ] 5.6.1 Audit all text and background color combinations
    - [ ] 5.6.2 Ensure minimum 4.5:1 contrast ratio for normal text (WCAG AA)
    - [ ] 5.6.3 Ensure minimum 3:1 contrast ratio for large text and UI components
    - [ ] 5.6.4 Use tools like axe DevTools or Lighthouse to verify
  - [ ] 5.7 Implement responsive mobile optimizations:
    - [ ] 5.7.1 Test radar scaling on mobile devices (viewport width < 768px)
    - [ ] 5.7.2 Ensure touch targets are minimum 44x44 pixels
    - [ ] 5.7.3 Optimize mobile drawer interactions (smooth animations)
    - [ ] 5.7.4 Test form usability on mobile (input sizing, keyboard interactions)
  - [ ] 5.8 Create media query hook `hooks/useMediaQuery.ts`:
    - [ ] 5.8.1 Implement hook to detect screen size breakpoints
    - [ ] 5.8.2 Use for conditional rendering (drawer vs panel)
  - [ ] 5.9 Write comprehensive unit tests:
    - [ ] 5.9.1 Ensure all components have test files
    - [ ] 5.9.2 Test user interactions (clicks, form submissions)
    - [ ] 5.9.3 Test edge cases (empty states, error states, loading states)
    - [ ] 5.9.4 Achieve 70%+ code coverage for critical paths
    - [ ] 5.9.5 Run `npm test` to execute all Jest tests
  - [ ] 5.10 Write E2E tests with Playwright:
    - [ ] 5.10.1 Create test in `e2e/createRadar.spec.ts` for creating a new radar
    - [ ] 5.10.2 Create test in `e2e/addTechItem.spec.ts` for adding tech items
    - [ ] 5.10.3 Create test in `e2e/shareRadar.spec.ts` for guest access workflow
    - [ ] 5.10.4 Create test in `e2e/exportRadar.spec.ts` for export functionality
    - [ ] 5.10.5 Create test in `e2e/accessibility.spec.ts` using axe-playwright for WCAG compliance
    - [ ] 5.10.6 Run `npm run test:e2e` to execute Playwright tests
  - [ ] 5.11 Set up CI/CD pipeline:
    - [ ] 5.11.1 Create GitHub Actions workflow (or similar) for automated testing
    - [ ] 5.11.2 Run unit tests on every commit
    - [ ] 5.11.3 Run E2E tests on pull requests
    - [ ] 5.11.4 Run linting and type checking
    - [ ] 5.11.5 Build project to verify no build errors
  - [ ] 5.12 Configure production deployment:
    - [ ] 5.12.1 Choose hosting platform (Vercel, Netlify, AWS, etc.)
    - [ ] 5.12.2 Set up production database (PostgreSQL on cloud provider)
    - [ ] 5.12.3 Configure environment variables in production
    - [ ] 5.12.4 Set up custom domain and SSL certificate
    - [ ] 5.12.5 Test deployment with staging environment first
  - [ ] 5.13 Create documentation:
    - [ ] 5.13.1 Update `README.md` with complete setup instructions
    - [ ] 5.13.2 Create `docs/ARCHITECTURE.md` documenting key decisions and patterns
    - [ ] 5.13.3 Create `docs/API.md` with API endpoint documentation
    - [ ] 5.13.4 Add inline code comments for complex logic (especially positioning algorithm)
  - [ ] 5.14 Performance optimization:
    - [ ] 5.14.1 Run Lighthouse audit and address performance issues
    - [ ] 5.14.2 Optimize radar rendering for large numbers of items (100+)
    - [ ] 5.14.3 Implement lazy loading for tech item details
    - [ ] 5.14.4 Optimize bundle size (analyze with `@next/bundle-analyzer`)
    - [ ] 5.14.5 Add loading states and skeleton screens for better perceived performance
  - [ ] 5.15 Final QA and testing:
    - [ ] 5.15.1 Test all user workflows from PRD (refer to Appendix A)
    - [ ] 5.15.2 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
    - [ ] 5.15.3 Test on multiple devices (desktop, tablet, mobile)
    - [ ] 5.15.4 Test with screen readers (NVDA, JAWS, VoiceOver)
    - [ ] 5.15.5 Test keyboard-only navigation
    - [ ] 5.15.6 Fix any bugs discovered during testing

---

## Implementation Notes

### Recommended Development Sequence

1. Start with **Task 1.0** (Project Setup) to establish foundation
2. Complete **Task 2.0** (Backend & Data Layer) to enable data persistence
3. Build **Task 3.0** (Radar Visualization) for core functionality
4. Implement **Task 4.0** (Tech Item Management) for user interactions
5. Finish with **Task 5.0** (Export, Accessibility, Deployment) for polish and launch

### Key Dependencies Between Tasks

- Task 2.0 must be completed before 4.0 (need API endpoints for CRUD operations)
- Task 3.1-3.3 (types, constants, positioning) should be done before 3.4 (radar rendering)
- Task 5.4-5.6 (accessibility) should be done throughout development, not just at the end
- Task 5.10-5.15 (testing and QA) should be ongoing, not just at the end

### Testing Strategy

- Write unit tests alongside implementation (not after)
- Run tests frequently during development
- Use E2E tests to verify critical user workflows
- Accessibility testing should be continuous (use axe DevTools during development)

### Code Quality Guidelines

- Follow TypeScript strict mode (no `any` types)
- Use ESLint and Prettier to enforce code style
- Write meaningful commit messages
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use Zod for runtime validation at API boundaries

### Performance Considerations

- Radar should render smoothly with 200 items
- Optimize D3.js rendering (use Canvas if SVG is slow)
- Implement pagination or virtualization for tech item list if needed
- Cache API responses where appropriate (use SWR or React Query)

### Security Considerations

- Validate all inputs on both client and server
- Sanitize user-generated content (tech item names, descriptions)
- Use HTTPS in production
- Implement rate limiting to prevent abuse
- Follow OWASP best practices

---

**Status:** ✅ Ready for Implementation
