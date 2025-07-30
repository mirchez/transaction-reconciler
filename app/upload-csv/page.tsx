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
            ? "text-slate-900 font-medium"
            : "text-emerald-600 font-medium"
        }
      >
        {amount}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-light text-slate-900">
              Upload Bank Statement
            </h1>
            <p className="text-slate-600 mt-2">
              Select your CSV file to preview transactions
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <Card className="border-0 shadow-sm bg-white mb-8">
          <CardContent className="p-12">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-16 text-center hover:border-slate-300 smooth-transition">
              <div className="mb-6">
                <p className="text-lg text-slate-900 mb-2">
                  Drop CSV file here
                </p>
                <p className="text-sm text-slate-500">or click to browse</p>
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
                  className="border-slate-200 hover:bg-slate-50 bg-transparent"
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
          <Card className="border-0 shadow-sm bg-white mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-slate-900">Preview</h3>
                <p className="text-sm text-slate-500">
                  {csvData.length} transactions
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((row, index) => (
                      <TableRow
                        key={index}
                        className="border-slate-100 hover:bg-slate-50 smooth-transition"
                      >
                        <TableCell className="font-medium text-slate-900">
                          {row.date}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatAmount(row.amount)}
                        </TableCell>
                        <TableCell className="text-slate-700">
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
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8">
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
