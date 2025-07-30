import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";

export default function HomePage() {
  const stats = {
    matches: 24,
    onlyInLedger: 3,
    onlyInBank: 7,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Transaction Reconciler
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your receipts and bank statements to automatically detect
            matched and unmatched transactions.
          </p>
        </div>

        {/* Upload Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link href="/upload-pdf" className="group">
            <Card className="h-full border-0 shadow-sm hover:shadow-md smooth-transition bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-200 smooth-transition">
                  <FileText className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">
                  PDF Receipts
                </h3>
                <p className="text-slate-600 mb-6">Upload receipt files</p>
                <Button
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 bg-transparent"
                >
                  Choose Files
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/upload-csv" className="group">
            <Card className="h-full border-0 shadow-sm hover:shadow-md smooth-transition bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-200 smooth-transition">
                  <CreditCard className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">
                  Bank Statement
                </h3>
                <p className="text-slate-600 mb-6">Upload CSV file</p>
                <Button
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 bg-transparent"
                >
                  Choose File
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <Card className="border-0 shadow-sm bg-white mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              <div className="text-center px-6">
                <div className="text-3xl font-light text-slate-900 mb-2">
                  {stats.matches}
                </div>
                <div className="text-sm text-slate-600">Matched</div>
              </div>
              <div className="text-center px-6">
                <div className="text-3xl font-light text-slate-900 mb-2">
                  {stats.onlyInLedger}
                </div>
                <div className="text-sm text-slate-600">Ledger Only</div>
              </div>
              <div className="text-center px-6">
                <div className="text-3xl font-light text-slate-900 mb-2">
                  {stats.onlyInBank}
                </div>
                <div className="text-sm text-slate-600">Bank Only</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Results */}
        <div className="text-center">
          <Link href="/results">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3">
              View Results
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
