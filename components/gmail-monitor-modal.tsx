"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GmailStatus } from "@/components/gmail-status";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useGmailStatus } from "@/hooks/use-gmail";

interface GmailMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GmailMonitorModal({
  open,
  onOpenChange,
}: GmailMonitorModalProps) {
  const { data: gmailStatus } = useGmailStatus();

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] bg-white dark:bg-popover border-border rounded-lg">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground">
            Email Management
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
            Connect your Gmail account to automatically process PDF receipts
            from your inbox
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          {!gmailStatus?.connected ? (
            <div className="bg-muted/50 rounded-lg p-4 sm:p-8 border border-border">
              <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                    Connect Gmail
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md px-4 sm:px-0">
                    Grant access to read emails and automatically import PDF
                    receipts for reconciliation
                  </p>
                </div>
                <Button
                  onClick={handleGoogleConnect}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto rounded-lg"
                >
                  Connect Gmail Account
                </Button>
              </div>
            </div>
          ) : (
            <GmailStatus email={gmailStatus.email || ""} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
