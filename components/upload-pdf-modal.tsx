"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, XCircle, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { MAX_FILE_SIZE, ALLOWED_PDF_TYPES } from "@/lib/types/transactions";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "parsing" | "success" | "error";
  transactions?: number;
}

interface UploadPdfModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadPdfModal({ open, onOpenChange }: UploadPdfModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              return {
                ...f,
                status: hasError ? "error" : "success",
                transactions: hasError ? undefined : 1,
              };
            }
            return f;
          })
        );

        if (result.processed > 0) {
          toast.success(result.message);
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
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-none"
                  >
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