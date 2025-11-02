# Product Requirements Document: Tech Radar Web Application

**Document Version:** 1.0
**Last Updated:** 2025-10-27
**Status:** Draft

---

## 1. Introduction/Overview

### Problem Statement

Software engineering teams, technology leaders, and individual technologists need a clear, visual way to track and communicate their technology stack, tools, services, and frameworks. Teams struggle to maintain visibility into what technologies they're using, evaluating, or phasing out, leading to inconsistent technology adoption and knowledge silos.

### Solution

Tech Radar is an interactive web application that enables teams and individuals to visualize and collaboratively manage their technology landscape through an intuitive circular radar diagram. Inspired by Zalando's Tech Radar but with enhanced interactive capabilities, this tool allows users to create, edit, and share customizable tech radars that represent their technology adoption lifecycle.

### Target Audience

- Software engineering teams
- Technology leaders and architects
- Product teams
- Individual technologists tracking their tech stack
- Any team or individual using technology who wants to maintain visibility of their tools and practices

---

## 2. Goals

### Primary Goals

1. **Enable Technology Visibility**: Provide a clear, visual representation of an organization's or individual's technology landscape
2. **Facilitate Collaboration**: Allow multiple contributors to collaboratively build and maintain tech radars
3. **Support Decision Making**: Help teams make informed decisions about technology adoption, trial, assessment, and retirement
4. **Enable Knowledge Sharing**: Make it easy to share technology perspectives across teams through shareable links and exports

### Success Criteria

- Users can create a functional tech radar within 10 minutes of first use
- Multiple contributors can successfully collaborate on a single radar
- Radars can be exported and shared for documentation purposes
- The application is accessible and usable on desktop, tablet, and mobile devices

---

## 3. User Stories

### Creating and Managing Radars

**US-001: Create a New Tech Radar**

> As a **technology leader**, I want to **create a new tech radar for my team** so that **we can start documenting our technology stack**.

**Acceptance Criteria:**

- User can click a "Create New Radar" button
- User is prompted to name their radar
- A new radar is created with default quadrants (Tools, Techniques, Platforms, Languages & Frameworks) and rings (Adopt, Trial, Assess, Hold)
- User receives a unique shareable link for the radar

**US-002: Customize Radar Structure**

> As a **radar creator**, I want to **customize the quadrant names** so that **the radar reflects my team's specific categorization needs**.

**Acceptance Criteria:**

- User can access quadrant settings
- User can edit all four quadrant names
- Changes are immediately reflected in the radar visualization
- Default quadrants are provided as a starting point

**US-003: Manage Multiple Radars**

> As a **technology architect**, I want to **create and manage multiple tech radars** so that **I can track different projects or time periods separately**.

**Acceptance Criteria:**

- User can create up to 10 radars per account
- User can view a list/dashboard of their created radars
- User can switch between radars easily
- Each radar has a unique identifier and shareable link

### Managing Tech Items

**US-004: Add a Tech Item**

> As a **team member**, I want to **add a technology to the radar** so that **it's included in our team's technology landscape**.

**Acceptance Criteria:**

- User can access a side panel or form to add tech items
- User must provide: name, category/quadrant, and ring position
- User can optionally provide: description and reference URL
- Tech item appears on the radar after saving
- Maximum of 200 tech items per radar is enforced

**US-005: Edit a Tech Item**

> As a **contributor**, I want to **update a technology's position or details** so that **the radar reflects current assessment**.

**Acceptance Criteria:**

- User can select an existing tech item from the radar or side panel
- User can modify name, category, ring position, description, and URL
- Changes are saved and reflected immediately on the radar
- If conflicts occur (another user edited simultaneously), last write wins

**US-006: Delete a Tech Item**

> As a **radar owner**, I want to **remove technologies from the radar** so that **we maintain an accurate, current view**.

**Acceptance Criteria:**

- User can select a tech item and choose to delete it
- User receives a confirmation prompt before deletion
- Deleted items are removed from the radar immediately
- Deletion is permanent (no undo for MVP)

**US-007: Organize Tech Items**

> As a **team member**, I want to **organize tech items in folders or categories before adding them to the radar** so that **I can prepare items systematically**.

**Acceptance Criteria:**

- Side panel provides a folder/category structure
- User can create categories to group related items
- Items can be moved between categories
- Categories are organizational only and don't affect radar visualization

### Collaboration and Sharing

**US-008: Invite Collaborators**

> As a **radar creator**, I want to **share my radar with team members via a link** so that **they can view and contribute**.

**Acceptance Criteria:**

- User can access a "Share" function
- System generates a unique, public shareable link
- Anyone with the link can immediately access the radar without authentication
- All users with the link have full edit permissions

