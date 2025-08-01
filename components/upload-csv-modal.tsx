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
import { useGmailStatus } from "@/hooks/use-gmail";
import { useQueryClient } from "@tanstack/react-query";


interface UploadCsvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload?: (fileInfo: {name: string, size: string, uploadTime: string}) => void;
}

export function UploadCsvModal({ open, onOpenChange, onFileUpload }: UploadCsvModalProps) {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { data: gmailStatus } = useGmailStatus();
  const queryClient = useQueryClient();


  const processFile = async (file: File) => {
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
    
    // Call the callback with file info
    if (onFileUpload) {
      const fileSize = file.size < 1024 * 1024 
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      
      onFileUpload({
        name: file.name,
        size: fileSize,
        uploadTime: new Date().toLocaleTimeString()
      });
    }

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
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
      formData.append("email", gmailStatus?.email || "");

      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.status === 409) {
        // Handle duplicate file error
        toast.error("File already exists", {
          description: result.message || "This CSV file has already been uploaded - duplicate files are not allowed",
        });
      } else if (result.success) {
        // Check if there were any duplicates skipped
        if (result.stats?.duplicates > 0) {
          toast.warning(result.message, {
            description: `${result.stats.duplicates} duplicate transactions were skipped`,
          });
        } else {
          toast.success(result.message);
        }
        // Invalidate queries to refresh data smoothly
        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        await queryClient.invalidateQueries({ queryKey: ["gmail-status"] });
        onOpenChange(false); // Close the modal
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
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-popover border-border rounded-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-semibold text-foreground">Upload Bank Statement</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Select your CSV file to preview and import bank transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Example Download Section */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Need a template?</p>
                <p className="text-sm text-muted-foreground">Download an example CSV file with the correct format</p>
              </div>
              <a href="/example-bank-statement.csv" download>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Example CSV
                </Button>
              </a>
            </div>
          </div>

          {/* Upload Zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging 
                ? "border-primary bg-accent/10" 
                : "border-border hover:border-muted-foreground bg-muted/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-6">
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
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
                className="rounded-lg border-gray-300 dark:border-border"
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
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive-foreground">
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
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="w-full bg-muted/30 border-b border-border">
                  <div className="flex text-sm font-medium text-foreground">
                    <div className="px-6 py-3 w-[140px]">Date</div>
                    <div className="px-6 py-3 w-[120px] text-right">Amount</div>
                    <div className="px-6 py-3 flex-1">Description</div>
                  </div>
                </div>
                <div className="max-h-[110px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sr-only">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((row, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-border"
                        >
                          <TableCell className="font-medium px-6 py-3 w-[140px]">
                            {row.date}
                          </TableCell>
                          <TableCell className="text-right px-6 py-3 w-[120px]">
                            {formatAmount(row.amount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground px-6 py-3">
                            {row.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing || isParsing}
              className="rounded-lg border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={processStatement}
              disabled={csvData.length === 0 || isProcessing || isParsing || !!parseError}
              className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
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