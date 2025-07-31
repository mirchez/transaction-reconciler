"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, CheckCircle2, FileText, TrendingUp, Upload, RefreshCw } from "lucide-react";
import { PageLayout } from "@/components/page-layout";

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

export default function ResultsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReconciled, setShowReconciled] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  useEffect(() => {
    fetchTransactions();
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
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-none text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  Transaction Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Review unmatched transactions and perform reconciliation
                </p>
              </div>
            </div>
            <Button 
              onClick={handleReconciliation}
              disabled={reconciling || (ledgerOnlyTransactions.length === 0 && bankOnlyTransactions.length === 0)}
              className="rounded-none"
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

          {/* Empty State */}
          {loading ? (
            <Card className="rounded-none bg-card border-muted shadow-sm">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Loading transactions...</p>
              </CardContent>
            </Card>
          ) : transactions.length === 0 ? (
            <Card className="rounded-none bg-card border-muted shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-none flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No Transactions Yet!</h3>
                  <p className="text-muted-foreground">
                    Upload your receipts and bank statements to start managing transactions.
                  </p>
                  <div className="pt-4">
                    <Link href="/">
                      <Button className="rounded-none">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Ledger Only Table */}
              <Card className="rounded-none bg-card border-muted shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-none bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle>Ledger Only Transactions</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receipts without matching bank transactions
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-none">
                      {ledgerOnlyTransactions.length} items
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
                          <TableHead>Vendor</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
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
                </CardContent>
              </Card>

              {/* Bank Only Table */}
              <Card className="rounded-none bg-card border-muted shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-none bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle>Bank Only Transactions</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bank transactions without matching receipts
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-none">
                      {bankOnlyTransactions.length} items
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
                          <TableHead className="text-right">Amount</TableHead>
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
                </CardContent>
              </Card>

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
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" className="rounded-none">Export CSV</Button>
            <Button className="rounded-none" disabled={matchedTransactions.length === 0}>
              Confirm Matches
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}