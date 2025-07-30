"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building,
  Tag,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
  Upload,
} from "lucide-react";
import { PageLayout } from "@/components/page-layout";

interface SessionData {
  sessionId: string;
  ledgerEntries: any[];
  bankTransactions: any[];
  matches: any[];
  summary: {
    totalLedgerEntries: number;
    totalBankTransactions: number;
    totalMatches: number;
    unmatchedLedger: number;
    unmatchedBank: number;
  };
}

export default function TransactionDetailPage() {
  const params = useParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessionData();
  }, [params.id]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/session?id=${params.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch session data");
      }
      
      const data = await response.json();
      setSessionData(data);
    } catch (err) {
      console.error("Error fetching session data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading transaction data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !sessionData) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
            <p className="text-muted-foreground mb-4">{error || "Session not found"}</p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const isNegative = numAmount < 0;
    return (
      <span
        className={`font-medium ${
          isNegative ? "text-foreground" : "text-green-600 dark:text-green-400"
        }`}
      >
        ${Math.abs(numAmount).toFixed(2)}
      </span>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Upload Summary
            </h1>
            <p className="text-muted-foreground mt-1">
              Review your uploaded transactions
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-muted">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-none">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sessionData.summary.totalMatches}</p>
                  <p className="text-sm text-muted-foreground">Matched</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-muted">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-none">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sessionData.summary.totalLedgerEntries}</p>
                  <p className="text-sm text-muted-foreground">Ledger Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-muted">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-none">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sessionData.summary.totalBankTransactions}</p>
                  <p className="text-sm text-muted-foreground">Bank Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ledger Entries */}
        {sessionData.ledgerEntries.length > 0 && (
          <Card className="bg-card border-muted mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Ledger Entries (Receipts)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionData.ledgerEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell className="font-medium">{entry.vendor}</TableCell>
                        <TableCell className="text-right">{formatAmount(entry.amount)}</TableCell>
                        <TableCell>{entry.category || "-"}</TableCell>
                        <TableCell>
                          {entry.matched ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                              Matched
                            </Badge>
                          ) : (
                            <Badge variant="outline">Unmatched</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bank Transactions */}
        {sessionData.bankTransactions.length > 0 && (
          <Card className="bg-card border-muted mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                Bank Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionData.bankTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className="text-right">{formatAmount(transaction.amount)}</TableCell>
                        <TableCell>
                          {transaction.matched ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                              Matched
                            </Badge>
                          ) : (
                            <Badge variant="outline">Unmatched</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Data Message */}
        {sessionData.ledgerEntries.length === 0 && sessionData.bankTransactions.length === 0 && (
          <Card className="bg-card border-muted">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Transactions Found</h3>
              <p className="text-muted-foreground mb-6">
                Upload some receipts or bank statements to get started.
              </p>
              <Link href="/">
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-8 sm:mt-12 flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          {(sessionData.ledgerEntries.length > 0 || sessionData.bankTransactions.length > 0) && (
            <Link href="/results">
              <Button>
                View All Results
              </Button>
            </Link>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
}
