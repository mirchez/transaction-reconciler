"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Hash,
  Clock,
  Link2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { toast } from "sonner";

interface TransactionData {
  type: "matched" | "ledger" | "bank";
  match?: {
    id: string;
    score: number;
    createdAt: string;
    ledgerEntry: any;
    bankTransaction: any;
  };
  ledgerEntry?: any;
  bankTransaction?: any;
  potentialMatches?: any[];
}

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactionData();
  }, [params.id]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transaction/${params.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch transaction data");
      }
      
      const data = await response.json();
      setTransactionData(data);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      short: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const isNegative = numAmount < 0;
    return {
      value: `$${Math.abs(numAmount).toFixed(2)}`,
      isNegative,
      className: isNegative ? "text-foreground" : "text-green-600 dark:text-green-400"
    };
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 dark:text-green-400";
    if (score >= 0.7) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 0.9) return "Excellent Match";
    if (score >= 0.7) return "Good Match";
    if (score >= 0.5) return "Possible Match";
    return "Weak Match";
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading transaction details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !transactionData) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-medium text-foreground mb-2">Transaction Not Found</h3>
            <p className="text-muted-foreground mb-6">{error || "The requested transaction could not be found."}</p>
            <Link href="/results">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const renderMatchedTransaction = () => {
    if (!transactionData.match) return null;
    const { match } = transactionData;
    const ledgerDate = formatDate(match.ledgerEntry.date);
    const bankDate = formatDate(match.bankTransaction.date);
    const ledgerAmount = formatAmount(match.ledgerEntry.amount);
    const bankAmount = formatAmount(match.bankTransaction.amount);

    return (
      <>
        {/* Match Score Card */}
        <Card className="bg-card border-muted mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Match Confidence</CardTitle>
              <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Matched
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Match Score</span>
                  <span className={`text-2xl font-bold ${getMatchScoreColor(match.score)}`}>
                    {(match.score * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={match.score * 100} className="h-2" />
                <p className={`text-sm mt-2 ${getMatchScoreColor(match.score)}`}>
                  {getMatchScoreLabel(match.score)}
                </p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Matched on {formatDate(match.createdAt).short}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side by Side Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Ledger Entry Details */}
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Receipt Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vendor</p>
                <p className="text-lg font-semibold text-foreground">{match.ledgerEntry.vendor}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className={`text-lg font-semibold ${ledgerAmount.className}`}>
                    {ledgerAmount.value}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="secondary" className="mt-1">
                    <Tag className="w-3 h-3 mr-1" />
                    {match.ledgerEntry.category || "Uncategorized"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{ledgerDate.full}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Entry ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded-none font-mono">
                  {match.ledgerEntry.id}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transaction Details */}
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Bank Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-lg font-semibold text-foreground">{match.bankTransaction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className={`text-lg font-semibold ${bankAmount.className}`}>
                    {bankAmount.value}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <Badge variant="secondary" className="mt-1">
                    {bankAmount.isNegative ? "Debit" : "Credit"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{bankDate.full}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded-none font-mono">
                  {match.bankTransaction.id}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-card border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => toast.success("Match confirmed")}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Match
              </Button>
              <Button variant="outline" className="text-destructive" onClick={() => toast.error("Match rejected")}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Match
              </Button>
              <Button variant="outline" onClick={() => router.push('/results')}>
                View in Context
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderUnmatchedTransaction = () => {
    const isLedger = transactionData.type === "ledger";
    const transaction = isLedger ? transactionData.ledgerEntry : transactionData.bankTransaction;
    const date = formatDate(transaction.date);
    const amount = formatAmount(transaction.amount);

    return (
      <>
        {/* Transaction Details */}
        <Card className="bg-card border-muted mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                {isLedger ? (
                  <>
                    <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Receipt Details
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Bank Transaction
                  </>
                )}
              </CardTitle>
              <Badge variant="outline">
                <AlertCircle className="w-3 h-3 mr-1" />
                Unmatched
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {isLedger ? "Vendor" : "Description"}
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {isLedger ? transaction.vendor : transaction.description}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className={`text-2xl font-bold ${amount.className}`}>
                    {amount.value}
                  </p>
                </div>
                
                {isLedger && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <Badge variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {transaction.category || "Uncategorized"}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{date.full}</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{date.time}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm">Awaiting match</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded-none font-mono">
                    {transaction.id}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Potential Matches */}
        {transactionData.potentialMatches && transactionData.potentialMatches.length > 0 && (
          <Card className="bg-card border-muted">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Potential Matches</CardTitle>
              <CardDescription>
                Found {transactionData.potentialMatches.length} potential match{transactionData.potentialMatches.length !== 1 ? 'es' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionData.potentialMatches.map((match: any) => {
                  const matchTransaction = isLedger ? match.bankTransaction : match.ledgerEntry;
                  const matchAmount = formatAmount(matchTransaction.amount);
                  const matchDate = formatDate(matchTransaction.date);
                  
                  return (
                    <div
                      key={match.id}
                      className="p-4 border border-border rounded-none hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/transaction/${match.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {isLedger ? matchTransaction.description : matchTransaction.vendor}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">{matchDate.short}</span>
                            <span className={`text-sm font-medium ${matchAmount.className}`}>
                              {matchAmount.value}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {(match.matchScore * 100).toFixed(0)}% match
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Matches Found */}
        {(!transactionData.potentialMatches || transactionData.potentialMatches.length === 0) && (
          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Matches Found</h3>
              <p className="text-muted-foreground mb-6">
                This transaction doesn't have any potential matches in the system.
              </p>
              <Button variant="outline" onClick={() => router.push('/results')}>
                Browse All Transactions
              </Button>
            </CardContent>
          </Card>
        )}
      </>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/results">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Transaction Details
              </h1>
              <p className="text-muted-foreground mt-1">
                {transactionData.type === "matched" 
                  ? "Viewing matched transaction pair"
                  : `Viewing ${transactionData.type === "ledger" ? "receipt" : "bank transaction"}`
                }
              </p>
            </div>
          </div>

          {/* Transaction Content */}
          {transactionData.type === "matched" 
            ? renderMatchedTransaction() 
            : renderUnmatchedTransaction()
          }
        </div>
      </div>
    </PageLayout>
  );
}