import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  return (
    <header className="relative border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8">
              <Image
                src="/minerva-logo.avif"
                alt="Minerva"
                width={32}
                height={32}
                className="rounded-lg dark:brightness-110 brightness-90 contrast-125"
              />
            </div>
            <span className="font-semibold text-lg tracking-tight">Minerva</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}