**US-009: Contribute as a Guest**

> As a **team member with a shared link**, I want to **view and edit the radar without creating an account** so that **I can contribute quickly and easily**.

**Acceptance Criteria:**

- Guest can access radar by clicking shared link (no login required)
- Guest has full ability to add, edit, and delete tech items
- Guest can customize quadrants and rings
- Guest actions are reflected immediately (after manual refresh)

**US-010: View Shared Radar**

> As a **stakeholder**, I want to **view a tech radar that was shared with me** so that **I can understand the team's technology landscape**.

**Acceptance Criteria:**

- User can access radar via shared link on any device
- Radar visualization is clear and interactive
- User can click on tech items to view details (name, description, URL)
- Mobile view adapts appropriately with collapsible side panel

### Exporting and Documentation

**US-011: Export as Image**

> As a **technology leader**, I want to **export the radar as an image** so that **I can include it in presentations and documentation**.

**Acceptance Criteria:**

- User can click an "Export" button
- User can choose between PNG and SVG formats
- Exported image includes the full radar visualization with all tech items
- Image quality is suitable for presentations (high resolution)

**US-012: Export as PDF**

> As a **team lead**, I want to **export the radar as a PDF** so that **I can share it in reports and documentation**.

**Acceptance Criteria:**

- User can export radar as PDF document
- PDF includes the radar visualization
- PDF optionally includes a list of all tech items with descriptions
- PDF is properly formatted and print-ready

**US-013: Export Data**

> As a **developer**, I want to **export the radar data as JSON** so that **I can back it up or migrate to another system**.

**Acceptance Criteria:**

- User can export all radar data as JSON file
- JSON includes all tech items with complete metadata
- JSON includes radar configuration (quadrant names, ring names)
- Exported JSON is human-readable and well-formatted

---

## 4. Functional Requirements

### 4.1 Radar Visualization

**FR-001:** The system must display an interactive circular radar diagram with 4 quadrants and 4 concentric rings.

**FR-002:** The default rings, from center outward, must be: Adopt, Trial, Assess, Hold.

**FR-003:** The default quadrants must be: Tools, Techniques, Platforms, Languages & Frameworks.

**FR-004:** Users must be able to customize all quadrant names to fit their organizational needs.

**FR-005:** Tech items (blips) must be visually represented on the radar based on their assigned quadrant and ring.

**FR-006:** The system must automatically position tech items within their assigned ring and quadrant to minimize overlap.

**FR-007:** Users must be able to click on a tech item blip to view its details (name, description, URL).

**FR-008:** The radar visualization must be responsive and adapt to desktop, tablet, and mobile screen sizes.

### 4.2 Tech Item Management

**FR-009:** Users must be able to add new tech items via a side panel interface.

**FR-010:** Each tech item must have the following required fields: Name, Category/Quadrant, Ring Position.

**FR-011:** Each tech item should have the following optional fields: Description (brief text), Link/URL (reference documentation).

**FR-012:** The system must provide a folder/category structure in the side panel for organizing tech items before placement on the radar.

**FR-013:** Users must be able to edit existing tech items, including changing their ring position, quadrant, name, description, and URL.

**FR-014:** Users must be able to delete tech items with a confirmation prompt.

**FR-015:** The system must enforce a maximum limit of 200 tech items per radar.

**FR-016:** The system must allow duplicate tech items with the same name (same tech can appear in multiple contexts).

**FR-017:** When a user attempts to add the 201st item, the system must display an error message and prevent the addition.

### 4.3 Collaboration and Access

**FR-018:** The system must generate a unique, shareable link for each radar.

**FR-019:** The shareable link must be public with no access restrictions (anyone with the link can access).

**FR-020:** Users accessing a radar via a shared link must not require authentication or account creation.

**FR-021:** All users with the shared link must have full edit permissions (add, edit, delete tech items, customize quadrants/rings).

**FR-022:** The system must support multiple concurrent users viewing and editing the same radar.

**FR-023:** When multiple users edit the same tech item simultaneously, the last saved change must overwrite previous changes (last write wins).

**FR-024:** The system must not provide real-time collaboration indicators in the MVP (users must manually refresh to see changes).

**FR-025:** Users must manually refresh their browser to see updates made by other contributors.

### 4.4 Radar Creation and Management

**FR-026:** Users must be able to create a new radar with a single action (e.g., "Create New Radar" button).

**FR-027:** The system must prompt users to provide a name when creating a new radar.

**FR-028:** New radars must be initialized with default quadrants and rings.

**FR-029:** The system must allow users to create up to 10 radars per user/account.

**FR-030:** When a user attempts to create an 11th radar, the system must display an error and prevent creation.

