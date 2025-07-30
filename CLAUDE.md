# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Overview

This is a fullstack challenge project for **Minerva**, a serious and selective YC-backed AI startup focused on transforming SMB accounting.

The objective is to **build a production-grade system** with excellent product instincts, strong UX awareness, and a clean, minimalist visual design.

---

# Challenge Scope (from Minerva)

Build a system that:

- 📥 Reads incoming emails and checks for attached PDF receipts _(simulated via manual upload)_
- 📄 Parses the receipts and stores the details in a database table called `ledger`
- 🧾 Shows the ledger in a simple user interface
- 📤 Allows uploading a bank statement CSV with a few transactions
- 🔍 Compares the bank transactions with the ledger
- 📊 Displays a clear table showing:
  - ✅ Transactions that match
  - 📄 Transactions only in the ledger
  - 💰 Transactions only in the bank statement

> **"Impress us."**  
> The quality of execution will directly influence the compensation package.

---

# Product & UX Requirements

Minerva emphasized:

- Good product instincts
- UX awareness
- Good eye for design
- Smooth, reliable, simple and minimalist UI
- Scalability and clean architecture
- Fast iteration, excellent structure

---

# Tech Stack

- **Frontend:** Next.js (App Router), TailwindCSS, Shadcn/UI (already installed)
- **Backend:** REST API Routes (tRPC-compatible structure), Node.js, Prisma ORM, Neon (PostgreSQL)
- **Parsing:** `pdf-parse` for PDF receipts, `papaparse` for CSV bank statements
- **Validation:** Zod
- **State Mgmt:** React state, server actions
- **Hosting:** Vercel
- **Version Control:** GitHub + Claude Code for PR review

---

# Assets

- **Minerva branding**: Available in `/public/`
  - `minerva-logo.avif` - Minerva logo
  - `minerva.avif` - Minerva branding asset

Use these when displaying Minerva branding in the UI.

---

# UI Components

We're using **shadcn/ui components** exclusively for the entire interface.  
These are already available in `components/ui/`.

You may:

- Extend existing components inside that folder
- Create new components in `components/` if needed
- Prioritize consistency and polish

---

# Design Principles

The entire UI should feel:

- 🧘‍♂️ Smooth and minimal
- 📱 Responsive and clean
- ✅ Actionable and intuitive
- ✨ Scalable and maintainable

---

# Color Palette (soft, neutral, clean)

- `#B4E3DB` – Primary (mint tone)
- `#0F766E` – Primary dark
- `#8BC5FF` – Accent (sky blue)
- `#FFFFFF` – Background
- `#F9FAFB` – Surface (cards)
- `#1F1F1F` – Text
- `#E5E7EB` – Borders
- `#FEE2E2` – Soft red (error)
- `#DCFCE7` – Soft green (success)

---

# What's Implemented So Far

- PDF upload UI (simulates email input)
- PDF parsing to extract `date`, `amount`, `description`
- Storage in `LedgerEntry` table via Prisma
- CSV upload and parsing
- Transaction matching logic (amount + close date + text match)
- Comparison table with filter tabs (Matched / Ledger / Bank)
- Clean, minimal layout built entirely with Shadcn components
- Responsive design, proper spacing, clear typographic hierarchy

---

# Code Structure

- `/app/` – Pages and route-level UI
- `/components/ui/` – Shadcn components (pre-installed)
- `/components/` – Custom layout and visual components
- `/api/` – REST endpoints (tRPC-ready pattern)
- `/libs/pdfParser.ts` – Logic for PDF parsing
- `/prisma/` – DB schema and seed
- `utils/` – Reusable helpers

---

# Claude – What to Review

- 📄 PDF parsing reliability and flexibility
- 🧠 Transaction matching logic: room for improvement?
- 🧱 Architecture: clean, scalable, maintainable?
- 🎨 Visual design & UX flow: anything to simplify or polish?
- 🔧 Suggestions for better folder/component structure?
- ✅ General best practices across fullstack

Thanks for reviewing this with a product-focused lens. Open to improvements on UX, design decisions, or structure.

# Claude – Collaboration Instructions

This project is a technical challenge for a YC-backed startup (Minerva).  
The scope is limited, but we're aiming for **production-level quality** and architecture inspired by best practices used in serious Next.js monorepos.

---

## 🔧 Architecture Guidelines Claude Should Follow

### 1. Folder Structure

- All components should live under `/components/`
- Use `/components/ui/` only for Shadcn components
- Organize by domain when possible (e.g., `/features/ledger`, `/features/comparison`)
- Keep `/libs/` for parsing logic, helpers, or formatters
- Keep `/api/` handlers modular and cohesive (REST endpoints for now)

---

### 2. Component Architecture

- Use Shadcn/UI components for all UI elements
- Prefer **composition over duplication**
- All new UI elements should reuse existing primitives (`button`, `input`, `table`, etc.)
- Only create new components if they're reusable or visually distinct

