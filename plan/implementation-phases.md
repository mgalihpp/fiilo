# Fiilo Web App - Implementation Phases

## Overview

12 phases selama ~18 minggu untuk mengubah landing page menjadi web app fungsional.

---

## Phase 1: Foundation & Auth (Minggu 1-2)

**Goal:** Setup infrastructure, authentication, dashboard layout

### Tasks

#### 1.1 Project Setup
- [ ] Install dependencies: `prisma`, `@prisma/client`, `@clerk/nextjs`, `antd`, `@ant-design/icons`, `@ant-design/charts`, `zustand`, `openai`, `stripe`
- [ ] Configure `next.config.ts` untuk Ant Design (transpilePackages)
- [ ] Setup environment variables template `.env.example`
- [ ] Setup Prisma with MongoDB provider

#### 1.2 Database Setup
- [ ] Create `prisma/schema.prisma` dengan semua models
- [ ] Run `prisma db push` untuk sync schema ke MongoDB
- [ ] Create `lib/prisma.ts` singleton client
- [ ] Test database connection

#### 1.3 Clerk Authentication
- [ ] Setup Clerk provider di `app/layout.tsx`
- [ ] Create middleware.ts untuk auth protection
- [ ] Create `(auth)/login/[[...login]]/page.tsx`
- [ ] Create `(auth)/register/[[...register]]/page.tsx`
- [ ] Create `(auth)/forgot-password/page.tsx`
- [ ] Setup user sync to MongoDB on sign-up

#### 1.4 Dashboard Layout
- [ ] Create `(dashboard)/layout.tsx` dengan Sidebar + TopBar
- [ ] Create `components/dashboard/Sidebar.tsx` (Ant Design Menu)
- [ ] Create `components/dashboard/TopBar.tsx` (Clerk UserButton)
- [ ] Create responsive sidebar toggle

#### 1.5 Zustand Stores
- [ ] Create `stores/useAuthStore.ts`
- [ ] Create `stores/useUIStore.ts`

#### 1.6 Shared Components
- [ ] Create `components/ui/DataTable.tsx`
- [ ] Create `components/ui/StatsCard.tsx`
- [ ] Create `components/ui/EmptyState.tsx`
- [ ] Create `components/ui/LoadingSpinner.tsx`

### Deliverables
- [ ] User bisa register/login via Clerk
- [ ] Dashboard shell dengan sidebar navigasi
- [ ] Prisma client working
- [ ] MongoDB connection established

---

## Phase 2: CRM - Contacts & Leads (Minggu 3-4)

**Goal:** CRUD contacts, lead management, basic AI scoring

### Tasks

