# Database Migration Instructions

The application has been updated to remove all user authentication and userId fields. However, you need to run the following commands to update your database:

## Steps to Complete Migration:

1. **Generate new Prisma Client** (this updates the TypeScript types):
   ```bash
   pnpm prisma generate
   ```

2. **Create and apply the migration** (this updates the actual database):
   ```bash
   pnpm prisma migrate dev --name remove_user_id
   ```

## Alternative: Reset Database (if you don't need existing data)

If you don't have important data in your database, you can reset it:

```bash
pnpm prisma migrate reset
```

This will:
- Drop the database
- Create a new database
- Apply all migrations
- Run seed scripts (if any)

## What Changed:

- Removed `userId` field from all database tables (LedgerEntry, BankTransaction, MatchLog)
- Updated all API endpoints to work without user authentication
- The application now operates as a single-tenant enterprise solution

## Troubleshooting:

If you see errors about "userId is missing", it means the Prisma client hasn't been regenerated yet. Run `pnpm prisma generate` to fix this.