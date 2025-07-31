import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EmailStats {
  totalChecked: number;
  pdfsFound: number;
  lastCheck: Date | null;
  recentEmails: Array<{
    id: string;
    subject: string;
    from: string;
    hasPdf: boolean;
    pdfCount: number;
    processedAt: Date;
  }>;
}

interface GmailCheckResponse {
  processed: number;
  emailsFound: number;
  emailsWithPdfs: number;
  stats?: EmailStats;
}

// Hook to fetch Gmail stats
export function useGmailStats(email: string) {
  return useQuery<EmailStats>({
    queryKey: ["gmail", "stats", email],
    queryFn: async () => {
      const response = await fetch(`/api/gmail/stats?email=${email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Gmail stats");
      }
      return response.json();
    },
    enabled: !!email,
    // Disable automatic refetching
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Hook to check Gmail for new emails
export function useGmailCheck(email: string) {
  const queryClient = useQueryClient();

  return useMutation<GmailCheckResponse, Error>({
    mutationFn: async () => {
      const response = await fetch("/api/gmail/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to check Gmail");
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("📧 Gmail Check Response:", data);

      // Invalidate and refetch stats after successful check
      queryClient.invalidateQueries({ queryKey: ["gmail", "stats", email] });

      if (data.emailsFound > 0) {
        toast.info(
          `Found ${data.emailsFound} unread email${
            data.emailsFound > 1 ? "s" : ""
          }, ${data.emailsWithPdfs} with PDFs`
        );
      }

      if (data.processed > 0) {
        toast.success(
          `Processed ${data.processed} PDF${
            data.processed > 1 ? "s" : ""
          } successfully!`
        );
        // Invalidate relevant queries to refresh data without page reload
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
        queryClient.invalidateQueries({ queryKey: ["ledger"] });
        queryClient.invalidateQueries({ queryKey: ["bank"] });
      }
    },
    onError: (error) => {
      console.error("Error checking Gmail:", error);
      toast.error("Failed to check Gmail");
    },
  });
}

// Hook to disconnect Gmail
export function useGmailDisconnect() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      const response = await fetch("/api/gmail/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect Gmail");
      }
    },
    onSuccess: () => {
      toast.success("Gmail disconnected successfully");
      // Invalidate Gmail status to update UI
      queryClient.invalidateQueries({ queryKey: ["gmail", "status"] });
    },
    onError: (error) => {
      console.error("Error disconnecting Gmail:", error);
      toast.error("Failed to disconnect Gmail");
    },
  });
}

// Hook to check Gmail connection status
export function useGmailStatus() {
  return useQuery<{ connected: boolean; email: string | null }>({
    queryKey: ["gmail", "status"],
    queryFn: async () => {
      const response = await fetch("/api/gmail/status");
      if (!response.ok) {
        throw new Error("Failed to check Gmail status");
      }
      return response.json();
    },
    staleTime: 60 * 1000, // Consider fresh for 1 minute
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}