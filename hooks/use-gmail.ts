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
  failedPdfs?: Array<{
    filename: string;
    reason: string;
    message: string;
  }>;
  duplicates?: number;
  stats?: EmailStats;
  message?: string;
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
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await fetch("/api/gmail/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to check Gmail";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          
          // Handle specific error codes
          if (response.status === 401) {
            errorMessage = "Gmail authentication failed. Please reconnect your account.";
          } else if (response.status === 403) {
            errorMessage = "Gmail permissions denied. Please reconnect with proper permissions.";
          } else if (response.status === 503) {
            errorMessage = "Gmail service temporarily unavailable. Please try again later.";
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error("Gmail check error:", response.status, errorMessage);
        throw new Error(errorMessage);
      }

      try {
        const data = await response.json();
        return data;
      } catch (e) {
        console.error("Failed to parse Gmail response:", e);
        throw new Error("Invalid response from Gmail service");
      }
    },
    onSuccess: (data) => {
      console.log("📧 Gmail Check Response:", data);

      // Invalidate and refetch stats after successful check
      queryClient.invalidateQueries({ queryKey: ["gmail", "stats", email] });

      if (data.emailsFound === 0) {
        toast.info("No recent emails with PDFs found");
      } else if (data.emailsFound > 0) {
        toast.info(
          `Checked ${data.emailsFound} recent email${
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
      
      // Mostrar información sobre PDFs fallidos
      if (data.failedPdfs && data.failedPdfs.length > 0) {
        data.failedPdfs.forEach((pdf) => {
          if (pdf.reason === "Not a receipt") {
            toast.warning(`${pdf.filename}: Not a receipt`);
          } else if (pdf.reason === "Invalid receipt") {
            toast.error(`${pdf.filename}: ${pdf.message}`);
          } else {
            toast.error(`${pdf.filename}: ${pdf.message}`);
          }
        });
      }
      
      // Mostrar mensaje personalizado si viene del servidor
      if (data.message && !data.processed && (!data.failedPdfs || data.failedPdfs.length === 0)) {
        toast.info(data.message);
      }
    },
    onError: (error: Error) => {
      console.error("Error checking Gmail:", error);
      
      // Show specific error message to user
      const errorMessage = error.message || "Failed to check Gmail";
      
      if (errorMessage.includes("authentication failed")) {
        toast.error(errorMessage, {
          action: {
            label: "Reconnect",
            onClick: () => window.location.href = "/",
          },
        });
      } else if (errorMessage.includes("permissions denied")) {
        toast.error(errorMessage, {
          description: "Please reconnect your Gmail account with the required permissions",
        });
      } else {
        toast.error(errorMessage, {
          description: "Please try again or check your connection",
        });
      }
    },
  });
}

// Hook to disconnect Gmail
export function useGmailDisconnect() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await fetch("/api/gmail/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to disconnect Gmail");
      }
    },
    onSuccess: () => {
      toast.success("Gmail disconnected successfully");
      // Invalidate all queries to update UI completely
      queryClient.invalidateQueries({ queryKey: ["gmail", "status"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["gmail", "stats"] });
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: (error) => {
      console.error("Error disconnecting Gmail:", error);
      toast.error("Failed to disconnect Gmail");
    },
  });
}

// Hook to force disconnect Gmail (bypassing errors)
export function useGmailForceDisconnect() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await fetch("/api/gmail/force-disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to force disconnect Gmail");
      }
    },
    onSuccess: () => {
      toast.success("Gmail disconnected successfully");
      // Invalidate all queries to update UI completely
      queryClient.invalidateQueries();
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: (error) => {
      console.error("Error force disconnecting Gmail:", error);
      toast.error("Failed to force disconnect Gmail");
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