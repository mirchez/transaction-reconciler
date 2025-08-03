import { z } from "zod";

// Validation schemas
export const LedgerEntrySchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  vendor: z.string(),
  category: z.string().optional(),
});

export const BankTransactionSchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  description: z.string(),
});

export const CSVRowSchema = z.object({
  date: z.string(),
  amount: z.string(),
  description: z.string(),
});

// Raw CSV row type for displaying all columns as uploaded
export const RawCSVRowSchema = z.record(z.string(), z.string());

// Types
export type LedgerEntry = z.infer<typeof LedgerEntrySchema>;
export type BankTransaction = z.infer<typeof BankTransactionSchema>;
export type CSVRow = z.infer<typeof CSVRowSchema>;
export type RawCSVRow = z.infer<typeof RawCSVRowSchema>;

// API Response types
export interface UploadResponse {
  success: boolean;
  message: string;
  processed?: number;
  failed?: number;
  errors?: Array<{
    row?: number;
    error: string;
  }>;
}

// File validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_PDF_TYPES = ["application/pdf"];
export const ALLOWED_CSV_TYPES = ["text/csv", "application/csv"];