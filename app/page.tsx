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
import { FileText, TrendingUp, CheckCircle2, RefreshCw } from "lucide-react";
import { UploadCsvModal } from "@/components/upload-csv-modal";
import { GmailMonitorModal } from "@/components/gmail-monitor-modal";
import { CenteredLogo } from "./components/centered-logo";
import { useGmailStatus } from "@/hooks/use-gmail";

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
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReconciled, setShowReconciled] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const { data: gmailStatus } = useGmailStatus();
  
  useEffect(() => {
    setMounted(true);
    fetchTransactions();
    
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
      
      alert(errorMessage);
      console.error("Gmail authentication error:", error);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("gmail_connected") === "true") {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions");
      
      if (!response.ok) {
        console.error("Failed to fetch transactions:", response.status, response.statusText);
        throw new Error("Failed to fetch transactions");
      }
      
      const data = await response.json();
      console.log("Fetched transactions:", data);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };


  const handleReconciliation = () => {
    setReconciling(true);
    setTimeout(() => {
      setShowReconciled(true);
      setReconciling(false);
    }, 1500);
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
    <div className="flex flex-col h-screen bg-white dark:bg-black">

      {/* Centered Logo - Header */}
      <CenteredLogo />

      {/* Scrollable Content Container */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="min-h-full">
          {/* Upload Data Card */}
          <section className="p-6">
            <div className="max-w-7xl mx-auto">
              <Card className="rounded-lg bg-card border border-gray-200 dark:border-zinc-800 shadow-sm">
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
                      {gmailStatus?.connected ? "Manage Email" : "Connect Email"}
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
              <Card className="rounded-lg bg-card border border-gray-200 dark:border-zinc-800 shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </CardContent>
              </Card>
            ) : transactions.length === 0 ? (
              <Card className="rounded-lg bg-card border border-gray-200 dark:border-zinc-800 shadow-sm">
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
                  <Card className="rounded-lg bg-card border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Ledger Only Transactions</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receipts without matching bank transactions
                        </p>
                      </div>
                      <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-gray-200 dark:border-zinc-800">
                              <TableHead className="font-medium bg-gray-50 dark:bg-zinc-800">Date</TableHead>
                              <TableHead className="font-medium bg-gray-50 dark:bg-zinc-800">Description</TableHead>
                              <TableHead className="font-medium bg-gray-50 dark:bg-zinc-800">Vendor</TableHead>
                              <TableHead className="font-medium bg-gray-50 dark:bg-zinc-800">Category</TableHead>
                              <TableHead className="font-medium text-right bg-gray-50 dark:bg-zinc-800">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                        </Table>
                        <div className="max-h-[300px] overflow-y-auto">
                          <Table>
                            <TableHeader className="sr-only">
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                          {ledgerOnlyTransactions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No ledger-only transactions
                              </TableCell>
                            </TableRow>
                          ) : (
                            ledgerOnlyTransactions.map((transaction) => (
                              <TableRow
                                key={transaction.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/transaction/${transaction.id}`)}
                              >
                                <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {transaction.vendor || "-"}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {transaction.category || "-"}
                                </TableCell>
                                <TableCell className="text-right">
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
                  <Card className="rounded-lg bg-card border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Bank Only Transactions</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bank transactions without matching receipts
                        </p>
                      </div>
                      <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-gray-200 dark:border-zinc-800">
                              <TableHead className="font-medium bg-gray-50 dark:bg-zinc-800">Date</TableHead>
                              <TableHead className="font-medium bg-gray-50 dark:bg-zinc-800">Description</TableHead>
                              <TableHead className="font-medium text-right bg-gray-50 dark:bg-zinc-800">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                        </Table>
                        <div className="max-h-[300px] overflow-y-auto">
                          <Table>
                            <TableHeader className="sr-only">
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
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
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/transaction/${transaction.id}`)}
                              >
                                <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className="text-right">
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

                {/* Run Reconciliation Button */}
                {transactions.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={handleReconciliation}
                      disabled={reconciling || (ledgerOnlyTransactions.length === 0 && bankOnlyTransactions.length === 0)}
                      className="rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white"
                      size="lg"
                    >
                      {reconciling ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Reconciling...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Run Reconciliation
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Reconciled Results - Only show after reconciliation */}
                {showReconciled && (
                  <>
                    <div className="border-t-2 border-muted pt-8">
                      <h2 className="text-xl font-semibold text-foreground mb-4">Reconciliation Results</h2>
                    </div>

                    {/* All Transactions Table */}
                    <Card className="rounded-none bg-card border-muted shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle>All Transactions</CardTitle>
                          </div>
                          <Badge variant="secondary" className="rounded-none">
                            {transactions.length} total
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactions.map((transaction) => (
                                <TableRow
                                  key={transaction.id}
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() => router.push(`/transaction/${transaction.id}`)}
                                >
                                  <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                                  <TableCell>{transaction.description}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="rounded-none">
                                      {transaction.source}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatAmount(transaction.amount)}
                                  </TableCell>
                                  <TableCell>
                                    {transaction.status === "matched" ? (
                                      <Badge className="rounded-none bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Matched
                                      </Badge>
                                    ) : transaction.status === "ledger-only" ? (
                                      <Badge className="rounded-none bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                                        <FileText className="w-3 h-3 mr-1" />
                                        Ledger Only
                                      </Badge>
                                    ) : (
                                      <Badge className="rounded-none bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Bank Only
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Matched Transactions Table */}
                    <Card className="rounded-none bg-card border-muted shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-none bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <CardTitle>Matched Transactions</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Successfully reconciled transactions
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="rounded-none">
                            {matchedTransactions.length} matched
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Ledger Description</TableHead>
                                <TableHead>Bank Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Match Score</TableHead>
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
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => router.push(`/transaction/${transaction.id}`)}
                                  >
                                    <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                                    <TableCell>{transaction.vendor || transaction.description}</TableCell>
                                    <TableCell className="text-muted-foreground">{transaction.description}</TableCell>
                                    <TableCell className="text-right">
                                      {formatAmount(transaction.amount)}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="rounded-none">
                                        {transaction.matchScore ? `${Math.round(transaction.matchScore)}%` : "100%"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            {transactions.length > 0 && (
              <div className="flex justify-end gap-4 mt-8">
                <Button variant="outline" className="rounded-none">Export CSV</Button>
                <Button className="rounded-none" disabled={matchedTransactions.length === 0}>
                  Confirm Matches
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="relative w-5 h-5">
                <Image
                  src="/minerva.avif"
                  alt="Minerva"
                  width={20}
                  height={20}
                  className="dark:brightness-110 brightness-90 contrast-125"
                />
              </div>
              <span>© 2024 Minerva — Powered by AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
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