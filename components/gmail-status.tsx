"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle2, Clock, AlertCircle, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGmailStats, useGmailCheck, useGmailDisconnect, useGmailForceDisconnect } from "@/hooks/use-gmail";

interface GmailStatusProps {
  email: string;
}

export function GmailStatus({ email }: GmailStatusProps) {
  const [needsReconnect, setNeedsReconnect] = useState(false);
  const [showForceDisconnect, setShowForceDisconnect] = useState(false);
  
  // Use React Query hooks
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useGmailStats(email);
  const checkMutation = useGmailCheck(email);
  const disconnectMutation = useGmailDisconnect();
  const forceDisconnectMutation = useGmailForceDisconnect();

  const handleCheckNow = async () => {
    checkMutation.mutate();
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Gmail account?")) {
      return;
    }
    disconnectMutation.mutate({ email });
  };

  const handleForceDisconnect = async () => {
    if (!confirm("This will force disconnect your Gmail account. Are you sure?")) {
      return;
    }
    forceDisconnectMutation.mutate({ email });
  };

  // Default stats if not loaded yet
  const statsData = stats || {
    totalChecked: 0,
    pdfsFound: 0,
    lastCheck: null,
    recentEmails: [],
  };

  // Show error state and force disconnect option if there are errors
  if (disconnectMutation.isError || checkMutation.isError || statsError) {
    return (
      <div className="space-y-4">
        <Card className="bg-red-500/10 dark:bg-red-500/20 border-red-500/30 dark:border-red-500/40">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-red-700 dark:text-red-300">
                    Gmail Connection Error
                  </p>
                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                    There was an error with your Gmail connection. You may need to force disconnect and reconnect.
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleForceDisconnect}
                disabled={forceDisconnectMutation.isPending}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {forceDisconnectMutation.isPending ? "Disconnecting..." : "Force Disconnect"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reconnect Alert */}
      {needsReconnect && (
        <Card className="bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 dark:border-orange-500/40">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-orange-700 dark:text-orange-300">
                    Reconnection Required
                  </p>
                  <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Please reconnect your Gmail account to grant the necessary permissions for reading emails and attachments.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleDisconnect}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto text-xs sm:text-sm"
              >
                Reconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold truncate">Gmail Monitor</h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                onClick={handleCheckNow}
                disabled={checkMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-xs sm:text-sm"
              >
                {checkMutation.isPending ? (
                  <>
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Now"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
              >
                {disconnectMutation.isPending ? (
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}