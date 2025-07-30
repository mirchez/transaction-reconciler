"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Loader2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { MAX_FILE_SIZE, ALLOWED_CSV_TYPES, type CSVRow } from "@/lib/types/transactions";
import Papa from "papaparse";


interface UploadCsvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadCsvModal({ open, onOpenChange }: UploadCsvModalProps) {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setCsvData([]);
    setParseError(null);

    // Validate file
    if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
    setIsParsing(true);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          if (results.errors.length > 0) {
            setParseError(results.errors[0].message);
            toast.error("Failed to parse CSV file");
            setIsParsing(false);
            return;
          }

          // Transform data to display format
          const transformedData: CSVRow[] = results.data.map((row: any) => {
            // Try to find date, amount, and description columns
            let date = row.date || row.Date || row.transaction_date || row["transaction date"] || "";
            let amount = row.amount || row.Amount || row.debit || row.credit || row.Debit || row.Credit || "";
            let description = row.description || row.Description || row.merchant || row.Merchant || row.details || row.Details || "";

            // If columns not found, try by index
            if (!date && !amount && !description) {
              const values = Object.values(row);
              if (values.length >= 3) {
                date = values[0] as string;
                description = values[1] as string;
                amount = values[2] as string;
              }
            }

            return {
              date: date.toString(),
              amount: amount.toString(),
              description: description.toString(),
            };
          }).filter(row => row.date || row.amount || row.description); // Filter out empty rows

          if (transformedData.length === 0) {
            setParseError("No valid data found in CSV file");
            toast.error("No valid data found in CSV file");
          } else {
            setCsvData(transformedData.slice(0, 10)); // Show first 10 rows as preview
            toast.success(`Found ${results.data.length} transactions`);
          }
          setIsParsing(false);
        },
        error: (error) => {
          setParseError(error.message);
          toast.error("Failed to parse CSV file");
          setIsParsing(false);
        },
      });
    } catch (error) {
      console.error("File read error:", error);
      setParseError("Failed to read file");
      toast.error("Failed to read file");
      setIsParsing(false);
    }
  };

  const processStatement = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a session first
      if (!sessionId) {
        const sessionResponse = await fetch("/api/session", {
          method: "POST",
        });
        const session = await sessionResponse.json();
        setSessionId(session.id);
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        // Redirect to results page to see all transactions
        setTimeout(() => {
          router.push('/results');
          onOpenChange(false); // Close the modal
        }, 1500);
      } else {
        toast.error(result.message || "Failed to process CSV");
        if (result.errors && result.errors.length > 0) {
          // Show first few errors
          result.errors.slice(0, 3).forEach((err: any) => {
            toast.error(`Row ${err.row}: ${err.error}`);
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload CSV file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing && !isParsing) {
      setCsvData([]);
      setFileName("");
      setSelectedFile(null);
      setParseError(null);
      setSessionId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={handleClose} modal={true}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
          <DialogDescription>
            Select your CSV file to preview transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Example Download Section */}
          <div className="bg-muted/50 p-4 rounded-none border border-muted">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Need a template?</p>
                <p className="text-sm text-muted-foreground">Download an example CSV file with the correct format</p>
              </div>
              <a href="/example-bank-statement.csv" download>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Example CSV
                </Button>
              </a>
            </div>
          </div>

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
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload-modal"
              disabled={isProcessing || isParsing}
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

          {/* Error Message */}
          {parseError && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{parseError}</p>
            </div>
          )}

          {/* Preview Table */}
          {isParsing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Parsing CSV...</span>
            </div>
          ) : csvData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Showing {csvData.length} of {selectedFile ? "many" : "0"} transactions
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
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing || isParsing}
            >
              Cancel
            </Button>
            <Button
              onClick={processStatement}
              disabled={csvData.length === 0 || isProcessing || isParsing || !!parseError}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Statement"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}