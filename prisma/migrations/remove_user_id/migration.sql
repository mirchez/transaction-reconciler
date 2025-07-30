-- Remove userId columns from all tables
ALTER TABLE "LedgerEntry" DROP COLUMN "userId";
ALTER TABLE "BankTransaction" DROP COLUMN "userId";
ALTER TABLE "MatchLog" DROP COLUMN "userId";