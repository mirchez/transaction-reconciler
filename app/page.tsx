import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Upload, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const stats = [
    { label: "Matched", value: 24, variant: "default" },
    { label: "Ledger Only", value: 3, variant: "warning" },
    { label: "Bank Only", value: 7, variant: "info" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/minerva-logo.avif"
                alt="Minerva"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-lg tracking-tight">Minerva</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Transaction Reconciler
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload receipts and bank statements to automatically match transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* PDF Upload Card */}
              <Card className="group hover:shadow-lg transition-all duration-200 border-muted">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">PDF Receipts</CardTitle>
                  <CardDescription className="text-base">
                    Upload receipt files from email or computer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF files up to 10MB
                      </p>
                    </div>
                    <Link href="/upload-pdf" className="block">
                      <Button className="w-full" size="lg">
                        Upload Receipts
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* CSV Upload Card */}
              <Card className="group hover:shadow-lg transition-all duration-200 border-muted">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Bank Statement</CardTitle>
                  <CardDescription className="text-base">
                    Import transactions from your bank CSV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CSV files from any major bank
                      </p>
                    </div>
                    <Link href="/upload-csv" className="block">
                      <Button className="w-full" size="lg">
                        Upload Statement
                      </Button>
                    </Link>
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
                <Card key={stat.label} className="border-muted">
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <p className="text-4xl lg:text-5xl font-bold text-foreground">
                        {stat.value}
                      </p>
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
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                Ready to reconcile?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                View detailed analysis and export reconciliation reports with a single click.
              </p>
              <div className="pt-4">
                <Link href="/results">
                  <Button size="lg" className="px-8">
                    View Results
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Image
                src="/minerva.avif"
                alt="Minerva"
                width={20}
                height={20}
                className="rounded"
              />
              <span>© 2024 Minerva — Powered by AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}