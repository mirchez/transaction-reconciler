"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TruncatedText } from "@/components/ui/truncated-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  File,
  Mail,
  Download,
  FileUp,
  MailCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { UploadCsvModal } from "@/components/upload-csv-modal";
import { GmailMonitorModal } from "@/components/gmail-monitor-modal";
import { Header } from "./components/header";
import { useGmailStatus } from "@/hooks/use-gmail";
import {
  exportMatchedTransactions,
  exportUnmatchedTransactions,
} from "./utils/excel-export";
import { useTransactions } from "@/hooks/use-transactions";
import { useQueryClient } from "@tanstack/react-query";

interface Transaction {
  id: string;
  date: string | null;
  amount: number | null;
  description: string | null;
  source: "Ledger" | "Bank" | "Both";
  status: "matched" | "ledger-only" | "bank-only";
  ledgerEntryId?: string;
  bankTransactionId?: string;
  matchScore?: number;
  matchType?: "logic" | "ai";
  matchReason?: string;
  bankDescription?: string;
}

export default function HomePage() {
  const queryClient = useQueryClient();
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showReconciled, setShowReconciled] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [ledgerResetDialogOpen, setLedgerResetDialogOpen] = useState(false);
  const [bankResetDialogOpen, setBankResetDialogOpen] = useState(false);
  const [resettingLedger, setResettingLedger] = useState(false);
  const [resettingBank, setResettingBank] = useState(false);
  const { data: gmailStatus } = useGmailStatus();
  const { data: transactionsData, isLoading: loading } = useTransactions();
  const transactions = transactionsData?.transactions || [];
  const [csvFileInfo, setCsvFileInfo] = useState<{
    name: string;
    size: string;
    uploadTime: string;
  } | null>(null);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check URL params for Gmail connection status (for redirect from OAuth)
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      // Display error message based on error type
      let errorMessage = "Failed to connect to Gmail.";

      switch (error) {
        case "auth_denied":
          errorMessage =
            "You denied access to Gmail. Please try again and grant the necessary permissions.";
          break;
        case "no_code":
          errorMessage =
            "Authentication failed: No authorization code received.";
          break;
        case "no_email":
          errorMessage =
            "Authentication failed: Could not retrieve your email address.";
          break;
        case "invalid_grant":
          errorMessage =
            "Authentication failed: Invalid authorization grant. Please try again.";
          break;
        case "redirect_uri_mismatch":
          errorMessage =
            "Authentication failed: Redirect URI mismatch. Please check the OAuth configuration.";
          break;
        case "auth_failed":
          errorMessage =
            "Authentication failed. Please check the browser console for more details and try again.";
          break;
      }

      toast.error(errorMessage);
      console.error("Gmail authentication error:", error);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("gmail_connected") === "true") {
      toast.success("Successfully connected to Gmail");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Simple filtering by source - show all entries from database
  const allLedgerEntries = transactions.filter((t) => t.source === "Ledger");
  const allBankEntries = transactions.filter((t) => t.source === "Bank");
  const matchedTransactions = transactions.filter((t) => t.source === "Both");

  // For reconciliation summary counts
  const ledgerOnlyTransactions = transactions.filter(
    (t) => t.status === "ledger-only"
  );
  const bankOnlyTransactions = transactions.filter(
    (t) => t.status === "bank-only"
  );
  
  // Match level breakdown
  const fullMatches = matchedTransactions.filter(
    (t) => !t.matchScore || t.matchScore === 100
  );
  const partialMatches = matchedTransactions.filter(
    (t) => t.matchScore === 66
  );
  const ambiguousMatches = matchedTransactions.filter(
    (t) => t.matchScore === 33
  );

  // Auto-show reconciliation results if there are matched transactions
  useEffect(() => {
    if (transactions.length > 0) {
      const hasMatchedTransactions = transactions.some(
        (t) => t.status === "matched" && t.source === "Both"
      );
      if (hasMatchedTransactions && !showReconciled) {
        setShowReconciled(true);
      }
    }
  }, [transactions, showReconciled]);

  const handleReconciliation = async () => {
    if (!gmailStatus?.email) {
      toast.error("Please connect your email first");
      return;
    }

    // Check if both tables have data
    const hasLedgerData = allLedgerEntries.length > 0;
    const hasBankData = allBankEntries.length > 0;

    if (!hasLedgerData && !hasBankData) {
      toast.error("No data to reconcile", {
        description: "Please upload both bank CSV and email receipts first",
      });
      return;
    } else if (!hasLedgerData) {
      toast.error("Missing ledger data", {
        description:
          "Please connect your email and check for receipts to load ledger transactions",
      });
      return;
    } else if (!hasBankData) {
      toast.error("Missing bank data", {
        description:
          "Please upload your bank statement CSV file to load bank transactions",
      });
      return;
    }

    setReconciling(true);
    try {
      const response = await fetch("/api/reconcile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: gmailStatus.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to reconcile transactions");
      }

      const data = await response.json();

      if (data.success) {
        if (data.stats.newMatches > 0) {
          toast.success("Reconciliation completed", {
            description: `Found ${data.stats.newMatches} new match${
              data.stats.newMatches > 1 ? "es" : ""
            }`,
          });
        } else {
          toast.info("Reconciliation completed", {
            description: "No new matches found",
          });
        }

        // Refresh transactions to show updated matches
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });

        // Show reconciliation results
        setShowReconciled(true);
      }
    } catch (error) {
      console.error("Reconciliation error:", error);
      toast.error("Failed to reconcile transactions", {
        description: "Please try again",
      });
    } finally {
      setReconciling(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!gmailStatus?.email) {
      toast.error("Please connect your Gmail account first");
      return;
    }

    setSendingTestEmail(true);
    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: gmailStatus.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send test email");
      }

      const data = await response.json();

      toast.success("Test email sent!", {
        description: `Check your inbox and refresh with Check Email`,
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleLedgerReset = async () => {
    if (!gmailStatus?.email) {
      toast.error("No email connected");
      return;
    }

    setResettingLedger(true);
    try {
      const response = await fetch(
        `/api/ledger?email=${encodeURIComponent(gmailStatus.email)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reset ledger data");
      }

      // Invalidate all queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["gmail-status"] });

      // Reset reconciliation view if needed
      if (allBankEntries.length === 0) {
        setShowReconciled(false);
      }

      toast.success("Ledger data cleared successfully", {
        description: "All receipts and email data have been removed",
      });
    } catch (error) {
      console.error("Error resetting ledger data:", error);
      toast.error("Failed to reset ledger data", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setResettingLedger(false);
      setLedgerResetDialogOpen(false);
    }
  };

  const handleBankReset = async () => {
    if (!gmailStatus?.email) {
      toast.error("No email connected");
      return;
    }

    setResettingBank(true);
    try {
      const response = await fetch(
        `/api/bank?email=${encodeURIComponent(gmailStatus.email)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reset bank data");
      }

      // Invalidate all queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // Reset local state
      setCsvFileInfo(null);

      // Reset reconciliation view if needed
      if (allLedgerEntries.length === 0) {
        setShowReconciled(false);
      }

      toast.success("Bank/CSV data cleared successfully", {
        description: "All bank transactions have been removed",
      });
    } catch (error) {
      console.error("Error resetting bank data:", error);
      toast.error("Failed to reset bank data", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setResettingBank(false);
      setBankResetDialogOpen(false);
    }
  };

  const formatAmount = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    
    const numAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[$,]/g, ""))
        : amount;
    const isNegative = numAmount < 0;
    return (
      <span
        className={
          isNegative
            ? "text-foreground font-medium"
            : "text-green-600 dark:text-green-400 font-medium"
        }
      >
        ${Math.abs(numAmount).toFixed(2)}
      </span>
    );
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    
    try {
      // If the date string already looks like YYYY-MM-DD, return it as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Parse ISO date string and extract just the date part
      // This avoids timezone conversion issues
      const datePart = dateString.split("T")[0];
      if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }

      // Fallback to parsing
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Scrollable Content Container */}
      <main className="relative flex-1 overflow-y-auto bg-background">
        <div className="min-h-full flex flex-col">
          {/* Content wrapper that grows */}
          <div className="flex-1">
            {/* Upload Data Card */}
            <section className="p-6">
              <div className="max-w-7xl mx-auto">
                <Card className="rounded-lg bg-card border shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-1 mb-6">
                      <h2 className="text-xl font-semibold text-foreground">
                        Upload your data
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Automatically reconcile bank statements and ledger
                      </p>
                    </div>

                    <div className="border-t border-border my-6"></div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full sm:w-auto">
                            <Button
                              size="default"
                              className="rounded-lg w-full sm:w-auto"
                              onClick={() => setCsvModalOpen(true)}
                              disabled={!gmailStatus?.connected}
                            >
                              <FileUp className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">
                                Upload bank CSV
                              </span>
                              <span className="sm:hidden">Upload CSV</span>
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-white text-black border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              <FileUp className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">
                                {!gmailStatus?.connected
                                  ? "Connect Email First"
                                  : "Upload Bank Statement"}
                              </p>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {!gmailStatus?.connected
                                  ? "You need to connect your email account before uploading bank statements"
                                  : "Import your bank transactions from a CSV file to match them with email receipts"}
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="default"
                            variant="outline"
                            className="rounded-lg w-full sm:w-auto"
                            onClick={() => setGmailModalOpen(true)}
                          >
                            {gmailStatus?.connected ? (
                              <>
                                <MailCheck className="w-4 h-4 mr-2" />
                                <span>Check Email</span>
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                <span>Connect Email</span>
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-white text-black border-gray-200">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {gmailStatus?.connected ? (
                                <MailCheck className="h-4 w-4 text-gray-600" />
                              ) : (
                                <Mail className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">
                                {gmailStatus?.connected
                                  ? "Email Management"
                                  : "Connect Gmail Account"}
                              </p>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {gmailStatus?.connected
                                  ? "Check for new receipts, view email statistics, or disconnect your Gmail account"
                                  : "Connect your Gmail to automatically import PDF receipts from your inbox"}
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      {gmailStatus?.connected && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="default"
                              variant="outline"
                              className="rounded-lg w-full sm:w-auto"
                              onClick={handleSendTestEmail}
                              disabled={sendingTestEmail}
                            >
                              {sendingTestEmail ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">
                                    Send Test Email
                                  </span>
                                  <span className="sm:hidden">Test Email</span>
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-white text-black border-gray-200">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">
                                <Mail className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-semibold text-sm">
                                  Test Email
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Sends a sample receipt PDF to your connected
                                  email for testing the automatic import feature
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Transaction Management Section */}
            <section className="p-6">
              <div className="max-w-7xl mx-auto">
                {/* Transaction Tables */}
                {loading ? (
                  <Card className="bg-card border shadow-sm">
                    <CardContent className="p-6 sm:p-12 text-center">
                      <p className="text-muted-foreground">
                        Loading transactions...
                      </p>
                    </CardContent>
                  </Card>
                ) : transactions.length === 0 ? (
                  <Card className="rounded-lg bg-card border shadow-sm">
                    <CardContent className="p-6 sm:p-12 text-center">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                          {gmailStatus?.connected ? (
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                          ) : (
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                          {gmailStatus?.connected
                            ? "No Transactions Yet!"
                            : "Connect Your Email to Start"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {gmailStatus?.connected
                            ? "Upload your receipts and bank statements above to start managing transactions."
                            : "Connect your Gmail account to automatically import receipts and enable bank statement uploads."}
                        </p>
                        {!gmailStatus?.connected && (
                          <Button
                            onClick={() => setGmailModalOpen(true)}
                            className="rounded-lg mt-4"
                            size="default"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Connect Email Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {/* Two tables side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Ledger Only Table */}
                      <Card className="bg-card border shadow-sm">
                        <CardContent className="p-4 sm:p-6">
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                                  Ledger Transactions
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                                  All receipts and invoices from your emails
                                </p>
                              </div>
                              <Button
                                size="sm"
                                className="rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 text-red-600 dark:text-red-500 hover:bg-red-500/20 dark:hover:bg-red-500/30"
                                onClick={() => setLedgerResetDialogOpen(true)}
                                disabled={allLedgerEntries.length === 0}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="ml-1 hidden sm:inline">
                                  Reset Ledger
                                </span>
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 sm:hidden">
                              All receipts and invoices from your emails
                            </p>
                          </div>
                          <div className="border border-border rounded-lg overflow-hidden bg-card">
                            {/* Data source info */}
                            <div className="px-2 sm:px-4 py-2 sm:py-3 bg-muted/50 border-b border-border">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 flex-shrink-0" />
                                  <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                                    {gmailStatus?.email || "Gmail Receipts"}
                                  </span>
                                </div>
                                <span className="text-muted-foreground/50 hidden sm:inline">
                                  •
                                </span>
                                <span>{allLedgerEntries.length} entries</span>
                                <span className="text-muted-foreground/50 hidden sm:inline">
                                  •
                                </span>
                                <span className="hidden sm:inline">
                                  Last synced: {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <div className="w-full max-w-full overflow-x-auto max-h-[300px] overflow-y-auto border border-border rounded-lg">
                              <Table className="w-full table-auto">
                                <TableHeader>
                                  <TableRow className="border-b border-border">
                                    <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">
                                      Date
                                    </TableHead>
                                    <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">
                                      Description
                                    </TableHead>
                                    <TableHead className="font-medium bg-muted/30 text-right px-4 py-3 w-28">
                                      Amount
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {allLedgerEntries.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={3}
                                        className="text-center py-8 text-muted-foreground"
                                      >
                                        No ledger transactions
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    allLedgerEntries.map((transaction) => (
                                      <TableRow
                                        key={transaction.id}
                                        className="hover:bg-muted/50 border-b border-border/50"
                                      >
                                        <TableCell className="font-medium px-4 py-3">
                                          {formatDate(transaction.date)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                          <div
                                            className="max-w-[300px] truncate"
                                            title={transaction.description || "N/A"}
                                          >
                                            {transaction.description || "N/A"}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right px-4 py-3">
                                          {formatAmount(transaction.amount)}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Bank Only Table */}
                      <Card className="bg-card border shadow-sm">
                        <CardContent className="p-4 sm:p-6">
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                                  Bank Transactions
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                                  All transactions from your bank statement
                                </p>
                              </div>
                              <Button
                                size="sm"
                                className="rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 text-red-600 dark:text-red-500 hover:bg-red-500/20 dark:hover:bg-red-500/30"
                                onClick={() => setBankResetDialogOpen(true)}
                                disabled={allBankEntries.length === 0}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="ml-1 hidden sm:inline">
                                  Reset CSV
                                </span>
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 sm:hidden">
                              All transactions from your bank statement
                            </p>
                          </div>
                          <div className="border border-border rounded-lg overflow-hidden bg-card">
                            {/* Data source info */}
                            <div className="px-2 sm:px-4 py-2 sm:py-3 bg-muted/50 border-b border-border">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <File className="w-3 h-3 flex-shrink-0" />
                                  <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                                    {csvFileInfo?.name || "Bank Statement.csv"}
                                  </span>
                                </div>
                                <span className="text-muted-foreground/50 hidden sm:inline">
                                  •
                                </span>
                                <span>{allBankEntries.length} entries</span>
                                <span className="text-muted-foreground/50 hidden sm:inline">
                                  •
                                </span>
                                <span className="hidden sm:inline">
                                  {csvFileInfo?.size || "0.1 MB"}
                                </span>
                                <span className="text-muted-foreground/50 hidden sm:inline">
                                  •
                                </span>
                                <span className="hidden sm:inline">
                                  {csvFileInfo?.uploadTime ||
                                    new Date().toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <div className="w-full max-w-full overflow-x-auto max-h-[300px] overflow-y-auto border border-border rounded-lg">
                              <Table className="w-full table-auto">
                                <TableHeader>
                                  <TableRow className="border-b border-border">
                                    <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">
                                      Date
                                    </TableHead>
                                    <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">
                                      Description
                                    </TableHead>
                                    <TableHead className="font-medium bg-muted/30 text-right px-4 py-3 w-28">
                                      Amount
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {allBankEntries.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={3}
                                        className="text-center py-8 text-muted-foreground"
                                      >
                                        No bank transactions
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    allBankEntries.map((transaction) => (
                                      <TableRow
                                        key={transaction.id}
                                        className="hover:bg-muted/50 border-b border-border/50"
                                      >
                                        <TableCell className="font-medium px-4 py-3">
                                          {formatDate(transaction.date)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                          <div
                                            className="max-w-[300px] truncate"
                                            title={transaction.description || "N/A"}
                                          >
                                            {transaction.description || "N/A"}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right px-4 py-3">
                                          {formatAmount(transaction.amount)}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Run Reconciliation Card */}
                    {transactions.length > 0 && (
                      <Card className="rounded-lg bg-card border shadow-sm mt-8">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                                Reconcile Files
                              </h3>
                              <div className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
                                <p>
                                  {allBankEntries.length} Bank statement(s) •{" "}
                                  {allLedgerEntries.length} Ledger file(s)
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={handleReconciliation}
                              disabled={
                                reconciling ||
                                (allLedgerEntries.length === 0 &&
                                  allBankEntries.length === 0)
                              }
                              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                              size="default"
                            >
                              {reconciling ? (
                                <>
                                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                  Reconciling...
                                </>
                              ) : (
                                <>Start Reconciliation</>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Reconciliation Summary - Show when there are matched transactions */}
                    {showReconciled && (
                      <Card className="rounded-lg bg-card border shadow-sm mt-8">
                        <CardContent className="p-4 sm:p-6">
                          <div className="mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                              Reconciliation Summary
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              Overview of all matched and unmatched transactions
                            </p>
                          </div>

                          {/* Summary Stats */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                            <div className="text-center p-4 bg-muted/50 dark:bg-muted border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">
                                {allBankEntries.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Bank Transactions
                              </div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 dark:bg-muted border border-border rounded-lg">
                              <div className="text-2xl font-bold text-foreground">
                                {allLedgerEntries.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Ledger Transactions
                              </div>
                            </div>
                            <div className="text-center p-4 bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40 rounded-lg">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                                {fullMatches.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Full Match
                              </div>
                            </div>
                            <div className="text-center p-4 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                                {partialMatches.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Partial Match
                              </div>
                            </div>
                            <div className="text-center p-4 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                                {ambiguousMatches.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Ambiguous
                              </div>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 rounded-lg">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                                {bankOnlyTransactions.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Unmatched Bank
                              </div>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 rounded-lg">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                                {ledgerOnlyTransactions.length}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Unmatched Ledger
                              </div>
                            </div>
                          </div>

                          {/* Matched Transactions Table */}
                          <div className="mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                                Matched Transactions
                              </h3>
                              <Button
                                onClick={() =>
                                  exportMatchedTransactions(
                                    matchedTransactions,
                                    `matched-transactions-${
                                      new Date().toISOString().split("T")[0]
                                    }`
                                  )
                                }
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto text-xs sm:text-sm"
                                disabled={matchedTransactions.length === 0}
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="hidden sm:inline">
                                  Download Matched Excel
                                </span>
                                <span className="sm:hidden">
                                  Download Excel
                                </span>
                              </Button>
                            </div>
                            <div className="border border-border rounded-lg overflow-hidden bg-card">
                              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden">
                                <Table className="w-full table-auto">
                                  <TableHeader>
                                    <TableRow className="border-b border-border">
                                      <TableHead className="font-medium bg-green-500/10 dark:bg-green-500/20 text-left px-4 py-3 w-32">
                                        Date
                                      </TableHead>
                                      <TableHead className="font-medium bg-green-500/10 dark:bg-green-500/20 text-left px-4 py-3">
                                        Ledger Description
                                      </TableHead>
                                      <TableHead className="font-medium bg-green-500/10 dark:bg-green-500/20 text-left px-4 py-3">
                                        Bank Description
                                      </TableHead>
                                      <TableHead className="font-medium bg-green-500/10 dark:bg-green-500/20 text-right px-4 py-3 w-28">
                                        Amount
                                      </TableHead>
                                      <TableHead className="font-medium bg-green-500/10 dark:bg-green-500/20 text-center px-4 py-3 w-24">
                                        Match
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {matchedTransactions.length === 0 ? (
                                      <TableRow>
                                        <TableCell
                                          colSpan={5}
                                          className="text-center py-8 text-muted-foreground"
                                        >
                                          No matched transactions found
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      matchedTransactions.map((transaction) => (
                                        <TableRow
                                          key={transaction.id}
                                          className="hover:bg-muted/50 border-b border-border/50"
                                        >
                                          <TableCell className="font-medium px-4 py-3">
                                            {formatDate(transaction.date)}
                                          </TableCell>
                                          <TableCell className="px-4 py-3">
                                            <TruncatedText
                                              text={transaction.description}
                                              maxLength={40}
                                              mobileMaxLength={20}
                                              className="text-foreground"
                                            />
                                          </TableCell>
                                          <TableCell className="text-muted-foreground px-4 py-3">
                                            <TruncatedText
                                              text={
                                                transaction.bankDescription
                                                  ? transaction.bankDescription
                                                      .replace(/^From: /, "")
                                                      .replace(
                                                        / \$[\d,.-]+ on [\d-]+$/,
                                                        ""
                                                      )
                                                  : "N/A"
                                              }
                                              maxLength={40}
                                              mobileMaxLength={18}
                                              className="text-muted-foreground"
                                            />
                                          </TableCell>
                                          <TableCell className="text-right px-4 py-3">
                                            {formatAmount(transaction.amount)}
                                          </TableCell>
                                          <TableCell className="text-center px-4 py-3">
                                            <div className="flex justify-center">
                                              <Badge
                                                variant="outline"
                                                className={`rounded-lg font-semibold min-w-[85px] justify-center text-sm ${
                                                  !transaction.matchScore ||
                                                  transaction.matchScore === 100
                                                    ? "bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40"
                                                    : transaction.matchScore === 66
                                                    ? "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/40"
                                                    : transaction.matchScore === 33
                                                    ? "bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40"
                                                    : "bg-gray-500/10 text-gray-700 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/40"
                                                }`}
                                              >
                                                {!transaction.matchScore || transaction.matchScore === 100
                                                  ? "Full Match"
                                                  : transaction.matchScore === 66
                                                  ? "Partial"
                                                  : transaction.matchScore === 33
                                                  ? "Ambiguous"
                                                  : `${Math.round(transaction.matchScore)}%`}
                                              </Badge>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>

                          {/* Unmatched Transactions */}
                          <div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                                Unmatched Transactions
                              </h3>
                              <Button
                                onClick={() =>
                                  exportUnmatchedTransactions(
                                    [
                                      ...ledgerOnlyTransactions,
                                      ...bankOnlyTransactions,
                                    ],
                                    `unmatched-transactions-${
                                      new Date().toISOString().split("T")[0]
                                    }`
                                  )
                                }
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto text-xs sm:text-sm"
                                disabled={
                                  ledgerOnlyTransactions.length === 0 &&
                                  bankOnlyTransactions.length === 0
                                }
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="hidden sm:inline">
                                  Download Unmatched Excel
                                </span>
                                <span className="sm:hidden">
                                  Download Excel
                                </span>
                              </Button>
                            </div>
                            <div className="border border-border rounded-lg overflow-hidden bg-card">
                              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden">
                                <Table className="w-full table-auto">
                                  <TableHeader>
                                    <TableRow className="border-b border-border">
                                      <TableHead className="font-medium bg-red-500/10 dark:bg-red-500/20 text-left px-4 py-3 w-32">
                                        Date
                                      </TableHead>
                                      <TableHead className="font-medium bg-red-500/10 dark:bg-red-500/20 text-left px-4 py-3">
                                        Description
                                      </TableHead>
                                      <TableHead className="font-medium bg-red-500/10 dark:bg-red-500/20 text-left px-4 py-3 w-24">
                                        Source
                                      </TableHead>
                                      <TableHead className="font-medium bg-red-500/10 dark:bg-red-500/20 text-right px-4 py-3 w-28">
                                        Amount
                                      </TableHead>
                                      <TableHead className="font-medium bg-red-500/10 dark:bg-red-500/20 text-left px-4 py-3 w-36">
                                        Status
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {ledgerOnlyTransactions.length === 0 &&
                                    bankOnlyTransactions.length === 0 ? (
                                      <TableRow>
                                        <TableCell
                                          colSpan={5}
                                          className="text-center py-8 text-muted-foreground"
                                        >
                                          No unmatched transactions
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      [
                                        ...ledgerOnlyTransactions,
                                        ...bankOnlyTransactions,
                                      ].map((transaction) => (
                                        <TableRow
                                          key={transaction.id}
                                          className="hover:bg-muted/50 border-b border-border/50"
                                        >
                                          <TableCell className="font-medium px-4 py-3">
                                            {formatDate(transaction.date)}
                                          </TableCell>
                                          <TableCell className="px-4 py-3">
                                            <TruncatedText
                                              text={transaction.description}
                                              maxLength={45}
                                              mobileMaxLength={22}
                                              className="text-foreground"
                                            />
                                          </TableCell>
                                          <TableCell className="px-4 py-3">
                                            <Badge
                                              variant="outline"
                                              className="rounded-lg"
                                            >
                                              {transaction.source}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-right px-4 py-3">
                                            {formatAmount(transaction.amount)}
                                          </TableCell>
                                          <TableCell className="px-4 py-3">
                                            {transaction.status ===
                                            "ledger-only" ? (
                                              <Badge className="rounded-lg bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30">
                                                <FileText className="w-3 h-3 mr-1" />
                                                Ledger Only
                                              </Badge>
                                            ) : (
                                              <Badge className="rounded-lg bg-secondary text-primary/80 border-primary/30 dark:bg-primary/30 dark:text-primary dark:border-primary/40">
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                                Bank Only
                                              </Badge>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">
                  Built with dedication for{" "}
                  <span className="font-semibold text-foreground">
                    Om Agarwal
                  </span>{" "}
                  and the{" "}
                  <span className="font-semibold text-foreground">
                    Minerva team
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-xs">
                    Thank you for this opportunity
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-xs font-medium">Miguel Miranda</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Modals - Only render after mount to avoid SSR issues */}
      {mounted && (
        <>
          <UploadCsvModal
            open={csvModalOpen}
            onOpenChange={setCsvModalOpen}
            onFileUpload={(fileInfo) => setCsvFileInfo(fileInfo)}
          />
          <GmailMonitorModal
            open={gmailModalOpen}
            onOpenChange={setGmailModalOpen}
          />
          {/* Ledger Reset Dialog */}
          <Dialog
            open={ledgerResetDialogOpen}
            onOpenChange={setLedgerResetDialogOpen}
          >
            <DialogContent className="max-w-[95vw] sm:max-w-[500px] bg-white dark:bg-popover border-border rounded-lg">
              <DialogHeader className="pb-4 sm:pb-6">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground">
                  Reset Ledger Data?
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
                  This action cannot be undone. This will permanently delete:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>All ledger transactions from emails</li>
                    <li>Processed email history</li>
                    <li>Any matched transaction records</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/30 rounded-lg border border-border/50">
                    <strong>Note:</strong> This will delete all ledger data.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 dark:border-gray-700 text-sm order-2 sm:order-1 w-full sm:w-auto"
                  onClick={() => setLedgerResetDialogOpen(false)}
                  disabled={resettingLedger}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 text-red-600 dark:text-red-500 hover:bg-red-500/20 dark:hover:bg-red-500/30 text-sm order-1 sm:order-2 w-full sm:w-auto"
                  onClick={handleLedgerReset}
                  disabled={resettingLedger}
                >
                  {resettingLedger ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Ledger Data
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bank Reset Dialog */}
          <Dialog
            open={bankResetDialogOpen}
            onOpenChange={setBankResetDialogOpen}
          >
            <DialogContent className="max-w-[95vw] sm:max-w-[500px] bg-white dark:bg-popover border-border rounded-lg">
              <DialogHeader className="pb-4 sm:pb-6">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground">
                  Reset Bank/CSV Data?
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
                  This action cannot be undone. This will permanently delete:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>All bank transactions from CSV files</li>
                    <li>Any matched transaction records</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/30 rounded-lg border border-border/50">
                    <strong>Note:</strong> This will delete all CSV data.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 dark:border-gray-700 text-sm order-2 sm:order-1 w-full sm:w-auto"
                  onClick={() => setBankResetDialogOpen(false)}
                  disabled={resettingBank}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 text-red-600 dark:text-red-500 hover:bg-red-500/20 dark:hover:bg-red-500/30 text-sm order-1 sm:order-2 w-full sm:w-auto"
                  onClick={handleBankReset}
                  disabled={resettingBank}
                >
                  {resettingBank ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete CSV Data
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
