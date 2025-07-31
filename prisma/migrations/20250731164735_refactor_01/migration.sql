-- CreateTable
CREATE TABLE "public"."Email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LedgerEntry" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "num" TEXT,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "account" TEXT,
    "split" TEXT,
    "debit" DECIMAL(12,2),
    "credit" DECIMAL(12,2),
    "balance" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankTransaction" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Matched" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "ledgerEntryId" TEXT NOT NULL,
    "bankTransactionId" TEXT NOT NULL,
    "bankTransactionFormatted" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "matchScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matched_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GoogleAuth" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiryDate" TIMESTAMP(3),
    "scope" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessedEmail" (
    "id" TEXT NOT NULL,
    "gmailId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "subject" TEXT,
    "from" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProcessedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "public"."Email"("email");

-- CreateIndex
CREATE INDEX "Email_email_idx" ON "public"."Email"("email");

-- CreateIndex
CREATE INDEX "LedgerEntry_emailId_idx" ON "public"."LedgerEntry"("emailId");

-- CreateIndex
CREATE INDEX "LedgerEntry_date_idx" ON "public"."LedgerEntry"("date");

-- CreateIndex
CREATE INDEX "BankTransaction_emailId_idx" ON "public"."BankTransaction"("emailId");

-- CreateIndex
CREATE INDEX "BankTransaction_date_idx" ON "public"."BankTransaction"("date");

-- CreateIndex
CREATE INDEX "Matched_emailId_idx" ON "public"."Matched"("emailId");

-- CreateIndex
CREATE INDEX "Matched_date_idx" ON "public"."Matched"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Matched_ledgerEntryId_bankTransactionId_key" ON "public"."Matched"("ledgerEntryId", "bankTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAuth_email_key" ON "public"."GoogleAuth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedEmail_gmailId_key" ON "public"."ProcessedEmail"("gmailId");

-- CreateIndex
CREATE INDEX "ProcessedEmail_userEmail_idx" ON "public"."ProcessedEmail"("userEmail");

-- CreateIndex
CREATE INDEX "ProcessedEmail_processedAt_idx" ON "public"."ProcessedEmail"("processedAt");

-- AddForeignKey
ALTER TABLE "public"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankTransaction" ADD CONSTRAINT "BankTransaction_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matched" ADD CONSTRAINT "Matched_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matched" ADD CONSTRAINT "Matched_ledgerEntryId_fkey" FOREIGN KEY ("ledgerEntryId") REFERENCES "public"."LedgerEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matched" ADD CONSTRAINT "Matched_bankTransactionId_fkey" FOREIGN KEY ("bankTransactionId") REFERENCES "public"."BankTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
