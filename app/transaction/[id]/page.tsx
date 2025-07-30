"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { PageLayout } from "@/components/page-layout";

interface Transaction {
  id: string;
  date: string;
  amount: string;
  description: string;
  source: "Ledger" | "Bank" | "Both";
  status: "matched" | "ledger-only" | "bank-only";
  category?: string;
  merchant?: string;
  reference?: string;
  bankDescription?: string;
  receiptDescription?: string;
}

export default function TransactionDetailPage() {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const storedTransaction = sessionStorage.getItem("selectedTransaction");
    if (storedTransaction) {
      setTransaction(JSON.parse(storedTransaction));
    }
  }, []);

  if (!transaction) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Transaction not found</p>
            <Link href="/results">
              <Button variant="outline">Back to Results</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Matched
          </Badge>
        );
      case "ledger-only":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <FileText className="w-3 h-3 mr-1" />
            Ledger Only
          </Badge>
        );
      case "bank-only":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            Bank Only
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatAmount = (amount: string) => {
    const isNegative = amount.startsWith("-");
    const cleanAmount = amount.replace(/[+-]/g, "");
    return (
      <span
        className={`text-xl sm:text-2xl font-medium ${
          isNegative ? "text-foreground" : "text-green-600 dark:text-green-400"
        }`}
      >
        {isNegative ? "-" : "+"}
        {cleanAmount}
      </span>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Both":
        return (
          <div className="flex gap-1">
            <FileText className="w-4 h-4" />
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case "Ledger":
        return <FileText className="w-4 h-4" />;
      case "Bank":
        return <CreditCard className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <Link href="/results">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Results</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Transaction Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete information for this transaction
            </p>
          </div>
        </div>

        {/* Main Transaction Info */}
        <Card className="bg-card border-muted mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl font-medium text-foreground mb-2 leading-tight">
                  {transaction.description}
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getSourceIcon(transaction.source)}
                  <span className="text-sm">{transaction.source}</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                {formatAmount(transaction.amount)}
                <div className="mt-2">{getStatusBadge(transaction.status)}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium text-foreground">
                          {transaction.amount}
                        </p>
                      </div>
                    </div>

                    {transaction.category && (
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium text-foreground">
                            {transaction.category}
                          </p>
                        </div>
                      </div>
                    )}

                    {transaction.merchant && (
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Merchant</p>
                          <p className="font-medium text-foreground">
                            {transaction.merchant}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reference Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Reference Information
                  </h3>
                  <div className="space-y-4">
                    {transaction.reference && (
                      <div>
                        <p className="text-sm text-muted-foreground">Reference ID</p>
                        <p className="font-mono text-sm bg-muted/50 px-3 py-2 rounded border break-all">
                          {transaction.reference}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getSourceIcon(transaction.source)}
                        <Badge
                          variant="outline"
                          className="border-border text-muted-foreground"
                        >
                          {transaction.source}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Match Status</p>
                      <div className="mt-1">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Bank Statement Details */}
          {(transaction.source === "Bank" || transaction.source === "Both") && (
            <Card className="bg-card border-muted">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg font-medium text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  Bank Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium text-foreground mt-1 break-words">
                      {transaction.bankDescription || transaction.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-foreground mt-1">
                      {transaction.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground mt-1">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Receipt Details */}
          {(transaction.source === "Ledger" ||
            transaction.source === "Both") && (
            <Card className="bg-card border-muted">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg font-medium text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  Receipt/Ledger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium text-foreground mt-1 break-words">
                      {transaction.receiptDescription ||
                        transaction.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-foreground mt-1">
                      {transaction.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground mt-1">
                      {transaction.date}
                    </p>
                  </div>
                  {transaction.merchant && (
                    <div>
                      <p className="text-sm text-muted-foreground">Merchant</p>
                      <p className="font-medium text-foreground mt-1">
                        {transaction.merchant}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <Link href="/results">
            <Button className="px-6 sm:px-8 w-full sm:w-auto">
              Back to All Transactions
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </PageLayout>
  );
}