**FR-031:** For radar creators/owners, the system must support authentication via email-based magic links OR Google OAuth.

**FR-032:** The system must provide a dashboard or list view where users can see all their created radars.

### 4.5 Export Functionality

**FR-033:** The system must allow users to export the radar visualization as a PNG image.

**FR-034:** The system must allow users to export the radar visualization as an SVG image.

**FR-035:** The system must allow users to export the radar as a PDF document.

**FR-036:** The system must allow users to export all radar data as a JSON file.

**FR-037:** Exported JSON must include all tech items with complete metadata (name, category, ring, description, URL).

**FR-038:** Exported JSON must include radar configuration (radar name, custom quadrant names, ring names).

**FR-039:** Exported images (PNG/SVG) must be high resolution and suitable for presentations.

### 4.6 Mobile Responsiveness

**FR-040:** The application must be fully responsive and functional on mobile devices (smartphones and tablets).

**FR-041:** On mobile devices, the side panel must display as a collapsible drawer that overlays the radar.

**FR-042:** The radar visualization must scale appropriately for smaller screens while maintaining readability.

**FR-043:** All core features (add, edit, delete, view) must be accessible on mobile devices.

### 4.7 Accessibility

**FR-044:** The application must comply with WCAG 2.1 Level AA accessibility standards.

**FR-045:** All interactive elements must be keyboard accessible.

**FR-046:** The application must provide appropriate ARIA labels for screen readers.

**FR-047:** Color contrast ratios must meet WCAG AA standards (minimum 4.5:1 for normal text).

**FR-048:** The radar visualization must include text alternatives for assistive technologies.

---

## 5. Non-Goals (Out of Scope for MVP)

The following features are explicitly **not included** in the MVP and should be considered for future iterations:

**NG-001:** User permission levels (admin, contributor, viewer roles) - All users with link have full edit access in MVP.

**NG-002:** Commenting and discussion threads on tech items - No social/discussion features in MVP.

**NG-003:** Version history and audit trails - No tracking of historical changes in MVP.

**NG-004:** Voting or consensus mechanisms for tech item placement - No democratic decision-making features in MVP.

**NG-005:** Advanced search and filtering capabilities - Basic organization only in MVP.

**NG-006:** Multiple radar views per organization/workspace - Limited to individual radars, no organizational hierarchy.

**NG-007:** Real-time collaborative editing indicators (live presence, cursors) - Manual refresh required to see changes.

**NG-008:** Integration with external tools (Jira, Confluence, Slack) - Standalone application only.

**NG-009:** API for programmatic access - Web UI only in MVP.

**NG-010:** Automated technology data feeds or integrations - All data entry is manual.

**NG-011:** Customizable number of rings (fixed at 4 rings for MVP).

**NG-012:** Drag-and-drop positioning of tech items - Auto-positioning only in MVP.

**NG-013:** Rich text formatting in descriptions - Plain text only.

**NG-014:** User profile management beyond basic authentication.

**NG-015:** Radar templates or import from predefined technology lists.

**NG-016:** Data retention or expiration policies - Not addressed in MVP.

**NG-017:** Analytics or usage tracking dashboards.

**NG-018:** Email notifications for radar changes or invitations.

**NG-019:** Link expiration or access revocation capabilities.

**NG-020:** Customizable ring names (rings remain: Adopt, Trial, Assess, Hold).

---

## 6. Design Considerations

### 6.1 User Interface Components

**Radar Visualization:**

- Circular radar diagram as the primary visual element
- Clear visual distinction between the 4 quadrants (consider color coding or sectioning)
- 4 concentric rings with visible boundaries and labels
- Tech item blips should be represented as clickable dots or small circles
- Hover states should provide quick preview of tech item name
- Click/tap on blip opens detail view with full information

**Side Panel:**

- Collapsible panel on desktop (typically right side or left side)
- Contains folder/category tree structure for organization
- Form interface for adding new tech items
- List view of existing tech items with quick edit access
- On mobile: drawer that slides in from side, overlaying the radar

**Top Navigation:**

- Radar name/title prominently displayed
- "Share" button for accessing shareable link
- "Export" button with dropdown for format selection (PNG, SVG, PDF, JSON)
- "Settings" or "Customize" for editing quadrant names
- User account indicator (if authenticated as owner)

### 6.2 User Experience Flow

**First-Time User Flow:**

1. Landing page with "Create New Radar" CTA
2. User provides radar name
3. User sees empty radar with default quadrants/rings and guided tutorial/hints
4. User adds first tech item via prominent "Add Item" button
5. Success message and encouragement to add more items or invite collaborators

**Returning User Flow:**

