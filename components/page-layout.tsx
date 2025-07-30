import { Navigation } from "@/components/navigation";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background pointer-events-none" />
      
      <Navigation />
      
      <main className="relative flex-1">
        {children}
      </main>
    </div>
  );
}