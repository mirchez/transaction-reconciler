"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, TrendingUp, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UploadPdfModal } from "@/components/upload-pdf-modal";
import { UploadCsvModal } from "@/components/upload-csv-modal";
import { GmailStatus } from "@/components/gmail-status";
import { useGmailStatus } from "@/hooks/use-gmail";
import { useStats } from "@/hooks/use-stats";
import { AnimatedNumber } from "@/components/animated-number";
import { CenteredLogo } from "./components/centered-logo";

export default function HomePage() {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: statsData, isLoading: statsLoading } = useStats();
  
  const stats = [
    { label: "Matched", value: statsData?.matched || 0, variant: "default" },
    { label: "Ledger Only", value: statsData?.ledgerOnly || 0, variant: "warning" },
    { label: "Bank Only", value: statsData?.bankOnly || 0, variant: "info" },
  ];
  
  // Use React Query for Gmail status
  const { data: gmailStatus } = useGmailStatus();
  
  // Only render modals after component mounts to avoid SSR issues
  useEffect(() => {
    setMounted(true);
    
    // Check URL params for Gmail connection status (for redirect from OAuth)
    const params = new URLSearchParams(window.location.search);
    if (params.get("gmail_connected") === "true") {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  


  const handleGoogleConnect = async () => {
    try {
      const response = await fetch("/api/auth/google");
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Failed to connect to Google:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background pointer-events-none z-0" />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="relative flex-1">
        {/* Centered Logo */}
        <CenteredLogo />
        
        {/* Hero Section */}
        <section className="pb-12 sm:pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Transaction Reconciler
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload receipts and bank statements to automatically match
                transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Gmail Connect Section */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            {!gmailStatus?.connected ? (
              <Card className="bg-card border-muted">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Connect Gmail</h3>
                        <p className="text-sm text-muted-foreground">
                          Automatically process PDF receipts from your inbox
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleGoogleConnect}>
                      Connect Gmail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <GmailStatus email={gmailStatus.email || ""} />
            )}
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-12 sm:py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* PDF Upload Card */}
              <Card className="group hover:shadow-xl transition-all duration-200 border-muted bg-card">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">PDF Receipts</CardTitle>
                  <CardDescription className="text-base">
                    Upload receipt files from email or computer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-muted rounded-none p-8 text-center hover:border-primary/50 transition-colors bg-muted cursor-pointer"
                      onClick={() => setPdfModalOpen(true)}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF files up to 10MB
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setPdfModalOpen(true)}
                    >
                      Upload Receipts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* CSV Upload Card */}
              <Card className="group hover:shadow-xl transition-all duration-200 border-muted bg-card">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Bank Statement</CardTitle>
                  <CardDescription className="text-base">
                    Import transactions from your bank CSV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-muted rounded-none p-8 text-center hover:border-primary/50 transition-colors bg-muted cursor-pointer"
                      onClick={() => setCsvModalOpen(true)}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CSV files from any major bank
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setCsvModalOpen(true)}
                    >
                      Upload Statement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Current Status
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="border-muted bg-card hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <div className="text-4xl lg:text-5xl font-bold text-foreground">
                        <AnimatedNumber value={stat.value} />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Ready to reconcile?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                View detailed analysis and export reconciliation reports with a
                single click.
              </p>
              <div className="pt-4">
                <Link href="/results">
                  <Button
                    size="lg"
                    className="px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    View Results
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="relative w-5 h-5">
                <Image
                  src="/minerva.avif"
                  alt="Minerva"
                  width={20}
                  height={20}
                  className="dark:brightness-110 brightness-90 contrast-125"
                />
              </div>
              <span>© 2024 Minerva — Powered by AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>


      {/* Upload Modals - Only render after mount to avoid SSR issues */}
      {mounted && (
        <>
          <UploadPdfModal 
            open={pdfModalOpen} 
            onOpenChange={setPdfModalOpen}
          />
          <UploadCsvModal 
            open={csvModalOpen} 
            onOpenChange={setCsvModalOpen}
          />
        </>
      )}
    </div>
  );
}