1. User sees dashboard of their created radars
2. User selects a radar to open
3. User can immediately see and interact with their radar
4. User can switch between radars via navigation

**Guest/Collaborator Flow:**

1. Guest clicks shared link
2. Radar loads immediately (no login required)
3. Guest can view radar and all tech items
4. Guest can add/edit items via side panel
5. Guest refreshes to see changes made by others

### 6.3 Visual Design Guidelines

**Color Scheme:**

- Consider a professional, modern color palette suitable for tech audiences
- Ensure sufficient contrast for accessibility (WCAG AA)
- Use distinct colors for each quadrant to aid visual differentiation
- Consider a neutral background (white or light gray) to reduce eye strain

**Typography:**

- Clean, readable sans-serif font (e.g., Inter, Roboto, Open Sans)
- Hierarchy: Clear distinction between headings, body text, and labels
- Minimum font size of 14px for body text to ensure readability

**Responsiveness:**

- Desktop: Side-by-side layout (radar + side panel)
- Tablet: Collapsible panel or stacked layout
- Mobile: Full-screen radar with drawer-based panel

### 6.4 Interaction Patterns

**Adding a Tech Item:**

1. Click "Add Item" button in side panel
2. Form appears with fields (Name*, Category*, Ring\*, Description, URL)
3. Required fields marked with asterisk
4. "Save" and "Cancel" buttons
5. On save, item appears on radar with smooth animation

**Editing a Tech Item:**

1. Click on blip in radar OR click item in side panel list
2. Detail view/modal opens with current information
3. User edits fields
4. "Save" and "Cancel" buttons
5. Changes reflected on radar immediately

**Customizing Quadrants:**

1. Access via "Settings" or "Customize" button
2. Modal/panel with 4 input fields for quadrant names
3. Preview of radar updates as names are typed
4. "Save" and "Cancel" buttons

### 6.5 Mobile-Specific Considerations

**Touch Targets:**

- Minimum touch target size of 44x44 pixels for all interactive elements
- Adequate spacing between blips to prevent mis-taps

**Gestures:**

- Pinch-to-zoom for radar on mobile (optional enhancement)
- Swipe to open/close side drawer
- Tap to select blips and view details

**Performance:**

- Optimize radar rendering for mobile devices
- Lazy-load tech item details to reduce initial load time
- Consider limiting visible items on small screens (e.g., show top 50, with "load more")

---

## 7. Technical Considerations

### 7.1 Technology Stack Recommendations

**Frontend:**

- **Framework:** React with Next.js or Vite
- **Language:** TypeScript for type safety and better developer experience
- **UI Components:** Consider a component library like Radix UI, Chakra UI, or shadcn/ui for accessible components
- **Styling:** CSS-in-JS (styled-components, Emotion) or Tailwind CSS for responsive design
- **Radar Visualization:** D3.js or a similar SVG/Canvas-based library for creating the interactive radar diagram
- **State Management:** React Context API or Zustand for managing radar state
- **HTTP Client:** Axios or native Fetch API for backend communication

**Backend:**

- **Framework:** Node.js with Express, Nest.js, or similar for REST API
- **Language:** TypeScript (for consistency with frontend)
- **Database:** PostgreSQL (SQL) or MongoDB (NoSQL) for storing radar and tech item data
  - PostgreSQL recommended for relational structure (radars → tech items)
- **Authentication:** NextAuth.js (magic links + Google OAuth) for radar owners; no auth for guests
- **File Storage:** Local file system or cloud storage (S3, GCS) for exported files (optional)

**Deployment:**

- **Hosting:** Cloud platform TBD (e.g., Vercel, Netlify for frontend; Heroku, AWS, GCP for backend)
- **Domain:** Custom domain for production deployment
- **SSL/TLS:** HTTPS required for security

### 7.2 Data Model

**Radar Entity:**

