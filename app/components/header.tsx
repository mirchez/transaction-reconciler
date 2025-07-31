import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ResetButton } from "./reset-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-8">
          {/* Logo and brand name */}
          <div className="flex items-center gap-3">
            <Image
              src="/minerva-logo.avif"
              alt="Minerva"
              width={32}
              height={32}
              className="dark:brightness-150 brightness-90 contrast-125 dark:invert-0 invert"
              priority
            />
            <span className="text-xl font-lovelace tracking-wide text-foreground">Minerva</span>
          </div>
          
          {/* Theme Toggle and Reset Button */}
          <div className="flex items-center gap-2">
            <ResetButton />
            <ThemeToggle />
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}