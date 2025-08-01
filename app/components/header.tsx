import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="py-3 px-4 sm:px-6">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex items-center justify-between h-8">
          {/* Logo and brand name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/minerva-logo.avif"
              alt="Minerva"
              width={28}
              height={28}
              className="dark:brightness-150 brightness-90 contrast-125 dark:invert-0 invert sm:w-8 sm:h-8"
              priority
            />
            <span className="text-lg sm:text-xl font-lovelace tracking-wide text-foreground">Minerva</span>
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}