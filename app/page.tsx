"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, TrendingUp, CheckCircle2, RefreshCw, File, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { UploadCsvModal } from "@/components/upload-csv-modal";
import { GmailMonitorModal } from "@/components/gmail-monitor-modal";
import { Header } from "./components/header";
import { useGmailStatus } from "@/hooks/use-gmail";
import { exportMatchedTransactions, exportUnmatchedTransactions } from "./utils/excel-export";
import { useTransactions } from "@/hooks/use-transactions";
import { useQueryClient } from "@tanstack/react-query";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  source: "Ledger" | "Bank" | "Both";
  status: "matched" | "ledger-only" | "bank-only";
  category?: string;
  vendor?: string;
  ledgerEntryId?: string;
  bankTransactionId?: string;
  matchScore?: number;
}

export default function HomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showReconciled, setShowReconciled] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const { data: gmailStatus } = useGmailStatus();
  const { data: transactionsData, isLoading: loading } = useTransactions();
  const transactions = transactionsData?.transactions || [];
  const [csvFileInfo, setCsvFileInfo] = useState<{name: string, size: string, uploadTime: string} | null>(null);
  
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
          errorMessage = "You denied access to Gmail. Please try again and grant the necessary permissions.";
          break;
        case "no_code":
          errorMessage = "Authentication failed: No authorization code received.";
          break;
        case "no_email":
          errorMessage = "Authentication failed: Could not retrieve your email address.";
          break;
        case "invalid_grant":
          errorMessage = "Authentication failed: Invalid authorization grant. Please try again.";
          break;
        case "redirect_uri_mismatch":
          errorMessage = "Authentication failed: Redirect URI mismatch. Please check the OAuth configuration.";
          break;
        case "auth_failed":
          errorMessage = "Authentication failed. Please check the browser console for more details and try again.";
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



  const handleReconciliation = async () => {
    if (!gmailStatus?.email) {
      toast.error("Please connect your email first");
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
        toast.success(data.message, {
          description: `Found ${data.stats.newMatches} new matches`,
        });
        
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

  const [checkingEmails, setCheckingEmails] = useState(false);
  
  const handleCheckEmails = async () => {
    if (!gmailStatus?.email) {
      toast.error("Please connect your Gmail account first");
      return;
    }
    
    setCheckingEmails(true);
    try {
      const response = await fetch("/api/gmail/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: gmailStatus?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to check emails");
      }

      const data = await response.json();
      
      if (data.newEmails > 0) {
        toast.success(`Found ${data.newEmails} new receipt${data.newEmails > 1 ? 's' : ''}!`, {
          description: "Refreshing transactions...",
        });
        // Refresh transactions
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      } else {
        toast.info("No new receipts found", {
          description: "Your transactions are up to date",
        });
      }
    } catch (error) {
      console.error("Error checking emails:", error);
      toast.error("Failed to check emails", {
        description: "Please try again or check your Gmail connection",
      });
    } finally {
      setCheckingEmails(false);
    }
  };

  const ledgerOnlyTransactions = transactions.filter((t) => t.status === "ledger-only");
  const bankOnlyTransactions = transactions.filter((t) => t.status === "bank-only");
  const matchedTransactions = transactions.filter((t) => t.status === "matched");

  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount;
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
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
        <div className="min-h-full">
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
                    <Button 
                      size="default"
                      className="rounded-md"
                      onClick={() => setCsvModalOpen(true)}
                    >
                      Upload bank CSV
                    </Button>
                    <Button 
                      size="default"
                      variant="outline"
                      className="rounded-md"
                      onClick={() => setGmailModalOpen(true)}
                    >
                      {gmailStatus?.connected ? (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Check Email
                        </>
                      ) : (
                        "Connect Email"
                      )}
                    </Button>
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
              <Card className="rounded-lg bg-card border shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </CardContent>
              </Card>
            ) : transactions.length === 0 ? (
              <Card className="rounded-lg bg-card border shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">No Transactions Yet!</h3>
                    <p className="text-muted-foreground">
                      Upload your receipts and bank statements above to start managing transactions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Two tables side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ledger Only Table */}
                  <Card className="rounded-lg bg-card border shadow-sm">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">Ledger Only Transactions</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Receipts without matching bank transactions
                            </p>
                          </div>
                          {gmailStatus?.connected && (
                            <Button
                              onClick={handleCheckEmails}
                              disabled={checkingEmails}
                              variant="outline"
                              size="sm"
                              className="rounded-none"
                            >
                              {checkingEmails ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                <>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Check Now
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden bg-card">
                        {/* Data source info */}
                        <div className="px-4 py-3 bg-muted/50 border-b border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span className="font-medium">{gmailStatus?.email || "Gmail Receipts"}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{ledgerOnlyTransactions.length} entries</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>Last synced: {new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="border-b border-border">
                              <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">Date</TableHead>
                              <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">Description</TableHead>
                              <TableHead className="font-medium bg-muted/30 text-right px-4 py-3 w-28">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                        </Table>
                        <div className="max-h-[250px] overflow-y-auto">
                          <Table className="w-full">
                            <TableHeader className="sr-only">
                              <TableRow>
                                <TableHead className="w-32">Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-28">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                          {ledgerOnlyTransactions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No ledger-only transactions
                              </TableCell>
                            </TableRow>
                          ) : (
                            ledgerOnlyTransactions.map((transaction) => (
                              <TableRow
                                key={transaction.id}
                                className="cursor-pointer hover:bg-muted/50 border-b border-border/50"
                                onClick={() => router.push(`/transaction/${transaction.id}`)}
                              >
                                <TableCell className="font-medium px-4 py-3">{formatDate(transaction.date)}</TableCell>
                                <TableCell className="px-4 py-3">{transaction.description}</TableCell>
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
                  <Card className="rounded-lg bg-card border shadow-sm">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Bank Only Transactions</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bank transactions without matching receipts
                        </p>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden bg-card">
                        {/* Data source info */}
                        <div className="px-4 py-3 bg-muted/50 border-b border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <File className="w-3 h-3" />
                            <span className="font-medium">{csvFileInfo?.name || "Bank Statement.csv"}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{csvFileInfo?.size || "0.1 MB"}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{csvFileInfo?.uploadTime || new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="border-b border-border">
                              <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">Date</TableHead>
                              <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">Description</TableHead>
                              <TableHead className="font-medium bg-muted/30 text-right px-4 py-3 w-28">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                        </Table>
                        <div className="max-h-[250px] overflow-y-auto">
                          <Table className="w-full">
                            <TableHeader className="sr-only">
                              <TableRow>
                                <TableHead className="w-32">Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-28">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                          {bankOnlyTransactions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No bank-only transactions
                              </TableCell>
                            </TableRow>
                          ) : (
                            bankOnlyTransactions.map((transaction) => (
                              <TableRow
                                key={transaction.id}
                                className="cursor-pointer hover:bg-muted/50 border-b border-border/50"
                                onClick={() => router.push(`/transaction/${transaction.id}`)}
                              >
                                <TableCell className="font-medium px-4 py-3">{formatDate(transaction.date)}</TableCell>
                                <TableCell className="px-4 py-3">{transaction.description}</TableCell>
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
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Reconcile Files</h3>
                          <div className="text-sm text-muted-foreground">
                            <p>{bankOnlyTransactions.length} Bank statement(s) • {ledgerOnlyTransactions.length + matchedTransactions.length} Ledger file(s)</p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleReconciliation}
                          disabled={reconciling || (ledgerOnlyTransactions.length === 0 && bankOnlyTransactions.length === 0)}
                          className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                          size="lg"
                        >
                          {reconciling ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Reconciling...
                            </>
                          ) : (
                            <>
                              Start Reconciliation
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reconciled Results - Only show after reconciliation */}
                {showReconciled && (
                  <Card className="rounded-lg bg-card border shadow-sm mt-8">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground">Reconciliation Results</h2>
                        <p className="text-sm text-muted-foreground mt-1">Summary of transaction matching results</p>
                      </div>

                      {/* Summary Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="text-center p-4 bg-muted/50 dark:bg-muted border border-border rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
                          <div className="text-xs text-muted-foreground mt-1">Bank Transactions</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 dark:bg-muted border border-border rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{ledgerOnlyTransactions.length + matchedTransactions.length}</div>
                          <div className="text-xs text-muted-foreground mt-1">Ledger Transactions</div>
                        </div>
                        <div className="text-center p-4 bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-500">{matchedTransactions.length}</div>
                          <div className="text-xs text-muted-foreground mt-1">Matched</div>
                        </div>
                        <div className="text-center p-4 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">0</div>
                          <div className="text-xs text-muted-foreground mt-1">Ambiguous</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="text-center p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-500">{bankOnlyTransactions.length}</div>
                          <div className="text-xs text-muted-foreground mt-1">Unmatched Bank</div>
                        </div>
                        <div className="text-center p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-500">{ledgerOnlyTransactions.length}</div>
                          <div className="text-xs text-muted-foreground mt-1">Unmatched Ledger</div>
                        </div>
                      </div>

                      {/* Matched Transactions Table */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Matched Transactions</h3>
                          <Button
                            onClick={() => exportMatchedTransactions(matchedTransactions, `matched-transactions-${new Date().toISOString().split('T')[0]}`)}
                            variant="outline"
                            size="sm"
                            className="rounded-none"
                            disabled={matchedTransactions.length === 0}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Excel
                          </Button>
                        </div>
                        <div className="border border-border rounded-lg overflow-hidden bg-card">
                          <div className="overflow-x-auto">
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow className="border-b border-border">
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">Date</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">Ledger Description</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">Bank Description</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-right px-4 py-3 w-28">Amount</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">Match Score</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {matchedTransactions.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                      No matched transactions found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  matchedTransactions.map((transaction) => (
                                    <TableRow
                                      key={transaction.id}
                                      className="cursor-pointer hover:bg-muted/50 border-b border-border/50"
                                      onClick={() => router.push(`/transaction/${transaction.id}`)}
                                    >
                                      <TableCell className="font-medium px-4 py-3">{formatDate(transaction.date)}</TableCell>
                                      <TableCell className="px-4 py-3">{transaction.vendor || transaction.description}</TableCell>
                                      <TableCell className="text-muted-foreground px-4 py-3">{transaction.description}</TableCell>
                                      <TableCell className="text-right px-4 py-3">
                                        {formatAmount(transaction.amount)}
                                      </TableCell>
                                      <TableCell className="px-4 py-3">
                                        <Badge variant="outline" className="rounded-lg">
                                          {transaction.matchScore ? `${Math.round(transaction.matchScore)}%` : "100%"}
                                        </Badge>
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
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">Unmatched Transactions</h3>
                          <Button
                            onClick={() => exportUnmatchedTransactions([...ledgerOnlyTransactions, ...bankOnlyTransactions], `unmatched-transactions-${new Date().toISOString().split('T')[0]}`)}
                            variant="outline"
                            size="sm"
                            className="rounded-none"
                            disabled={ledgerOnlyTransactions.length === 0 && bankOnlyTransactions.length === 0}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Excel
                          </Button>
                        </div>
                        <div className="border border-border rounded-lg overflow-hidden bg-card">
                          <div className="overflow-x-auto">
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow className="border-b border-border">
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-32">Date</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3">Description</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-24">Source</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-right px-4 py-3 w-28">Amount</TableHead>
                                  <TableHead className="font-medium bg-muted/30 text-left px-4 py-3 w-36">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(ledgerOnlyTransactions.length === 0 && bankOnlyTransactions.length === 0) ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                      No unmatched transactions
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  [...ledgerOnlyTransactions, ...bankOnlyTransactions].map((transaction) => (
                                    <TableRow
                                      key={transaction.id}
                                      className="cursor-pointer hover:bg-muted/50 border-b border-border/50"
                                      onClick={() => router.push(`/transaction/${transaction.id}`)}
                                    >
                                      <TableCell className="font-medium px-4 py-3">{formatDate(transaction.date)}</TableCell>
                                      <TableCell className="px-4 py-3">{transaction.description}</TableCell>
                                      <TableCell className="px-4 py-3">
                                        <Badge variant="outline" className="rounded-lg">
                                          {transaction.source}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right px-4 py-3">
                                        {formatAmount(transaction.amount)}
                                      </TableCell>
                                      <TableCell className="px-4 py-3">
                                        {transaction.status === "ledger-only" ? (
                                          <Badge className="rounded-lg bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30">
                                            <FileText className="w-3 h-3 mr-1" />
                                            Ledger Only
                                          </Badge>
                                        ) : (
                                          <Badge className="rounded-lg bg-accent/20 text-accent-foreground border-accent/30 dark:bg-accent/20 dark:text-accent-foreground dark:border-accent/30">
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
        </>
      )}
    </div>
  );
}