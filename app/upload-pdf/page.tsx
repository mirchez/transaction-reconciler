"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";

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
        return <Loader2 className="w-4 h-4 animate-spin text-slate-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "parsing":
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            Processing
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Complete
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="destructive"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
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
              Upload PDF Receipts
            </h1>
            <p className="text-slate-600 mt-2">
              Select multiple PDF files to process
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <Card className="border-0 shadow-sm bg-white mb-8">
          <CardContent className="p-12">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-16 text-center hover:border-slate-300 smooth-transition">
              <div className="mb-6">
                <p className="text-lg text-slate-900 mb-2">
                  Drop PDF files here
                </p>
                <p className="text-sm text-slate-500">or click to browse</p>
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
                  className="border-slate-200 hover:bg-slate-50 bg-transparent"
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
          <Card className="border-0 shadow-sm bg-white mb-8">
            <CardContent className="p-8">
              <h3 className="text-lg font-medium text-slate-900 mb-6">
                Uploaded Files
              </h3>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium text-slate-900">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-500">
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
              className="bg-slate-900 hover:bg-slate-800 text-white px-8"
              disabled={files.every((f) => f.status === "error")}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
