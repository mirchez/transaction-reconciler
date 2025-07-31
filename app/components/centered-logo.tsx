import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function CenteredLogo() {
  return (
    <div className="relative bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Theme Toggle inside header */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex flex-col items-center justify-center py-12 sm:py-12 lg:py-12">
        <div className="relative">
          <Image
            src="/minerva-logo.avif"
            alt="Minerva"
            width={100}
            height={100}
            className="dark:brightness-110 brightness-90 contrast-125 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 dark:invert-0 invert"
            priority
          />
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-lovelace tracking-wide text-foreground">
          Minerva
        </h1>
      </div>
    </div>
  );
}