---

### 3. Data Handling & State

#### Server-First

- Use **Server Components** by default (`app/upload/page.tsx`)
- Fetch data with async functions inside page-level components

#### Client State

- For **data fetching and caching**, we're using `@tanstack/react-query`
- Prefer `useQuery` and `useMutation` hooks for data that needs client-side updates or status

#### URL as State

- If any state is shareable (tab, filter, pagination), keep it in the URL
- Example: `/results?filter=ledger&page=2`

---

### 4. Validation

- We use `zod` for all runtime validation (form inputs, API payloads)
- Schemas are colocated under `/features/*/schemas` when possible
- Inputs are validated before mutation or insertion into the DB

---

### 5. Styling Rules

- **Never** use inline hex colors (like `bg-[#1A1A1A]`)
- Define all custom colors in `tailwind.config.js`
- Use semantic Tailwind classes:
  - `bg-background`, `text-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `bg-card`, `text-card-foreground`
- Always ensure light/dark theme compatibility

---

### 6. Component Quality & UX

- All components should work in both light and dark themes
- Keep UI minimal, focused, and with strong alignment
- Use loading/skeleton states for async flows
- Buttons must follow proper `variant` and `size` structure
- Prefer `useForm()` + controlled inputs for file upload forms
- **CRITICAL**: All layouts must be centered and responsive with mobile-first design
  - Always use responsive utilities (sm:, md:, lg:, xl:)
  - Design for mobile screens first, then enhance for larger screens
  - Use container classes with proper padding for centered layouts
  - Test all components on mobile viewports first

---

### 7. Code Style

- TypeScript everywhere – avoid `any`
- Zod for validation (used everywhere already)
- Group features using `/features/[domain]/components`, `/hooks`, and `schemas`
- Use descriptive file names (`LedgerTable.tsx`, `useParseCSV.ts`, etc.)
- Comment intention when logic is non-trivial

---

### 8. Git & Review

- This repo will be reviewed using Claude Code
- You may generate or edit code, but stick to the structure and decisions defined here
- Leave comments when:
  - You're introducing a pattern
  - Modifying a critical logic piece
  - Suggesting a better structural option

---

## ✅ Claude's Focus for Feedback

- Suggest improvements to PDF parsing robustness
- Evaluate folder/component structure for clarity and scale
- Review UI hierarchy and visual clarity
- Flag unnecessary client-side state or use of `useState` where React Query fits better
- Spot unused code or style leaks

Let me know if you'd like to continue working under this structure or refine any pattern further.

## Commands

```bash
# Development
pnpm dev          # Start dev server with Turbopack on http://localhost:3000
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm prisma migrate dev     # Create and apply database migrations
pnpm prisma generate        # Generate Prisma client after schema changes
pnpm prisma studio          # Open Prisma Studio GUI for database management
pnpm prisma migrate reset   # Reset database (warning: deletes all data)

# No test commands are configured yet
```

## Architecture Overview

This is a **Transaction Reconciliation** application built with Next.js 15 App Router, designed to match bank transactions with ledger entries (receipts/invoices).

### Core Architecture Pattern

- **Next.js App Router** with Server Components by default
- **File-based routing** in `app/` directory
- **API routes** colocated with pages
- **Prisma ORM** for type-safe database access with PostgreSQL
- **React Hook Form + Zod** for form handling and validation
- **shadcn/ui components** built on Radix UI primitives

### Key Data Flow

1. Users upload PDF receipts → Creates `LedgerEntry` records
2. Users upload CSV bank statements → Creates `BankTransaction` records
3. System matches transactions → Creates `MatchLog` records with match scores
4. Users review and confirm matches via the UI

### Database Models (Prisma)

- **LedgerEntry**: Receipt/invoice records (vendor, amount, date, category)
- **BankTransaction**: Bank statement entries (description, amount, date)
- **MatchLog**: Links matched entries with confidence scores

### Critical Implementation Notes

1. **Authentication**: Currently uses hardcoded "demo-user" ID - real auth needs implementation
2. **File Processing**: PDF and CSV parsing logic is not yet implemented
3. **Matching Algorithm**: Transaction matching logic needs to be built
4. **API Structure Issue**: `/app/bank/route.ts` should be moved to `/app/api/bank/route.ts`
5. **Database**: Requires PostgreSQL with `DATABASE_URL` environment variable

### UI Component System

- Over 40 pre-built shadcn/ui components in `components/ui/`
- Components use CVA (class-variance-authority) for variant styling
- Tailwind CSS v4 with PostCSS for styling
- Dark mode support via next-themes

### Development Workflow

1. Always run `pnpm prisma generate` after modifying `schema.prisma`
2. Use `pnpm prisma migrate dev` to create migrations during development
3. Components should follow existing patterns in `components/ui/`
4. API routes should return consistent JSON responses with proper error handling
5. Use existing form patterns with React Hook Form + Zod validation
