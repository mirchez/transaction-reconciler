"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, CheckCircle, XCircle, Loader2, FileText, Download, Calendar, DollarSign, Building } from "lucide-react";
import { toast } from "sonner";
import { MAX_FILE_SIZE, ALLOWED_PDF_TYPES } from "@/lib/types/transactions";
import { jsPDF } from "jspdf";

interface ExtractedData {
  date: string;
  amount: number;
  vendor: string;
  category?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "pending" | "parsing" | "success" | "error";
  transactions?: number;
  extractedData?: ExtractedData[];
}

interface UploadPdfModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadPdfModal({ open, onOpenChange }: UploadPdfModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);

    // Validate files
    const validFiles = uploadedFiles.filter((file) => {
      if (!ALLOWED_PDF_TYPES.includes(file.type) && !file.name.endsWith('.pdf')) {
        toast.error(`${file.name} is not a PDF file`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds maximum size of 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = validFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "parsing",
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Mark files as ready for processing
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          newFiles.find((nf) => nf.id === f.id)
            ? { ...f, status: "pending" as const }
            : f
        )
      );
    }, 100);
  };

  const processFiles = async () => {
    if (files.filter(f => f.status === "pending").length === 0) {
      toast.error("No files to process");
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
      const fileInput = fileInputRef.current;
      
      if (!fileInput?.files) {
        throw new Error("No files selected");
      }

      // Add all pending files to FormData
      Array.from(fileInput.files).forEach((file) => {
        const fileInfo = files.find(f => f.name === file.name && f.status === "pending");
        if (fileInfo) {
          formData.append("files", file);
        }
      });

      // Update UI to show processing
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "pending" ? { ...f, status: "parsing" } : f
        )
      );

      const response = await fetch("/api/upload/pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update file statuses based on results
        setFiles((prev) =>
          prev.map((f) => {
            if (f.status === "parsing") {
              const hasError = result.errors?.some((e: any) => 
                f.name === e.error?.split(":")[0]?.replace("File ", "")
              );
              
              // Extract data for successful files
              const extractedData = hasError ? undefined : result.extractedData?.filter((d: any) => 
                d.fileName === f.name
              ).map((d: any) => ({
                date: new Date(d.date).toLocaleDateString(),
                amount: d.amount,
                vendor: d.vendor,
                category: d.category,
              }));
              
              return {
                ...f,
                status: hasError ? "error" : "success",
                transactions: extractedData?.length || (hasError ? undefined : 1),
                extractedData,
              };
            }
            return f;
          })
        );

        if (result.processed > 0) {
          toast.success(result.message);
          
          // Redirect to transaction detail page after a short delay
          setTimeout(() => {
            router.push(`/transaction/${sessionId || 'latest'}`);
          }, 1500);
        }
        if (result.failed > 0) {
          toast.error(`Failed to process ${result.failed} file(s)`);
        }
      } else {
        // Mark all processing files as error
        setFiles((prev) =>
          prev.map((f) =>
            f.status === "parsing" ? { ...f, status: "error" } : f
          )
        );
        toast.error(result.message || "Failed to process files");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "parsing" ? { ...f, status: "error" } : f
        )
      );
      toast.error("Failed to upload files");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      clearFiles();
      setSessionId(null);
      onOpenChange(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "parsing":
        return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Ready
          </Badge>
        );
      case "parsing":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Processing
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            Complete
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={true}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload PDF Receipts</DialogTitle>
          <DialogDescription>
            Select multiple PDF files to process
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Example Download Section */}
          <div className="bg-muted/50 p-4 rounded-none border border-muted">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">New to this?</p>
                <p className="text-sm text-muted-foreground">Download an example PDF receipt to see the expected format</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Create a proper PDF receipt
                  const doc = new jsPDF();
                  
                  // Header
                  doc.setFontSize(24);
                  doc.text('RECEIPT', 105, 20, { align: 'center' });
                  
                  // Company info
                  doc.setFontSize(16);
                  doc.text('Tech Solutions Inc.', 105, 35, { align: 'center' });
                  doc.setFontSize(10);
                  doc.text('123 Business Ave, Suite 100', 105, 42, { align: 'center' });
                  doc.text('San Francisco, CA 94105', 105, 48, { align: 'center' });
                  doc.text('Phone: (555) 123-4567', 105, 54, { align: 'center' });
                  
                  // Line separator
                  doc.line(20, 60, 190, 60);
                  
                  // Receipt details
                  doc.setFontSize(12);
                  doc.text('Receipt #: RCP-2024-0115', 20, 70);
                  doc.text('Date: January 15, 2024', 20, 78);
                  doc.text('Time: 2:30 PM', 20, 86);
                  
                  // Line separator
                  doc.line(20, 92, 190, 92);
                  
                  // Items
                  doc.setFontSize(12);
                  doc.text('ITEMS', 20, 102);
                  doc.setFontSize(10);
                  
                  // Item 1
                  doc.text('Software License - Professional', 20, 112);
                  doc.text('1 x $299.99', 40, 120);
                  doc.text('$299.99', 170, 120, { align: 'right' });
                  
                  // Item 2
                  doc.text('Support Package - 1 Year', 20, 130);
                  doc.text('1 x $49.99', 40, 138);
                  doc.text('$49.99', 170, 138, { align: 'right' });
                  
                  // Item 3
                  doc.text('Training Session - Online', 20, 148);
                  doc.text('2 x $75.00', 40, 156);
                  doc.text('$150.00', 170, 156, { align: 'right' });
                  
                  // Line separator
                  doc.line(20, 162, 190, 162);
                  
                  // Totals
                  doc.setFontSize(10);
                  doc.text('Subtotal:', 130, 172);
                  doc.text('$499.98', 170, 172, { align: 'right' });
                  
                  doc.text('Tax (8.5%):', 130, 180);
                  doc.text('$42.50', 170, 180, { align: 'right' });
                  
                  doc.setFontSize(12);
                  doc.setFont(undefined, 'bold');
                  doc.text('Total:', 130, 190);
                  doc.text('$542.48', 170, 190, { align: 'right' });
                  
                  // Payment info
                  doc.setFont(undefined, 'normal');
                  doc.setFontSize(10);
                  doc.text('Payment Method: Credit Card ****1234', 20, 205);
                  doc.text('Transaction ID: TXN-2024-0115-001', 20, 213);
                  
                  // Footer
                  doc.line(20, 220, 190, 220);
                  doc.setFontSize(10);
                  doc.text('Thank you for your purchase!', 105, 230, { align: 'center' });
                  doc.text('Please keep this receipt for your records', 105, 238, { align: 'center' });
                  
                  // Save the PDF
                  doc.save('example-receipt.pdf');
                  toast.success("Example PDF receipt downloaded");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Example PDF
              </Button>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-muted rounded-none p-8 sm:p-12 text-center hover:border-primary/50 transition-colors bg-card">
            <div className="mb-6">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground mb-2">
                Drop PDF files here
              </p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload-modal"
              disabled={isProcessing}
            />
            <label htmlFor="pdf-upload-modal">
              <Button
                variant="outline"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </span>
              </Button>
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Uploaded Files
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file) => (
                  <div key={file.id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-none">
                      <div className="flex items-center gap-3">
                        {file.status === "pending" ? (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          getStatusIcon(file.status)
                        )}
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.size}
                            {file.transactions &&
                              ` • ${file.transactions} transaction(s) extracted`}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(file.status)}
                    </div>
                    
                    {/* Show extracted data for successful files */}
                    {file.status === "success" && file.extractedData && file.extractedData.length > 0 && (
                      <div className="ml-4 mr-4 mb-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Extracted Data:</p>
                        <div className="border border-border rounded-none overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="h-8">
                                <TableHead className="text-xs h-8 py-1">Date</TableHead>
                                <TableHead className="text-xs h-8 py-1">Vendor</TableHead>
                                <TableHead className="text-xs h-8 py-1 text-right">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {file.extractedData.map((data, idx) => (
                                <TableRow key={idx} className="h-8">
                                  <TableCell className="text-xs h-8 py-1">{data.date}</TableCell>
                                  <TableCell className="text-xs h-8 py-1">{data.vendor}</TableCell>
                                  <TableCell className="text-xs h-8 py-1 text-right font-medium">
                                    ${data.amount.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div>
              {files.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFiles}
                  disabled={isProcessing}
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
              >
                {files.some(f => f.status === "success") ? "Done" : "Cancel"}
              </Button>
              <Button
                onClick={processFiles}
                disabled={
                  isProcessing ||
                  files.length === 0 ||
                  !files.some((f) => f.status === "pending")
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Files"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}