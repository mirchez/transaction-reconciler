"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, FileText, TrendingUp } from "lucide-react";
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

export default function ResultsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2024-01-15",
      amount: "-$45.67",
      description: "STARBUCKS COFFEE #1234",
      source: "Both",
      status: "matched",
      category: "Food & Dining",
      merchant: "Starbucks",
      reference: "TXN001234",
      bankDescription: "STARBUCKS COFFEE #1234",
      receiptDescription: "Coffee and pastry purchase",
    },
    {
      id: "2",
      date: "2024-01-14",
      amount: "-$123.45",
      description: "AMAZON.COM PURCHASE",
      source: "Both",
      status: "matched",
      category: "Shopping",
      merchant: "Amazon",
      reference: "TXN001235",
      bankDescription: "AMAZON.COM PURCHASE",
      receiptDescription: "Office supplies and books",
    },
    {
      id: "3",
      date: "2024-01-13",
      amount: "-$89.99",
      description: "Office Supplies Receipt",
      source: "Ledger",
      status: "ledger-only",
      category: "Business",
      merchant: "Office Depot",
      reference: "RCP001236",
      receiptDescription: "Printer paper, pens, and folders",
    },
    {
      id: "4",
      date: "2024-01-12",
      amount: "-$25.00",
      description: "GAS STATION FUEL",
      source: "Bank",
      status: "bank-only",
      category: "Transportation",
      merchant: "Shell",
      reference: "TXN001237",
      bankDescription: "GAS STATION FUEL",
    },
    {
      id: "5",
      date: "2024-01-11",
      amount: "-$67.89",
      description: "Restaurant Dinner Receipt",
      source: "Ledger",
      status: "ledger-only",
      category: "Food & Dining",
      merchant: "The Italian Place",
      reference: "RCP001238",
      receiptDescription: "Dinner for two with wine",
    },
  ];

  const getFilteredTransactions = (filter: string) => {
    switch (filter) {
      case "matched":
        return transactions.filter((t) => t.status === "matched");
      case "ledger":
        return transactions.filter((t) => t.status === "ledger-only");
      case "bank":
        return transactions.filter((t) => t.status === "bank-only");
      default:
        return transactions;
    }
  };

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
    return (
      <span
        className={
          isNegative
            ? "text-foreground font-medium"
            : "text-green-600 dark:text-green-400 font-medium"
        }
      >
        {amount}
      </span>
    );
  };

  const stats = {
    total: transactions.length,
    matched: transactions.filter((t) => t.status === "matched").length,
    ledgerOnly: transactions.filter((t) => t.status === "ledger-only").length,
    bankOnly: transactions.filter((t) => t.status === "bank-only").length,
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Reconciliation Results
              </h1>
              <p className="text-muted-foreground mt-1">
                Review matched and unmatched transactions
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 p-6 bg-muted/30 rounded-none">
            <Card className="bg-card border-muted">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-muted">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.matched}</p>
                  <p className="text-sm text-muted-foreground">Matched</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-muted">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.ledgerOnly}</p>
                  <p className="text-sm text-muted-foreground">Ledger Only</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-muted">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.bankOnly}</p>
                  <p className="text-sm text-muted-foreground">Bank Only</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs and Table */}
          <Card className="bg-card border-muted shadow-sm">
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b border-border px-6 pt-6">
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                    <TabsTrigger value="matched">Matched</TabsTrigger>
                    <TabsTrigger value="ledger">Ledger Only</TabsTrigger>
                    <TabsTrigger value="bank">Bank Only</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <TransactionTable
                    transactions={transactions}
                    getStatusBadge={getStatusBadge}
                    formatAmount={formatAmount}
                  />
                </TabsContent>
                <TabsContent value="matched" className="mt-0">
                  <TransactionTable
                    transactions={getFilteredTransactions("matched")}
                    getStatusBadge={getStatusBadge}
                    formatAmount={formatAmount}
                  />
                </TabsContent>
                <TabsContent value="ledger" className="mt-0">
                  <TransactionTable
                    transactions={getFilteredTransactions("ledger")}
                    getStatusBadge={getStatusBadge}
                    formatAmount={formatAmount}
                  />
                </TabsContent>
                <TabsContent value="bank" className="mt-0">
                  <TransactionTable
                    transactions={getFilteredTransactions("bank")}
                    getStatusBadge={getStatusBadge}
                    formatAmount={formatAmount}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline">Export CSV</Button>
            <Button>Confirm Matches</Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

interface TransactionTableProps {
  transactions: Transaction[];
  getStatusBadge: (status: string) => JSX.Element | null;
  formatAmount: (amount: string) => JSX.Element;
}

function TransactionTable({ transactions, getStatusBadge, formatAmount }: TransactionTableProps) {
  const router = useRouter();
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
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
              <TableCell className="font-medium">{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {transaction.category || "-"}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(transaction.amount)}
              </TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}