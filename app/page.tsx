import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, CreditCard, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function HomePage() {
  const stats = {
    matches: 24,
    onlyInLedger: 3,
    onlyInBank: 7,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="relative flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 sm:h-16 items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Image
                src="/minerva-logo.avif"
                alt="Minerva"
                width={28}
                height={28}
                className="rounded-md sm:w-8 sm:h-8"
              />
              <span className="font-semibold text-base sm:text-lg">Minerva</span>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          {/* Hero Section */}
          <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12 md:mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Automated Transaction Matching
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Transaction Reconciler
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
              Upload your receipts and bank statements to automatically detect matched and unmatched transactions.
            </p>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            <Link href="/upload-pdf" className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-muted">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">PDF Receipts</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Upload receipt files from your email or computer
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base transition-all duration-300 group-hover:border-primary group-hover:text-primary"
                  >
                    Choose Files
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/upload-csv" className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-muted">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Bank Statement</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Import transactions from your bank CSV export
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base transition-all duration-300 group-hover:border-primary group-hover:text-primary"
                  >
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Card className="border-muted shadow-sm">
              <CardHeader className="text-center pb-2 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4 sm:mb-6" />
              <CardContent className="px-2 sm:px-6">
                <div className="grid grid-cols-3 divide-x divide-border">
                  <div className="text-center px-2 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-300 hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                        {stats.matches}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Matched
                    </div>
                  </div>
                  <div className="text-center px-2 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-300 hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                        {stats.onlyInLedger}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Ledger Only
                    </div>
                  </div>
                  <div className="text-center px-2 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-300 hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                        {stats.onlyInBank}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Bank Only
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Link href="/results">
              <Button 
                size="default"
                className="px-6 sm:px-8 text-sm sm:text-base h-10 sm:h-11 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View Results
              </Button>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
              Review all transactions and export reconciliation reports
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Image
                  src="/minerva.avif"
                  alt="Minerva"
                  width={16}
                  height={16}
                  className="rounded sm:w-5 sm:h-5"
                />
                <span>Powered by Minerva AI</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                © 2024 Minerva. Smart accounting for modern businesses.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}