```typescript
{
  id: string (UUID)
  name: string
  ownerId: string (nullable for MVP if no strict user accounts)
  shareToken: string (unique public link identifier)
  quadrants: string[] (4 custom names)
  rings: string[] (4 ring names - default: ["Adopt", "Trial", "Assess", "Hold"])
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Tech Item Entity:**

```typescript
{
  id: string (UUID)
  radarId: string (foreign key to Radar)
  name: string (required)
  quadrant: number (0-3, index into radar.quadrants array)
  ring: number (0-3, index into radar.rings array)
  description: string (optional, plain text)
  url: string (optional, valid URL)
  category: string (optional, for folder organization in side panel)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**User Entity (Minimal for MVP):**

```typescript
{
  id: string(UUID);
  email: string(unique);
  authProvider: 'magic-link' | 'google-oauth';
  createdAt: timestamp;
}
```

### 7.3 API Endpoints (Suggested)

**Radars:**

- `POST /api/radars` - Create a new radar
- `GET /api/radars/:shareToken` - Get radar by share token (public access)
- `GET /api/radars` - List all radars for authenticated user (owner)
- `PATCH /api/radars/:id` - Update radar settings (name, quadrants)
- `DELETE /api/radars/:id` - Delete a radar (owner only)

**Tech Items:**

- `POST /api/radars/:radarId/items` - Add a new tech item
- `GET /api/radars/:radarId/items` - List all items for a radar
- `PATCH /api/items/:id` - Update a tech item
- `DELETE /api/items/:id` - Delete a tech item

**Export:**

- `GET /api/radars/:radarId/export/png` - Export as PNG
- `GET /api/radars/:radarId/export/svg` - Export as SVG
- `GET /api/radars/:radarId/export/pdf` - Export as PDF
- `GET /api/radars/:radarId/export/json` - Export as JSON

**Authentication:**

- `POST /api/auth/magic-link` - Request magic link
- `GET /api/auth/callback` - OAuth callback

### 7.4 Data Persistence

- **Storage:** Database (SQL/NoSQL) with backend API
- **Recommended:** PostgreSQL for relational data model (radars have many tech items)
- **ORM/Query Builder:** Prisma (for TypeScript) or similar for database access
- **Migrations:** Use migration tools to manage schema changes

### 7.5 Security Considerations

**Authentication:**

- Radar owners authenticate via magic links or Google OAuth
- Guest contributors access via public share token (no authentication)
- Session management for authenticated users (JWT or session cookies)

**Authorization:**

- Anyone with share token has full edit permissions (no granular access control in MVP)
- Radar owners can delete their radars
- No link revocation or expiration in MVP (listed as open question)

**Data Validation:**

- Validate all user inputs on both client and server side
- Sanitize inputs to prevent XSS attacks
- Validate URLs before storing
- Enforce maximum limits (200 items, 10 radars per user)

**Rate Limiting:**

- Implement rate limiting on API endpoints to prevent abuse
- Especially important for public endpoints (share token access)

**HTTPS:**

- Enforce HTTPS for all traffic
- Secure cookies with HttpOnly, Secure, and SameSite flags

### 7.6 Performance Optimization

**Frontend:**

- Lazy load tech item details (load on demand when clicked)
- Optimize radar rendering for large numbers of items (use Canvas or optimized SVG)
- Implement virtual scrolling for side panel list if many items
- Minimize bundle size (code splitting, tree shaking)

**Backend:**

- Index database queries (radarId, shareToken)
- Cache radar data for frequently accessed radars (Redis optional)
- Optimize database queries (avoid N+1 problems)

**Export:**

- Generate exports asynchronously for large radars
- Consider client-side export generation for images (html2canvas, svg2png)

### 7.7 Testing Strategy

**Unit Tests:**

- Test business logic and utility functions
- Target: 70%+ code coverage for critical paths

**Integration Tests:**

- Test API endpoints with database
- Test authentication flows

**End-to-End Tests:**

- Test critical user flows (create radar, add item, share link, export)
- Use Playwright or Cypress for E2E testing
- Test on multiple browsers and devices

**Accessibility Testing:**

- Use automated tools (axe, Lighthouse) for WCAG compliance
- Manual testing with keyboard navigation and screen readers

### 7.8 Browser Compatibility

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers:** Safari (iOS), Chrome (Android)
- **No support for:** Internet Explorer

---

## 8. Success Metrics

### 8.1 Primary Success Metric

**User Adoption Rate:**

- **Metric Definition:** Number of unique radars created per month
- **Target (3 months post-launch):** 100 radars created
- **Target (6 months post-launch):** 500 radars created
- **Measurement Method:** Track radar creation events in database

### 8.2 Secondary Success Metrics

**Collaboration Activity:**

- Number of shared links accessed per month
- Average number of contributors per radar (identified by IP or optional email)
- Number of tech items added by guest users

**Export Usage:**

- Number of exports per month (by format: PNG, SVG, PDF, JSON)
- Percentage of radars that have been exported at least once

**User Engagement:**

- Average number of tech items per radar
- Frequency of radar updates (items added/edited/deleted)
- Return user rate (percentage of users who create more than one radar)

**Technical Performance:**

- Page load time: <3 seconds on desktop, <5 seconds on mobile
- Radar rendering time: <2 seconds for radars with up to 100 items
- API response time: <500ms for 95th percentile

**Accessibility Compliance:**

- WCAG 2.1 Level AA compliance score: 100% (automated testing)
- Zero critical accessibility issues reported by users

### 8.3 User Satisfaction Metrics (Qualitative)

**User Feedback:**

- Collect feedback via in-app survey or feedback form
- Target: 80%+ of users find the application "easy to use"
- Target: 70%+ of users would recommend the tool to others

**Support Requests:**

- Track number of support requests or bug reports
- Target: <5% of users encounter blocking issues

### 8.4 Measurement and Tracking

**Analytics Implementation:**

- Implement basic analytics (e.g., Google Analytics, Plausible, or custom tracking)
- Track key events: radar creation, tech item addition, sharing, exports
- Privacy-conscious tracking (no PII collection for guest users)

**Dashboard:**

- Create internal admin dashboard to monitor success metrics
- Real-time visibility into key metrics (radars created, items added, exports)

---

## 9. Open Questions

The following questions require further clarification or decision-making before or during implementation:

### 9.1 Business and Product Questions

**Q1: Radar Naming and Uniqueness**

- Should radar names be unique globally, or can multiple radars share the same name?
- How should radars be identified in the user's dashboard (name only, or name + creation date)?

**Q2: Share Link Management**

- Should there be a way for the radar owner to revoke or regenerate a share link?
- What happens if a share link is accidentally made public (e.g., posted on social media)?

**Q3: Data Retention and Privacy**

- What is the data retention policy for inactive radars?
- Should users be able to permanently delete their radars and all associated data?
- Are there any GDPR or privacy compliance requirements we need to address?

**Q4: Monetization Strategy (Future)**

- Is this intended to be a free tool, freemium, or paid product?
- If freemium, what features would be premium (e.g., more radars, custom branding, advanced exports)?

### 9.2 Technical Questions

**Q5: Database Choice**

- Should we use PostgreSQL (relational) or MongoDB (document-based)?
- Are there specific performance or scalability requirements that would influence this decision?

**Q6: Hosting and Deployment**

- What is the preferred cloud provider (AWS, GCP, Azure, Vercel, Netlify)?
- Are there budget constraints for hosting and infrastructure?

**Q7: Export Implementation**

- Should exports be generated server-side or client-side?
- For PDF exports, should we include a detailed list of all tech items with descriptions, or just the visualization?

**Q8: Radar Visualization Library**

- Should we build the radar visualization from scratch using D3.js/Canvas, or explore existing libraries?
- Are there specific animation or interaction requirements beyond basic click/hover?

### 9.3 User Experience Questions

**Q9: Onboarding and Tutorials**

- Should there be an interactive tutorial for first-time users?
- Should we provide sample/template radars to help users get started?

**Q10: Tech Item Limits**

- The hard limit is 200 items per radar. Should users receive warnings before hitting this limit (e.g., at 150 items)?
- What is the user-facing error message when the limit is reached?

**Q11: Mobile Interaction**

- On mobile, should users be able to zoom/pan the radar visualization?
- How should tech item details be displayed on very small screens (modal, bottom sheet, full-screen view)?

**Q12: Conflict Resolution**

- For MVP, last write wins. Should we display a notification to users when their changes may have overwritten someone else's?
- Should we consider optimistic locking for post-MVP to prevent data loss?

### 9.4 Design and Accessibility Questions

**Q13: Visual Design System**

- Are there existing brand guidelines or design systems to follow?
- Should we create a custom design system or use an existing one (e.g., Material Design)?

**Q14: Color Coding**

- Should each quadrant have a distinct color, or should colors represent ring positions instead?
- Should users be able to customize quadrant colors (post-MVP)?

**Q15: Accessibility Edge Cases**

- How should screen readers navigate the radar visualization (list view alternative)?
- Should we provide a text-only or table view for users who cannot interact with the visual radar?

### 9.5 Scope and Priority Questions

**Q16: Ring Customization**

- The current spec has fixed ring names (Adopt, Trial, Assess, Hold). Should we allow users to customize ring names in MVP, or defer to post-MVP?
- If rings are customizable, should the number of rings also be customizable (e.g., 3 or 5 rings)?

**Q17: Category/Folder Functionality**

- The spec mentions folders/categories for organizing items in the side panel. Is this essential for MVP, or can it be simplified to a flat list?
- How should categories be managed (predefined list, user-created, both)?

**Q18: Authentication Scope**

- The spec suggests magic links or Google OAuth for owners. Is email/password authentication needed, or is passwordless sufficient?
- Should guest users have an option to "claim" or register after contributing to a radar?

**Q19: Export Format Priorities**

- Which export format is most critical for MVP: PNG, SVG, PDF, or JSON?
- Can we de-scope any export formats to post-MVP to accelerate delivery?

### 9.6 Post-MVP Considerations

**Q20: Feature Prioritization**

- After MVP launch, what is the top priority feature to add first?
  - Real-time collaboration indicators?
  - Version history?
  - Advanced permissions?
  - Commenting/discussions?

**Q21: Integration Needs**

- Are there specific tools or platforms we should plan to integrate with post-MVP (e.g., Slack, Confluence, GitHub)?

---

## Appendix A: Key User Workflows (Detailed)

### Workflow 1: Creating a New Tech Radar

**Actor:** Technology Leader (first-time user)

**Preconditions:** User has navigated to the application landing page.

**Steps:**

1. User clicks "Create New Radar" button on landing page
2. System displays a modal/form asking for radar name
3. User enters radar name (e.g., "Q4 2025 Tech Stack")
4. User clicks "Create" button
5. System creates a new radar with default quadrants and rings
6. System generates a unique share token for the radar
7. System redirects user to the radar view
8. System displays the empty radar with default structure
9. System shows a tooltip or inline hint: "Add your first technology to get started"

**Postconditions:**

- New radar exists in the database
- User can see their radar with default quadrants (Tools, Techniques, Platforms, Languages & Frameworks) and rings (Adopt, Trial, Assess, Hold)
- User has a shareable link available

**Alternative Flows:**

- **A1: User cancels creation** - System returns to landing page without creating a radar
- **A2: User has reached radar limit (10 radars)** - System displays error message: "You've reached the maximum of 10 radars. Please delete an existing radar to create a new one."

---

### Workflow 2: Customizing Quadrants

**Actor:** Radar Creator or Guest Contributor

**Preconditions:** User has a radar open.

**Steps:**

1. User clicks "Customize" or "Settings" button in top navigation
2. System displays a modal with 4 input fields, each containing current quadrant names
3. User edits one or more quadrant names (e.g., changes "Languages & Frameworks" to "Backend Tech")
4. (Optional) System shows a live preview of the radar with updated labels
5. User clicks "Save Changes" button
6. System validates that all 4 quadrant names are provided (not empty)
7. System updates the radar configuration in the database
8. System closes the modal and refreshes the radar view
9. System displays a success message: "Quadrant names updated successfully"

**Postconditions:**

- Radar quadrants reflect the new custom names
- All existing tech items remain in their assigned quadrants (quadrant index unchanged)

**Alternative Flows:**

- **A1: User leaves a quadrant name empty** - System displays validation error: "All quadrant names are required"
- **A2: User clicks "Cancel"** - System discards changes and closes modal without updating

---

### Workflow 3: Adding a Tech Item to the Radar

**Actor:** Radar Creator or Guest Contributor

**Preconditions:** User has a radar open.

**Steps:**

1. User clicks "Add Item" button in the side panel
2. System displays a form with the following fields:
   - Name (text input, required, marked with \*)
   - Category/Quadrant (dropdown, required, options: 4 custom quadrant names)
   - Ring Position (dropdown, required, options: Adopt, Trial, Assess, Hold)
   - Description (textarea, optional)
   - Link/URL (text input, optional)
3. User enters tech item details (e.g., Name: "React", Quadrant: "Languages & Frameworks", Ring: "Adopt")
4. User clicks "Save" button
5. System validates that required fields are filled
6. System checks if radar has reached the 200-item limit
7. System creates a new tech item record in the database
8. System automatically positions the blip within the assigned quadrant and ring
9. System refreshes the radar visualization, showing the new blip
10. System displays a success message: "Tech item added successfully"
11. System clears the form for adding another item

**Postconditions:**

- New tech item is visible on the radar as a blip
- Tech item is listed in the side panel
- Tech item count increments (now visible as "X/200 items")

**Alternative Flows:**

- **A1: User clicks "Cancel"** - System closes the form without saving
- **A2: Required fields are missing** - System displays validation errors: "Please fill in all required fields"
- **A3: Radar has 200 items** - System displays error: "This radar has reached the maximum of 200 items. Please delete an item to add a new one."
- **A4: URL is invalid format** - System displays warning: "Please enter a valid URL (e.g., https://example.com)" (optional validation)

---

### Workflow 4: Inviting Team Members to Collaborate

**Actor:** Radar Creator or Guest Contributor (anyone with the link)

**Preconditions:** User has a radar open.

**Steps:**

1. User clicks "Share" button in top navigation
2. System displays a modal with the shareable link prominently shown
3. System provides a "Copy Link" button next to the link
4. User clicks "Copy Link" button
5. System copies the full URL to the user's clipboard
6. System displays a confirmation message: "Link copied to clipboard!"
7. User shares the link via email, Slack, or other communication channel (outside the application)
8. Recipient clicks the shared link
9. System opens the radar (no authentication required)
10. Recipient can immediately view and edit the radar

**Postconditions:**

- Invited user has access to the radar via the shared link
- No record of the invitation is stored (public link model)

**Alternative Flows:**

- **A1: User manually copies the link** - System provides a selectable text field with the full URL
- **A2: User closes the modal without copying** - No action taken; link remains accessible via "Share" button

---

### Workflow 5: Viewing and Interacting with a Shared Radar

**Actor:** Guest Contributor (invited team member)

**Preconditions:** User has received a shareable link via email or other channel.

**Steps:**

1. User clicks the shareable link in their email/message
2. System loads the radar in the user's browser (no login prompt)
3. System displays the radar visualization with all tech items
4. User can see the radar name, quadrants, rings, and tech item blips
5. User hovers over a blip to see a tooltip with the tech item name
6. User clicks on a blip to view full details (name, description, URL)
7. System displays a detail modal or side panel with complete tech item information
8. User can click the URL link (if provided) to open the reference documentation in a new tab
9. User can click "Edit" in the detail view to modify the tech item
10. User can click "Add Item" to contribute new technologies to the radar

**Postconditions:**

- User understands the team's technology landscape
- User can contribute by adding or editing tech items

**Alternative Flows:**

- **A1: Shareable link is invalid or expired** - System displays error: "Radar not found" (though links don't expire in MVP)
- **A2: User accesses on mobile device** - Radar adapts to mobile view with collapsible side panel drawer

---

### Workflow 6: Exporting a Radar

**Actor:** Radar Creator or Guest Contributor

**Preconditions:** User has a radar open with at least some tech items.

**Steps:**

1. User clicks "Export" button in top navigation
2. System displays a dropdown menu with export options: PNG, SVG, PDF, JSON
3. User selects desired format (e.g., "Export as PNG")
4. System generates the export file (this may take a few seconds for complex radars)
5. System displays a loading indicator: "Generating export..."
6. System triggers a browser download of the exported file
7. File is saved to the user's default download location (e.g., "tech-radar-2025-10-27.png")
8. System displays a success message: "Radar exported successfully"

**Postconditions:**

- User has a local copy of the radar in the selected format
- User can share the exported file via email, presentations, or documentation

**Alternative Flows:**

- **A1: Export generation fails** - System displays error: "Export failed. Please try again or contact support."
- **A2: User selects JSON export** - System downloads a JSON file containing all radar data (tech items, quadrants, rings, metadata)
- **A3: User selects PDF export** - System generates a PDF with the radar visualization and optionally a list of tech items with descriptions

**Export File Examples:**

- **PNG/SVG:** High-resolution image of the radar visualization
- **PDF:** Multi-page document with radar on first page, tech item list on subsequent pages
- **JSON:** Structured data file for backup or migration:
  ```json
  {
    "radarName": "Q4 2025 Tech Stack",
    "quadrants": ["Tools", "Techniques", "Platforms", "Languages & Frameworks"],
    "rings": ["Adopt", "Trial", "Assess", "Hold"],
    "techItems": [
      {
        "name": "React",
        "quadrant": "Languages & Frameworks",
        "ring": "Adopt",
        "description": "JavaScript library for building UIs",
        "url": "https://react.dev"
      },
      ...
    ]
  }
  ```

---

## Appendix B: Glossary

**Blip:** A visual representation of a tech item on the radar, typically displayed as a dot or small circle.

**Guest Contributor:** A user who accesses a radar via a shared link without authentication. Has full edit permissions.

**MVP (Minimum Viable Product):** The initial version of the application with core features only, intended for early user feedback.

**Quadrant:** One of four sections of the radar diagram, used to categorize technologies (default: Tools, Techniques, Platforms, Languages & Frameworks).

**Radar:** A circular diagram divided into quadrants and rings, used to visualize technology adoption and maturity.

**Ring:** One of four concentric circles on the radar, representing the adoption stage (default: Adopt, Trial, Assess, Hold).

**Share Token:** A unique identifier embedded in the shareable link, used to grant access to a specific radar.

**Shareable Link:** A public URL that provides access to a radar without authentication.

**Tech Item:** A technology, tool, service, or framework represented on the radar.

**Tech Stack:** The collection of technologies, tools, and frameworks used by a team or organization.

**WCAG (Web Content Accessibility Guidelines):** A set of recommendations for making web content more accessible to people with disabilities.

---

## Document History

| Version | Date       | Author      | Changes                                                                 |
| ------- | ---------- | ----------- | ----------------------------------------------------------------------- |
| 1.0     | 2025-10-27 | Claude Code | Initial PRD draft based on user specifications and clarifying questions |

---

**End of Document**
