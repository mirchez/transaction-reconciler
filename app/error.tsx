"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="border-0 shadow-sm bg-white max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-light text-slate-900">
              Something went wrong
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              We encountered an unexpected error while processing your request.
              Please try again or return to the homepage.
            </p>

            {/* Error details for development */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-auto text-slate-800">
                  {error.message}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50 bg-transparent"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
