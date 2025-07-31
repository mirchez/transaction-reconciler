"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle2, Clock, AlertCircle, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGmailStats, useGmailCheck, useGmailDisconnect } from "@/hooks/use-gmail";

interface GmailStatusProps {
  email: string;
}

export function GmailStatus({ email }: GmailStatusProps) {
  const [needsReconnect, setNeedsReconnect] = useState(false);
  
  // Use React Query hooks
  const { data: stats, isLoading: isLoadingStats } = useGmailStats(email);
  const checkMutation = useGmailCheck(email);
  const disconnectMutation = useGmailDisconnect();

  const handleCheckNow = async () => {
    checkMutation.mutate();
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Gmail account?")) {
      return;
    }
    disconnectMutation.mutate({ email });
  };

  // Default stats if not loaded yet
  const statsData = stats || {
    totalChecked: 0,
    pdfsFound: 0,
    lastCheck: null,
    recentEmails: [],
  };

  return (
    <div className="space-y-4">
      {/* Reconnect Alert */}
      {needsReconnect && (
        <Card className="rounded-lg bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 dark:border-orange-500/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-orange-700 dark:text-orange-300">
                    Reconnection Required
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Please reconnect your Gmail account to grant the necessary permissions for reading emails and attachments.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleDisconnect}
                className="rounded-none bg-orange-600 hover:bg-orange-700 text-white"
              >
                Reconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card className="rounded-lg bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Gmail Monitor</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCheckNow}
                disabled={checkMutation.isPending}
                className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {checkMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Now"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none"
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
              >
                {disconnectMutation.isPending ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{statsData.totalChecked}</p>
              <p className="text-sm text-muted-foreground">Emails Checked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                {statsData.pdfsFound}
              </p>
              <p className="text-sm text-muted-foreground">PDFs Found</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {statsData.lastCheck
                  ? formatDistanceToNow(new Date(statsData.lastCheck), { addSuffix: true })
                  : "Never"}
              </p>
              <p className="text-sm text-muted-foreground">Last Check</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimos resultados del check */}
      {checkMutation.isSuccess && checkMutation.data && (
        <Card className="rounded-lg bg-muted/50 border-border">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Last Check Results</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>📧 Checked {checkMutation.data.totalChecked} emails</p>
              {checkMutation.data.emailsWithPdfs > 0 && (
                <p>📎 Found {checkMutation.data.emailsWithPdfs} emails with PDFs</p>
              )}
              {checkMutation.data.processed > 0 && (
                <p className="text-green-600 dark:text-green-400">
                  ✅ Processed {checkMutation.data.processed} new PDFs
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}