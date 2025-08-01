# Transaction Reconciler

Bank reconciliation system that automates the comparison between receipts/invoices and bank transactions.

**Live Demo**: [https://transaction-reconciler.vercel.app](https://transaction-reconciler.vercel.app)

## What it does

This application allows you to:
- 📄 Upload PDF receipts and automatically extract data (date, amount, description)
- 🏦 Import bank statements in CSV format
- 🔍 Compare and reconcile transactions intelligently
- ✅ Visualize which payments match, which are missing, and which are extra

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **UI Components**: Shadcn/ui (minimalist components)
- **Database**: PostgreSQL with Prisma ORM
- **Parsing**: pdf-parse (PDFs), papaparse (CSVs)
- **Validation**: Zod
- **Deploy**: Vercel

## Installation

```bash
# Clone repository
git clone https://github.com/your-username/transaction-reconciler.git
cd transaction-reconciler

# Install dependencies
pnpm install

# Configure database
# Create .env file with:
DATABASE_URL="your-postgresql-url"

# Run migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

## Project Structure

```
/app              # Pages and routes (App Router)
/components       # React components
  /ui            # Shadcn components
/libs            # Parsing logic and utilities
/prisma          # Database schema
/api             # REST endpoints
```

## Usage Flow

1. **Upload Receipts**: Drag and drop PDF files with invoices/receipts
2. **Import Bank**: Upload your bank statement CSV
3. **View Results**: The app automatically shows:
   - ✅ Matching transactions
   - 📄 Receipts without bank payment
   - 💰 Payments without associated receipt

## Matching Algorithm

The system compares transactions using:
- Exact or similar amount (±5%)
- Close dates (±7 days)
- Text matching in descriptions

## Development

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # Check code
pnpm prisma studio # View/edit database
```

---

Developed as a technical challenge for Minerva (YC-backed startup).
