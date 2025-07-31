import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function CenteredLogo() {
  return (
    <div className="relative bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Theme Toggle inside header */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex flex-col items-center justify-center py-6 sm:py-8">
        <div className="relative">
          <Image
            src="/minerva-logo.avif"
            alt="Minerva"
            width={60}
            height={60}
            className="dark:brightness-110 brightness-90 contrast-125 w-14 h-14 sm:w-16 sm:h-16 dark:invert-0 invert"
            priority
          />
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-lovelace tracking-wide text-foreground">
          Minerva
        </h1>
      </div>
    </div>
  );
}