"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GmailMonitorProps {
  email: string;
  enabled: boolean;
}

export function GmailMonitor({ email, enabled }: GmailMonitorProps) {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    if (!enabled || !email) return;

    const checkGmail = async () => {
      try {
        const response = await fetch("/api/gmail/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const data = await response.json();
          setLastCheck(new Date());
          
          console.log("🔄 Gmail Monitor Response:", data);
          
          if (data.emailsFound > 0) {
            toast.info(
              `Found ${data.emailsFound} email${data.emailsFound > 1 ? "s" : ""} to check`
            );
          }
          
          if (data.processed > 0) {
            toast.success(
              `Processed ${data.processed} PDF${data.processed > 1 ? "s" : ""} from Gmail`
            );
          }
        }
      } catch (error) {
        console.error("Error checking Gmail:", error);
      }
    };

    // Check immediately on mount
    checkGmail();

    // Then check every 5 minutes
    const interval = setInterval(checkGmail, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [email, enabled]);

  return null;
}