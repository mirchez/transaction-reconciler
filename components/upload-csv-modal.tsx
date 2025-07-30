"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload } from "lucide-react";

interface CSVRow {
  date: string;
  amount: string;
  description: string;
}

interface UploadCsvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadCsvModal({ open, onOpenChange }: UploadCsvModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
          <DialogDescription>
            Select your CSV file to preview transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-muted rounded-none p-8 text-center hover:border-primary/50 transition-colors bg-card">
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
              id="csv-upload-modal"
            />
            <label htmlFor="csv-upload-modal">
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

          {/* Preview Table */}
          {csvData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {csvData.length} transactions
                </p>
              </div>
              <div className="border border-border rounded-none overflow-hidden bg-card">
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
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={csvData.length === 0}
            >
              Process Statement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}