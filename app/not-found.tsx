"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="border-0 shadow-sm bg-white max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* 404 Icon */}
          <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8 text-slate-600" />
          </div>

          {/* 404 Message */}
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <h1 className="text-6xl font-light text-slate-300">404</h1>
              <h2 className="text-2xl font-light text-slate-900">
                Page not found
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Please check the URL or return to the homepage.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3">Quick Links</p>
            <div className="flex flex-col space-y-2 text-sm">
              <Link
                href="/upload-pdf"
                className="text-slate-600 hover:text-slate-900 smooth-transition"
              >
                Upload PDF Receipts
              </Link>
              <Link
                href="/upload-csv"
                className="text-slate-600 hover:text-slate-900 smooth-transition"
              >
                Upload CSV Statement
              </Link>
              <Link
                href="/results"
                className="text-slate-600 hover:text-slate-900 smooth-transition"
              >
                View Results
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
