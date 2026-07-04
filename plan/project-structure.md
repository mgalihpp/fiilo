# Fiilo Web App - Project Structure

## Root Structure

```
fiilo/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # App pages (authenticated)
│   ├── (marketing)/              # Public pages
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── lib/                          # Shared libraries & utilities
├── stores/                       # Zustand state stores
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   ├── dashboard/                # Dashboard layout components
│   ├── contacts/                 # Contact module components
│   ├── leads/                    # Lead module components
│   ├── deals/                    # Deal module components
│   ├── invoices/                 # Invoice module components
│   ├── reports/                  # Report module components
│   ├── ai/                       # AI feature components
│   └── settings/                 # Settings components
│
├── prisma/                       # Prisma schema & migrations
│   └── schema.prisma
│
├── public/                       # Static assets
├── plan/                         # Implementation plan
├── package.json
├── tsconfig.json
├── biome.json
├── next.config.ts
└── postcss.config.mjs
```

## Detailed Structure

### app/(auth) - Authentication Pages

```
app/(auth)/
├── layout.tsx                    # Auth layout (centered card)
├── login/
│   └── [[...login]]/
│       └── page.tsx              # Clerk SignIn component
├── register/
│   └── [[...register]]/
│       └── page.tsx              # Clerk SignUp component
└── forgot-password/
    └── page.tsx                  # Clerk password reset
```

### app/(dashboard) - Dashboard Pages

```
app/(dashboard)/
├── layout.tsx                    # Dashboard shell (Sidebar + TopBar)
├── page.tsx                      # Dashboard home (KPIs, charts)
│
├── contacts/
│   ├── page.tsx                  # Contact list with search/filter
│   ├── new/
│   │   └── page.tsx              # Create contact form
│   └── [id]/
│       ├── page.tsx              # Contact detail view
│       └── edit/
│           └── page.tsx          # Edit contact form
│
├── leads/
│   ├── page.tsx                  # Lead list with filters
│   ├── new/
│   │   └── page.tsx              # Create lead form
│   └── [id]/
│       ├── page.tsx              # Lead detail view
│       └── edit/
│           └── page.tsx          # Edit lead form
│
├── deals/
│   ├── page.tsx                  # Deal list view
│   ├── new/
│   │   └── page.tsx              # Create deal form
│   └── [id]/
│       ├── page.tsx              # Deal detail view
│       └── edit/
│           └── page.tsx          # Edit deal form
│
├── pipeline/
│   └── page.tsx                  # Kanban board view
│
├── tasks/
│   ├── page.tsx                  # Task list view
│   ├── calendar/
│   │   └── page.tsx              # Calendar view
│   └── [id]/
│       └── page.tsx              # Task detail
│
├── invoices/
│   ├── page.tsx                  # Invoice list
│   ├── new/
│   │   └── page.tsx              # Create invoice
│   └── [id]/
│       ├── page.tsx              # Invoice detail
│       └── edit/
│           └── page.tsx          # Edit invoice
│
├── payments/
│   └── page.tsx                  # Payment history
│
├── reports/
│   ├── page.tsx                  # Reports overview
│   ├── sales/
│   │   └── page.tsx              # Sales report
│   ├── performance/
│   │   └── page.tsx              # Performance report
│   └── revenue/
│       └── page.tsx              # Revenue report
│
├── ai-chat/
│   └── page.tsx                  # AI assistant chat
│
├── team/
│   └── page.tsx                  # Team management
│
├── settings/
│   ├── page.tsx                  # User settings
│   ├── profile/
│   │   └── page.tsx              # Profile settings
│   └── security/
│       └── page.tsx              # Security settings
│
└── billing/
    └── page.tsx                  # Subscription & billing
```

### app/(marketing) - Public Pages

```
app/(marketing)/
├── page.tsx                      # Landing page (existing)
├── pricing/
│   └── page.tsx                  # Pricing comparison
├── blog/
│   ├── page.tsx                  # Blog listing
│   └── [slug]/
│       └── page.tsx              # Blog post
├── contact/
│   └── page.tsx                  # Contact form
└── faq/
    └── page.tsx                  # FAQ page
```

### app/api - API Routes

```
app/api/
├── contacts/
│   ├── route.ts                  # GET (list), POST (create)
│   └── [id]/
│       └── route.ts              # GET, PUT, DELETE
│
├── leads/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
│
├── deals/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
│
├── pipeline/
│   ├── route.ts                  # GET (list pipelines)
│   └── [id]/
│       └── route.ts              # GET, PUT, DELETE pipeline
│
├── tasks/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
│
├── invoices/
│   ├── route.ts
│   ├── [id]/
│   │   └── route.ts
│   └── [id]/
│       └── pdf/
│           └── route.ts          # Generate PDF
│
├── payments/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
│
├── ai/
│   ├── chat/
│   │   └── route.ts              # AI chat endpoint
│   ├── score/
│   │   └── route.ts              # Lead scoring
│   ├── forecast/
│   │   └── route.ts              # Deal forecasting
│   └── enrich/
│       └── route.ts              # Contact enrichment
│
├── stripe/
│   ├── checkout/
│   │   └── route.ts              # Create checkout session
│   ├── portal/
│   │   └── route.ts              # Customer portal
│   └── webhook/
│       └── route.ts              # Stripe webhooks
│
├── team/
│   ├── route.ts                  # Team CRUD
│   └── invite/
│       └── route.ts              # Invite member
│
├── upload/
│   └── route.ts                  # File upload handler
│
└── reports/
    ├── sales/
    │   └── route.ts              # Generate sales report
    └── export/
        └── route.ts              # Export data
```

