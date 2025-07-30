"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

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

  const [activeTab, setActiveTab] = useState("all");

  const handleTransactionClick = (transaction: Transaction) => {
    sessionStorage.setItem("selectedTransaction", JSON.stringify(transaction));
    router.push(`/transaction/${transaction.id}`);
  };

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case "matched":
        return transactions.filter((t) => t.status === "matched");
      case "ledger-only":
        return transactions.filter((t) => t.status === "ledger-only");
      case "bank-only":
        return transactions.filter((t) => t.status === "bank-only");
      default:
        return transactions;
    }
  };

  const getPaginatedTransactions = () => {
    const filtered = getFilteredTransactions();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredTransactions().length / itemsPerPage);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
            Matched
          </Badge>
        );
      case "ledger-only":
        return (
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 text-xs"
          >
            Ledger
          </Badge>
        );
      case "bank-only":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Bank
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
            ? "text-slate-900 font-medium"
            : "text-emerald-600 font-medium"
        }
      >
        {amount}
      </span>
    );
  };

  const getTabCount = (status: string) => {
    return transactions.filter((t) => t.status === status).length;
  };

  const formatDateMobile = (date: string) => {
    return date.replace("2024-", "");
  };

  const truncateDescription = (description: string, maxLength = 20) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-900">
              Transaction Results
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Review matched and unmatched transactions
            </p>
          </div>
        </div>

        {/* Results Table */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Mobile Tabs - Scrollable */}
              <div className="sm:hidden mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("all")}
                    className="whitespace-nowrap text-xs"
                  >
                    All ({transactions.length})
                  </Button>
                  <Button
                    variant={activeTab === "matched" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("matched")}
                    className="whitespace-nowrap text-xs"
                  >
                    Matched ({getTabCount("matched")})
                  </Button>
                  <Button
                    variant={
                      activeTab === "ledger-only" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveTab("ledger-only")}
                    className="whitespace-nowrap text-xs"
                  >
                    Ledger ({getTabCount("ledger-only")})
                  </Button>
                  <Button
                    variant={activeTab === "bank-only" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("bank-only")}
                    className="whitespace-nowrap text-xs"
                  >
                    Bank ({getTabCount("bank-only")})
                  </Button>
                </div>
              </div>

              {/* Desktop Tabs */}
              <TabsList className="hidden sm:grid w-full grid-cols-4 mb-8 bg-slate-100">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white"
                >
                  All ({transactions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="matched"
                  className="data-[state=active]:bg-white"
                >
                  Matched ({getTabCount("matched")})
                </TabsTrigger>
                <TabsTrigger
                  value="ledger-only"
                  className="data-[state=active]:bg-white"
                >
                  Ledger ({getTabCount("ledger-only")})
                </TabsTrigger>
                <TabsTrigger
                  value="bank-only"
                  className="data-[state=active]:bg-white"
                >
                  Bank ({getTabCount("bank-only")})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                  {getPaginatedTransactions().map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-slate-50 rounded-lg p-4 cursor-pointer hover:bg-slate-100 smooth-transition"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-slate-900">
                          {formatDateMobile(transaction.date)}
                        </div>
                        <div className="text-right">
                          {formatAmount(transaction.amount)}
                        </div>
                      </div>
                      <div className="text-sm text-slate-700 mb-2">
                        {truncateDescription(transaction.description, 30)}
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-600 text-xs"
                        >
                          {transaction.source}
                        </Badge>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block border border-slate-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-slate-200">
                        <TableHead className="font-medium text-slate-700">
                          Date
                        </TableHead>
                        <TableHead className="font-medium text-slate-700 text-right">
                          Amount
                        </TableHead>
                        <TableHead className="font-medium text-slate-700">
                          Description
                        </TableHead>
                        <TableHead className="font-medium text-slate-700">
                          Source
                        </TableHead>
                        <TableHead className="font-medium text-slate-700">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedTransactions().map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="border-slate-100 hover:bg-slate-50 smooth-transition cursor-pointer"
                          onClick={() => handleTransactionClick(transaction)}
                        >
                          <TableCell className="font-medium text-slate-900">
                            {transaction.date}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatAmount(transaction.amount)}
                          </TableCell>
                          <TableCell className="text-slate-700 max-w-md">
                            <div
                              className="truncate"
                              title={transaction.description}
                            >
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-slate-200 text-slate-600"
                            >
                              {transaction.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Empty State */}
                {getFilteredTransactions().length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    No transactions found for this filter.
                  </div>
                )}

                {/* Pagination */}
                {getTotalPages() > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      Page {currentPage} of {getTotalPages()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="border-slate-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Previous</span>
                      </Button>

                      {/* Page Progress Bar - Mobile */}
                      <div className="sm:hidden flex-1 mx-4">
                        <div className="w-full bg-slate-200 rounded-full h-1">
                          <div
                            className="bg-slate-900 h-1 rounded-full smooth-transition"
                            style={{
                              width: `${
                                (currentPage / getTotalPages()) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(
                            Math.min(getTotalPages(), currentPage + 1)
                          )
                        }
                        disabled={currentPage === getTotalPages()}
                        className="border-slate-200"
                      >
                        <span className="hidden sm:inline mr-1">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
