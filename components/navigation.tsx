import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/minerva-logo.avif"
            alt="Minerva"
            width={28}
            height={28}
            className="rounded-md sm:w-8 sm:h-8"
          />
          <span className="font-semibold text-base sm:text-lg">Minerva</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}