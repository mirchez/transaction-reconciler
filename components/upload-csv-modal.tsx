"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Loader2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import {
  MAX_FILE_SIZE,
  ALLOWED_CSV_TYPES,
  type CSVRow,
  type RawCSVRow,
} from "@/lib/types/transactions";
import Papa from "papaparse";
import { useGmailStatus } from "@/hooks/use-gmail";
import { useQueryClient } from "@tanstack/react-query";

interface UploadCsvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload?: (fileInfo: {
    name: string;
    size: string;
    uploadTime: string;
  }) => void;
}

export function UploadCsvModal({
  open,
  onOpenChange,
  onFileUpload,
}: UploadCsvModalProps) {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [rawCsvData, setRawCsvData] = useState<RawCSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
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
    setRawCsvData([]);
    setCsvHeaders([]);
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
      const fileSize =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      onFileUpload({
        name: file.name,
        size: fileSize,
        uploadTime: new Date().toLocaleTimeString(),
      });
    }

    try {
      const text = await file.text();

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            setParseError(results.errors[0].message);
            toast.error("Failed to parse CSV file");
            setIsParsing(false);
            return;
          }

          // Store raw data exactly as uploaded
          const rawData: RawCSVRow[] = results.data
            .filter((row: any) => {
              // Filter out completely empty rows
              return Object.values(row).some(value => value && value.toString().trim() !== '');
            })
            .map((row: any) => {
              // Convert all values to strings and trim whitespace
              const cleanRow: RawCSVRow = {};
              for (const [key, value] of Object.entries(row)) {
                cleanRow[key] = value ? value.toString().trim() : '';
              }
              return cleanRow;
            });

          if (rawData.length === 0) {
            setParseError("No valid data found in CSV file");
            toast.error("No valid data found in CSV file");
            setIsParsing(false);
            return;
          }

          // Get headers from the first row
          const headers = Object.keys(rawData[0]);
          setCsvHeaders(headers);

          // Store raw data for preview (limit to first 10 rows)
          setRawCsvData(rawData.slice(0, 10));

          // Also create the legacy transformed data for backward compatibility
          const transformedData: CSVRow[] = rawData
            .map((row: RawCSVRow) => {
              // Try to find date, amount, and description columns
              let date = '';
              let amount = '';
              let description = '';

              // Search for date columns
              for (const [key, value] of Object.entries(row)) {
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('date') && !date) {
                  date = value;
                } else if ((lowerKey.includes('amount') || lowerKey.includes('debit') || lowerKey.includes('credit')) && !amount) {
                  amount = value;
                } else if ((lowerKey.includes('description') || lowerKey.includes('merchant') || lowerKey.includes('details')) && !description) {
                  description = value;
                }
              }

              // If columns not found, try by index
              if (!date && !amount && !description) {
                const values = Object.values(row);
                if (values.length >= 3) {
                  date = values[0];
                  description = values[1];
                  amount = values[2];
                }
              }

              return {
                date: date,
                amount: amount,
                description: description,
              };
            });

          setCsvData(transformedData.slice(0, 10));
          toast.success("CSV uploaded successfully");
          setIsParsing(false);
        },
        error: (error: any) => {
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    if (!selectedFile || rawCsvData.length === 0) {
      toast.error("No file selected or no data parsed");
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
      
      // Also include ALL the raw parsed data for future OpenAI processing
      // We need to re-parse the file to get ALL rows, not just the preview
      const fullText = await selectedFile.text();
      const fullParseResult = await new Promise<any>((resolve) => {
        Papa.parse(fullText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          complete: resolve
        });
      });

      const allRawData = fullParseResult.data
        .filter((row: any) => {
          return Object.values(row).some(value => value && value.toString().trim() !== '');
        })
        .map((row: any) => {
          const cleanRow: RawCSVRow = {};
          for (const [key, value] of Object.entries(row)) {
            cleanRow[key] = value ? value.toString().trim() : '';
          }
          return cleanRow;
        });

      formData.append("rawData", JSON.stringify({
        headers: csvHeaders,
        data: allRawData,
        totalRows: allRawData.length
      }));

      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.status === 409) {
        // Handle duplicate file error
        toast.error("File already exists", {
          description:
            result.message ||
            "This CSV file has already been uploaded - duplicate files are not allowed",
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
      setRawCsvData([]);
      setCsvHeaders([]);
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
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] bg-white dark:bg-popover border-border rounded-none">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground">
            Upload Bank Statement
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
            Select your CSV file to preview and import bank transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Example Download Section */}
          <div className="bg-muted/50 p-3 sm:p-4 rounded-none border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  Need a template?
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Download an example CSV file with the correct format
                </p>
              </div>
              <a href="/example-bank-statement.csv" download>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto rounded-none"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Example CSV</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-none p-3 sm:p-4 text-center transition-colors ${
              isDragging
                ? "border-primary bg-accent/10"
                : "border-border hover:border-muted-foreground bg-muted/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4 sm:mb-6">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
              <p className="text-base sm:text-lg font-medium text-foreground mb-2">
                Drop CSV file here
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                or click to browse
              </p>
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
                className="border-gray-300 dark:border-border text-xs sm:text-sm px-3 sm:px-4 rounded-none"
              >
                <span>
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </label>
          </div>

          {/* Error Message */}
          {parseError && (
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-none text-destructive-foreground">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs sm:text-sm">{parseError}</p>
            </div>
          )}

          {/* Preview Table */}
          {isParsing ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm sm:text-base text-muted-foreground">
                Parsing CSV...
              </span>
            </div>
          ) : (
            rawCsvData.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <h3 className="text-xs sm:text-sm font-medium text-foreground">
                    Preview - All Columns
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Showing {rawCsvData.length} of many rows with {csvHeaders.length} columns
                  </p>
                </div>
                <div className="border border-border rounded-none overflow-hidden bg-card">
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 border-b border-border">
                          {csvHeaders.map((header, index) => (
                            <TableHead 
                              key={index} 
                              className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-foreground whitespace-nowrap min-w-[120px]"
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rawCsvData.map((row, rowIndex) => (
                          <TableRow
                            key={rowIndex}
                            className="border-b border-border hover:bg-muted/20"
                          >
                            {csvHeaders.map((header, colIndex) => (
                              <TableCell 
                                key={colIndex}
                                className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground whitespace-nowrap"
                                title={row[header] || ''}
                              >
                                <div className="max-w-[200px] truncate">
                                  {row[header] || ''}
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing || isParsing}
              className="border-gray-300 dark:border-gray-700 text-xs sm:text-sm order-2 sm:order-1 rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={processStatement}
              disabled={
                rawCsvData.length === 0 ||
                isProcessing ||
                isParsing ||
                !!parseError
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm order-1 sm:order-2 rounded-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                  <span className="text-xs sm:text-sm">Processing...</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">Process Statement</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
