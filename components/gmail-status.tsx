"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle2, Clock, AlertCircle, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GmailStatusProps {
  email: string;
}

interface EmailStats {
  totalChecked: number;
  pdfsFound: number;
  lastCheck: Date | null;
  recentEmails: Array<{
    id: string;
    subject: string;
    from: string;
    hasPdf: boolean;
    pdfCount: number;
    processedAt: Date;
  }>;
}

export function GmailStatus({ email }: GmailStatusProps) {
  const router = useRouter();
  const [stats, setStats] = useState<EmailStats>({
    totalChecked: 0,
    pdfsFound: 0,
    lastCheck: null,
    recentEmails: [],
  });
  const [isChecking, setIsChecking] = useState(false);
  const [needsReconnect, setNeedsReconnect] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const checkNow = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/gmail/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📧 Gmail Check Response:", data);
        fetchStats();
        
        if (data.emailsFound > 0) {
          toast.info(
            `Found ${data.emailsFound} unread email${data.emailsFound > 1 ? "s" : ""}, ${data.emailsWithPdfs} with PDFs`
          );
        }
        
        if (data.processed > 0) {
          toast.success(
            `Processed ${data.processed} PDF${data.processed > 1 ? "s" : ""} successfully!`
          );
          // Refresh the page to show new transactions
          setTimeout(() => window.location.reload(), 2000);
        }
      }
    } catch (error) {
      console.error("Error checking Gmail:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/gmail/stats?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Gmail account?")) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const response = await fetch("/api/gmail/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Gmail disconnected successfully");
        // Redirect to home page to reconnect
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to disconnect Gmail");
      }
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
      toast.error("Failed to disconnect Gmail");
    } finally {
      setIsDisconnecting(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [email]);

  return (
    <div className="space-y-4">
      {/* Reconnect Alert */}
      {needsReconnect && (
        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900 dark:text-orange-100">
                    Reconnection Required
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Please reconnect your Gmail account to grant the necessary permissions for reading emails and attachments.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleDisconnect}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Reconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card className="bg-card border-muted">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Gmail Monitor</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={checkNow}
                disabled={isChecking}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isChecking ? (
                  <>
                    <Clock className="w-4 h-4 inline mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Now"
                )}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalChecked}</p>
              <p className="text-sm text-muted-foreground">Emails Checked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.pdfsFound}
              </p>
              <p className="text-sm text-muted-foreground">PDFs Found</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {stats.lastCheck
                  ? formatDistanceToNow(new Date(stats.lastCheck), { addSuffix: true })
                  : "Never"}
              </p>
              <p className="text-sm text-muted-foreground">Last Check</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Emails with PDFs */}
      <Card className="bg-card border-muted">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Recent Emails with PDFs</h4>
          {stats.recentEmails.filter(e => e.hasPdf).length > 0 ? (
            <div className="space-y-3">
              {stats.recentEmails.filter(e => e.hasPdf).map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-none"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{email.subject}</p>
                    <p className="text-xs text-muted-foreground">{email.from}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {email.pdfCount} PDF{email.pdfCount > 1 ? "s" : ""}
                    </Badge>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No emails with PDF attachments found yet</p>
              <p className="text-xs mt-1">Check your inbox or wait for new emails</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}