#### 2.1 Contacts Module
- [ ] Create `app/api/contacts/route.ts` (GET, POST)
- [ ] Create `app/api/contacts/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Create `components/contacts/ContactTable.tsx`
- [ ] Create `components/contacts/ContactForm.tsx`
- [ ] Create `components/contacts/ContactFilters.tsx`
- [ ] Create `app/(dashboard)/contacts/page.tsx`
- [ ] Create `app/(dashboard)/contacts/[id]/page.tsx`
- [ ] Implement search & pagination

#### 2.2 Leads Module
- [ ] Create `app/api/leads/route.ts`
- [ ] Create `app/api/leads/[id]/route.ts`
- [ ] Create `components/leads/LeadTable.tsx`
- [ ] Create `components/leads/LeadForm.tsx`
- [ ] Create `components/leads/LeadScoreBadge.tsx`
- [ ] Create `components/leads/LeadFilters.tsx`
- [ ] Create `app/(dashboard)/leads/page.tsx`
- [ ] Create `app/(dashboard)/leads/[id]/page.tsx`

#### 2.3 Activities Module
- [ ] Create `app/api/activities/route.ts`
- [ ] Create activity logging system
- [ ] Create `components/contacts/ContactTimeline.tsx`
- [ ] Create `components/leads/LeadTimeline.tsx`

#### 2.4 Import/Export
- [ ] CSV import for contacts
- [ ] CSV export for contacts & leads
- [ ] File upload component

#### 2.5 Zustand Stores
- [ ] Create `stores/useContactStore.ts`
- [ ] Create `stores/useLeadStore.ts`

### Deliverables
- [ ] Contact management CRUD
- [ ] Lead management CRUD
- [ ] Activity logging
- [ ] Search, filter, pagination
- [ ] CSV import/export

---

## Phase 3: Deal Pipeline (Minggu 5-6)

**Goal:** Kanban board, deal management, pipeline visualization

### Tasks

#### 3.1 Pipeline Module
- [ ] Create `app/api/pipeline/route.ts`
- [ ] Create `app/api/pipeline/[id]/route.ts`
- [ ] Create `stores/usePipelineStore.ts`

#### 3.2 Deals Module
- [ ] Create `app/api/deals/route.ts`
- [ ] Create `app/api/deals/[id]/route.ts`
- [ ] Create `components/deals/DealForm.tsx`
- [ ] Create `components/deals/DealTable.tsx`
- [ ] Create `components/deals/DealCard.tsx`
- [ ] Create `components/deals/DealFilters.tsx`
- [ ] Create `app/(dashboard)/deals/page.tsx`
- [ ] Create `app/(dashboard)/deals/[id]/page.tsx`

#### 3.3 Kanban Board
- [ ] Create `components/deals/PipelineBoard.tsx`
- [ ] Create `components/deals/PipelineColumn.tsx`
- [ ] Implement drag-and-drop (dnd-kit atau antd DndContext)
- [ ] Create `app/(dashboard)/pipeline/page.tsx`

#### 3.4 Deal Analytics
- [ ] Win rate calculation
- [ ] Conversion funnel
- [ ] Average deal size
- [ ] Pipeline value chart

#### 3.5 Zustand Stores
- [ ] Create `stores/useDealStore.ts`

### Deliverables
- [ ] Pipeline Kanban board (drag-and-drop)
- [ ] Deal CRUD
- [ ] Pipeline analytics charts
- [ ] Deal stages management

---

## Phase 4: Task & Activity Management (Minggu 7)

**Goal:** Task system, activity logging, reminders

### Tasks

#### 4.1 Tasks Module
- [ ] Create `app/api/tasks/route.ts`
- [ ] Create `app/api/tasks/[id]/route.ts`
- [ ] Create task CRUD UI components
- [ ] Create `app/(dashboard)/tasks/page.tsx`

#### 4.2 Task Features
- [ ] Task assignment (to self or team member)
- [ ] Task status management (pending, in progress, completed)
- [ ] Task priority levels
- [ ] Due date & reminders

#### 4.3 Calendar View
- [ ] Create `app/(dashboard)/tasks/calendar/page.tsx`
- [ ] Monthly/weekly calendar display
- [ ] Task drag to reschedule

#### 4.4 Activity Integration
- [ ] Link tasks to leads/deals
- [ ] Activity timeline aggregation
- [ ] Automated follow-up reminders

### Deliverables
- [ ] Task manager page
- [ ] Calendar view
- [ ] Activity logging
- [ ] Reminder system

---

## Phase 5: Invoicing & Payments (Minggu 8-9)

**Goal:** Invoice generation, payment tracking, bulk payments

### Tasks

#### 5.1 Invoices Module
- [ ] Create `app/api/invoices/route.ts`
- [ ] Create `app/api/invoices/[id]/route.ts`
- [ ] Create `app/api/invoices/[id]/pdf/route.ts`
- [ ] Create `components/invoices/InvoiceForm.tsx`
- [ ] Create `components/invoices/InvoiceTable.tsx`
- [ ] Create `components/invoices/InvoiceItems.tsx`
- [ ] Create `app/(dashboard)/invoices/page.tsx`
- [ ] Create `app/(dashboard)/invoices/[id]/page.tsx`

#### 5.2 Invoice Features
- [ ] Line items management
- [ ] Tax calculation
- [ ] Invoice status workflow (Draft → Sent → Paid)
- [ ] PDF generation (html2pdf atau jspdf)

#### 5.3 Payments Module
- [ ] Create `app/api/payments/route.ts`
- [ ] Create payment recording UI
- [ ] Create `app/(dashboard)/payments/page.tsx`
- [ ] Payment history & filters

#### 5.4 Bulk Payments
- [ ] Multi-select invoices
- [ ] Bulk payment processing
- [ ] Batch status updates

#### 5.5 Auto-Invoice
- [ ] Generate invoice from won deal
- [ ] Link invoice to deal
- [ ] Auto-calculate from deal value

### Deliverables
- [ ] Invoice management page
- [ ] PDF generation
- [ ] Payment tracking
- [ ] Bulk payments
- [ ] Auto-invoice from deals

---

## Phase 6: AI Features (Minggu 10-11)

**Goal:** AI chat, smart insights, contact enrichment

### Tasks

#### 6.1 OpenAI Setup
- [ ] Create `lib/openai.ts` client
- [ ] Create `app/api/ai/chat/route.ts`
- [ ] Create `app/api/ai/score/route.ts`
- [ ] Create `app/api/ai/forecast/route.ts`
- [ ] Create `app/api/ai/enrich/route.ts`

#### 6.2 AI Chat
- [ ] Create `components/ai/ChatWindow.tsx`
- [ ] Create `components/ai/ChatMessage.tsx`
- [ ] Create `components/ai/ChatInput.tsx`
- [ ] Create `components/ai/ChatSidebar.tsx`
- [ ] Create `app/(dashboard)/ai-chat/page.tsx`
- [ ] Implement streaming responses

#### 6.3 Lead Scoring
- [ ] Analyze contact data with AI
- [ ] Calculate lead score based on:
  - Company size
  - Engagement level
  - Deal history
  - Industry fit
- [ ] Display score badge on leads

#### 6.4 Deal Forecasting
- [ ] Predict deal close probability
- [ ] Revenue forecast based on pipeline
- [ ] Risk assessment
- [ ] Display forecast on deal cards

#### 6.5 Contact Enrichment
- [ ] Auto-enrich contacts with company data
- [ ] Find additional contact info
- [ ] Company insights

#### 6.6 Smart Suggestions
- [ ] AI recommends next actions
- [ ] Suggest optimal follow-up timing
- [ ] Risk alerts for deals

### Deliverables
- [ ] AI Chat page
- [ ] Natural language query
- [ ] Lead scoring
- [ ] Deal forecasting
- [ ] Contact enrichment
- [ ] Smart suggestions

---

## Phase 7: Reports & Analytics (Minggu 12)

**Goal:** Dashboard analytics, exportable reports

### Tasks

#### 7.1 Dashboard
- [ ] Create dashboard KPI cards
- [ ] Revenue chart (line)
- [ ] Deal pipeline chart (donut)
- [ ] Recent activity feed
- [ ] Quick actions

#### 7.2 Reports Module
- [ ] Create `app/api/reports/sales/route.ts`
- [ ] Create `app/api/reports/export/route.ts`
- [ ] Create `app/(dashboard)/reports/page.tsx`
- [ ] Create `app/(dashboard)/reports/sales/page.tsx`
- [ ] Create `app/(dashboard)/reports/performance/page.tsx`
- [ ] Create `app/(dashboard)/reports/revenue/page.tsx`

#### 7.3 Report Types
- [ ] Sales by period (daily, weekly, monthly)
- [ ] Sales by representative
- [ ] Sales by pipeline stage
- [ ] Team performance metrics
- [ ] Revenue trends

#### 7.4 Charts
- [ ] Line charts (revenue trends)
- [ ] Bar charts (comparison)
- [ ] Pie charts (distribution)
- [ ] Area charts (cumulative)

#### 7.5 Export
- [ ] PDF export
- [ ] CSV export
- [ ] Scheduled reports (email)

### Deliverables
- [ ] Dashboard with KPI cards
- [ ] Sales reports page
- [ ] Performance analytics
- [ ] Charts and visualizations
- [ ] Export functionality

---

## Phase 8: Team & RBAC (Minggu 13)

**Goal:** Team management, role-based access

### Tasks

#### 8.1 Team Module
- [ ] Create `app/api/team/route.ts`
- [ ] Create `app/api/team/invite/route.ts`
- [ ] Create team management UI
- [ ] Create `app/(dashboard)/team/page.tsx`

#### 8.2 Team Features
- [ ] Invite members via email
- [ ] Remove members
- [ ] Change member roles
- [ ] View team activity

#### 8.3 RBAC
- [ ] Implement role-based permissions
- [ ] Admin: full access
- [ ] Manager: manage team, view all data
- [ ] User: own data only

#### 8.4 Notifications
- [ ] Create notification system
- [ ] In-app notifications
- [ ] Email notifications (optional)

### Deliverables
- [ ] Team management page
- [ ] Role-based access control
- [ ] Notification system
- [ ] Team analytics

---

## Phase 9: Subscription & Billing (Minggu 14)

**Goal:** Stripe subscriptions, billing portal

### Tasks

#### 9.1 Stripe Setup
- [ ] Create `lib/stripe.ts` client
- [ ] Create `app/api/stripe/checkout/route.ts`
- [ ] Create `app/api/stripe/portal/route.ts`
- [ ] Create `app/api/stripe/webhook/route.ts`

#### 9.2 Subscription Flow
- [ ] Create checkout session
- [ ] Handle success/cancel redirect
- [ ] Sync subscription status to DB

#### 9.3 Billing Portal
- [ ] Create `app/(dashboard)/billing/page.tsx`
- [ ] View current plan
- [ ] Update payment method
- [ ] Cancel subscription
- [ ] View invoices

#### 9.4 Webhook Handlers
- [ ] `checkout.session.completed`
- [ ] `invoice.paid`
- [ ] `invoice.payment_failed`
- [ ] `customer.subscription.updated`
- [ ] `customer.subscription.deleted`

#### 9.5 Plan Enforcement
- [ ] Feature gating based on plan
- [ ] Upgrade prompts
- [ ] Usage limits

### Deliverables
- [ ] Billing page
- [ ] Stripe subscription flow
- [ ] Webhook handlers
- [ ] Feature gating

---

## Phase 10: Marketing Pages (Minggu 15)

**Goal:** Public pages for SEO and conversion

### Tasks

#### 10.1 Pricing Page
- [ ] Create `app/(marketing)/pricing/page.tsx`
- [ ] Dynamic pricing display
- [ ] Plan comparison table
- [ ] CTA buttons

#### 10.2 Blog
- [ ] Create `app/(marketing)/blog/page.tsx`
- [ ] Create `app/(marketing)/blog/[slug]/page.tsx`
- [ ] MDX support for blog posts
- [ ] SEO optimization

#### 10.3 Contact Page
- [ ] Create `app/(marketing)/contact/page.tsx`
- [ ] Contact form
- [ ] Form validation
- [ ] Email notification

#### 10.4 FAQ Page
- [ ] Create `app/(marketing)/faq/page.tsx`
- [ ] Dynamic FAQ from database
- [ ] Search/filter FAQ

### Deliverables
- [ ] Pricing page
- [ ] Blog system
- [ ] Contact page
- [ ] FAQ page

---

## Phase 11: Polish & Optimization (Minggu 16-17)

**Goal:** Performance, accessibility, mobile

### Tasks

#### 11.1 Mobile Responsive
- [ ] Responsive sidebar (drawer on mobile)
- [ ] Responsive tables (card view on mobile)
- [ ] Touch-friendly interactions
- [ ] Mobile navigation

#### 11.2 Performance
- [ ] Image optimization (Next/Image)
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Caching strategy

#### 11.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Color contrast

#### 11.4 Error Handling
- [ ] Error boundaries
- [ ] Fallback UI
- [ ] Toast notifications
- [ ] Form validation messages

#### 11.5 Loading States
- [ ] Skeleton loaders
- [ ] Page transitions
- [ ] Optimistic updates

### Deliverables
- [ ] Mobile responsive dashboard
- [ ] Performance optimization
- [ ] Error handling
- [ ] Loading states

---

## Phase 12: Testing & Deployment (Minggu 18)

**Goal:** Testing, CI/CD, production deployment

### Tasks

#### 12.1 Unit Tests
- [ ] Setup Vitest
- [ ] Test utilities
- [ ] Test stores
- [ ] Test API routes

#### 12.2 Integration Tests
- [ ] Test CRUD operations
- [ ] Test auth flow
- [ ] Test payment flow

#### 12.3 E2E Tests
- [ ] Setup Playwright
- [ ] Test critical user flows
- [ ] Test responsive design

#### 12.4 CI/CD
- [ ] GitHub Actions workflow
- [ ] Lint on PR
- [ ] Test on PR
- [ ] Auto-deploy to Vercel

#### 12.5 Deployment
- [ ] Environment variables setup
- [ ] Domain configuration
- [ ] SSL certificate
- [ ] Monitoring setup

### Deliverables
- [ ] Test suite
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring

---

## Timeline Summary

```
Minggu  1-2  : Phase 1  - Foundation & Auth
Minggu  3-4  : Phase 2  - Contacts & Leads
Minggu  5-6  : Phase 3  - Deal Pipeline
Minggu  7    : Phase 4  - Tasks & Activities
Minggu  8-9  : Phase 5  - Invoicing & Payments
Minggu 10-11 : Phase 6  - AI Features
Minggu 12    : Phase 7  - Reports & Analytics
Minggu 13    : Phase 8  - Team & RBAC
Minggu 14    : Phase 9  - Subscription & Billing
Minggu 15    : Phase 10 - Marketing Pages
Minggu 16-17 : Phase 11 - Polish & Optimization
Minggu 18    : Phase 12 - Testing & Deployment
```

## Dependencies

```
Phase 1 ─┬─> Phase 2 ─┬─> Phase 3 ─┬─> Phase 4
          │            │            │
          └────────────┴────────────┴─> Phase 5 ─┬─> Phase 6
                                                  │
                                                  └─> Phase 7 ─┬─> Phase 8
                                                                │
                                                                └─> Phase 9 ─┬─> Phase 10
                                                                              │
                                                                              └─> Phase 11 ─┬─> Phase 12
```

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Clerk pricing | Use free tier (10k MAU), implement usage tracking |
| OpenAI costs | Use GPT-4o-mini for most tasks, cache responses |
| MongoDB limits | Monitor storage, implement data archival |
| Stripe fees | Factor into pricing, use Stripe Atlas |
| Performance | Implement caching, optimize queries, use indexes |