### lib - Shared Libraries

```
lib/
├── prisma.ts                     # Prisma client singleton
├── clerk.ts                      # Clerk utilities
├── stripe.ts                     # Stripe client
├── openai.ts                     # OpenAI client
├── utils.ts                      # General utilities
├── constants.ts                  # App constants
├── validations.ts                # Zod schemas
└── hooks/                        # Custom React hooks
    ├── useDebounce.ts
    ├── usePagination.ts
    └── useMediaQuery.ts
```

### stores - Zustand State

```
stores/
├── useAuthStore.ts               # Auth state & user info
├── useContactStore.ts            # Contact CRUD state
├── useLeadStore.ts               # Lead CRUD state
├── useDealStore.ts               # Deal CRUD state
├── useInvoiceStore.ts            # Invoice CRUD state
├── useTaskStore.ts               # Task CRUD state
├── usePipelineStore.ts           # Pipeline state
├── useNotificationStore.ts       # Notifications state
└── useUIStore.ts                 # UI state (sidebar, modals, theme)
```

### components/ui - Base UI Components

```
components/ui/
├── DataTable.tsx                 # Reusable data table with sorting/filtering
├── StatsCard.tsx                 # KPI stats card
├── ChartCard.tsx                 # Chart wrapper component
├── Modal.tsx                     # Modal dialog
├── ConfirmDialog.tsx             # Confirmation dialog
├── EmptyState.tsx                # Empty state placeholder
├── LoadingSpinner.tsx            # Loading spinner
├── SkeletonLoader.tsx            # Skeleton loading state
├── SearchInput.tsx               # Search input with debounce
├── SelectFilter.tsx              # Select dropdown filter
├── DateRangePicker.tsx           # Date range picker
├── FileUpload.tsx                # File upload component
├── MarkdownEditor.tsx            # Markdown editor
└── CurrencyInput.tsx             # Currency input field
```

### components/dashboard - Dashboard Layout

```
components/dashboard/
├── Sidebar.tsx                   # Left sidebar navigation
├── TopBar.tsx                    # Top navigation bar
├── KPICards.tsx                  # KPI summary cards
├── RevenueChart.tsx              # Revenue line chart
├── DealPipelineChart.tsx         # Pipeline donut chart
├── RecentActivity.tsx            # Recent activity feed
└── QuickActions.tsx              # Quick action buttons
```

### components/contacts - Contact Module

```
components/contacts/
├── ContactForm.tsx               # Create/edit contact form
├── ContactTable.tsx              # Contact list table
├── ContactCard.tsx               # Contact card view
├── ContactFilters.tsx            # Contact filters
└── ContactTimeline.tsx           # Contact activity timeline
```

### components/leads - Lead Module

```
components/leads/
├── LeadForm.tsx                  # Create/edit lead form
├── LeadTable.tsx                 # Lead list table
├── LeadCard.tsx                  # Lead card view
├── LeadScoreBadge.tsx            # AI score badge
├── LeadFilters.tsx               # Lead filters
└── LeadTimeline.tsx              # Lead activity timeline
```

### components/deals - Deal Module

```
components/deals/
├── DealForm.tsx                  # Create/edit deal form
├── DealCard.tsx                  # Deal card (Kanban)
├── DealTable.tsx                 # Deal list table
├── PipelineBoard.tsx             # Kanban board
├── PipelineColumn.tsx            # Pipeline column
├── DealFilters.tsx               # Deal filters
└── DealForecast.tsx              # AI forecast display
```

### components/invoices - Invoice Module

```
components/invoices/
├── InvoiceForm.tsx               # Create/edit invoice form
├── InvoiceTable.tsx              # Invoice list table
├── InvoiceCard.tsx               # Invoice detail card
├── InvoiceItems.tsx              # Invoice line items
├── InvoicePDF.tsx                # PDF generation
├── InvoiceFilters.tsx            # Invoice filters
└── PaymentForm.tsx               # Record payment form
```

### components/ai - AI Features

```
components/ai/
├── ChatWindow.tsx                # Chat container
├── ChatMessage.tsx               # Individual message
├── ChatInput.tsx                 # Message input
├── ChatSidebar.tsx               # Chat history sidebar
├── InsightCard.tsx               # AI insight card
└── SuggestionList.tsx            # AI suggestions list
```

## Route Group Summary

| Route Group | Purpose | Auth Required |
|-------------|---------|:-------------:|
| `(auth)` | Login, Register | No |
| `(dashboard)` | App pages | Yes |
| `(marketing)` | Public pages | No |
| `api/*` | API endpoints | Varies |

## Component Naming Convention

- PascalCase for components: `ContactForm.tsx`
- camelCase for utilities: `formatDate.ts`
- kebab-case for API routes: `/api/leads/`
- Singular for models: `Contact`, `Lead`, `Deal`
- Plural for route folders: `contacts/`, `leads/`, `deals/`
