"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Upload } from "lucide-react";
import { PageLayout } from "@/components/page-layout";

interface CSVRow {
  date: string;
  amount: string;
  description: string;
}

export default function CSVUploadPage() {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const mockCSVData: CSVRow[] = [
    {
      date: "2024-01-15",
      amount: "-$45.67",
      description: "STARBUCKS COFFEE #1234",
    },
    {
      date: "2024-01-14",
      amount: "-$123.45",
      description: "AMAZON.COM PURCHASE",
    },
    {
      date: "2024-01-13",
      amount: "+$2,500.00",
      description: "SALARY DEPOSIT - ACME CORP",
    },
    {
      date: "2024-01-12",
      amount: "-$89.99",
      description: "GROCERY STORE PURCHASE",
    },
    { date: "2024-01-11", amount: "-$25.00", description: "GAS STATION FUEL" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setTimeout(() => {
        setCsvData(mockCSVData);
      }, 1000);
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

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 sm:mb-12">
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
                Upload Bank Statement
              </h1>
              <p className="text-muted-foreground mt-1">
                Select your CSV file to preview transactions
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <Card className="bg-card border-muted mb-8">
            <CardContent className="p-8 sm:p-12">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 sm:p-16 text-center hover:border-primary/50 transition-colors bg-background/50">
                <div className="mb-6">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Drop CSV file here
                  </p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button
                    variant="outline"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Preview Table */}
          {csvData.length > 0 && (
            <Card className="bg-card border-muted mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-foreground">Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {csvData.length} transactions
                  </p>
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-background/50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">
                          Date
                        </TableHead>
                        <TableHead className="font-medium text-right">
                          Amount
                        </TableHead>
                        <TableHead className="font-medium">
                          Description
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((row, index) => (
                        <TableRow
                          key={index}
                        >
                          <TableCell className="font-medium">
                            {row.date}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatAmount(row.amount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {row.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          {csvData.length > 0 && (
            <div className="text-center">
              <Button size="lg" className="px-8">
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}