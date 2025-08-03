"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/page-layout";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "parsing" | "success" | "error";
  transactions?: number;
}

export default function PDFUploadPage() {
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
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
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
                Upload PDF Receipts
              </h1>
              <p className="text-muted-foreground mt-1">
                Select multiple PDF files to process
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
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
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
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card className="bg-card border-muted mb-8">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Uploaded Files
                </h3>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(file.status)}
                        <div>
                          <p className="font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
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
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          {files.length > 0 && files.every((f) => f.status !== "parsing") && (
            <div className="text-center">
              <Button
                size="lg"
                className="px-8"
                disabled={files.every((f) => f.status === "error")}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}