"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);

    const newFiles: UploadedFile[] = uploadedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "parsing",
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: Math.random() > 0.2 ? "success" : "error",
                  transactions:
                    Math.random() > 0.2
                      ? Math.floor(Math.random() * 10) + 1
                      : undefined,
                }
              : f
          )
        );
      }, (index + 1) * 1500);
    });
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
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload PDF Receipts</DialogTitle>
          <DialogDescription>
            Select multiple PDF files to process
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-muted rounded-lg p-8 sm:p-12 text-center hover:border-primary/50 transition-colors bg-card">
            <div className="mb-6">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground mb-2">
                Drop PDF files here
              </p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload-modal"
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
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.size}
                          {file.transactions &&
                            ` • ${file.transactions} transactions`}
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
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={files.length === 0 || files.some((f) => f.status === "parsing")}
            >
              Process Files
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}