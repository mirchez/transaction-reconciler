import { useQuery } from "@tanstack/react-query";
import { useGmailStatus } from "./use-gmail";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  source: "Ledger" | "Bank" | "Both";
  status: "matched" | "ledger-only" | "bank-only";
  ledgerEntryId?: string;
  bankTransactionId?: string;
  matchScore?: number;
  matchType?: "logic" | "ai";
  matchReason?: string;
  bankDescription?: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  stats: {
    total: number;
    matched: number;
    ledgerOnly: number;
    bankOnly: number;
  };
}

export function useTransactions() {
  const { data: gmailStatus } = useGmailStatus();
  
  return useQuery<TransactionsResponse>({
    queryKey: ["transactions", gmailStatus?.email],
    queryFn: async () => {
      if (!gmailStatus?.email) {
        return {
          transactions: [],
          stats: { total: 0, matched: 0, ledgerOnly: 0, bankOnly: 0 },
        };
      }
      
      const response = await fetch(`/api/transactions?email=${encodeURIComponent(gmailStatus.email)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      
      return response.json();
    },
    enabled: !!gmailStatus?.email,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
  });
}