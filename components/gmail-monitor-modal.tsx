"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GmailStatus } from "@/components/gmail-status";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useGmailStatus } from "@/hooks/use-gmail";

interface GmailMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GmailMonitorModal({ open, onOpenChange }: GmailMonitorModalProps) {
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
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-popover border-border rounded-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-semibold text-foreground">Email Management</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Connect your Gmail account to automatically process PDF receipts from your inbox
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          {!gmailStatus?.connected ? (
            <div className="bg-muted/50 rounded-lg p-8 border border-border">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <Mail className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">Connect Gmail</h3>
                  <p className="text-base text-muted-foreground max-w-md">
                    Grant access to read emails and automatically import PDF receipts for reconciliation
                  </p>
                </div>
                <Button 
                  onClick={handleGoogleConnect} 
                  size="lg" 
                  className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-8"
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