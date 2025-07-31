"use client";

import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ResetButton() {
  const [open, setOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Reset database data
      const resetResponse = await fetch("/api/reset", {
        method: "POST",
      });

      if (!resetResponse.ok) {
        throw new Error("Failed to reset data");
      }

      // Logout if user is logged in (Gmail)
      try {
        const logoutResponse = await fetch("/api/gmail/logout", {
          method: "POST",
        });
        
        if (!logoutResponse.ok) {
          console.error("Failed to logout from Gmail");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }

      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();

      // Reload the page to refresh all data
      window.location.href = "/";
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Failed to reset data. Please try again.");
    } finally {
      setIsResetting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="rounded-none text-muted-foreground hover:text-red-600 dark:hover:text-red-500 transition-colors"
      >
        Reset App
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-lg border-2 border-border bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-700 dark:text-red-500" />
              </div>
              Reset Application Data
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-4">
              This action will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Delete all uploaded bank transactions</li>
                <li>Delete all ledger entries from receipts</li>
                <li>Delete all matching and reconciliation data</li>
                <li>Log out from Gmail if connected</li>
                <li>Clear all local application data</li>
              </ul>
              <p className="mt-3 font-medium text-red-700 dark:text-red-500">This cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={isResetting}
              className="rounded-md bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Yes, Reset Everything"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}