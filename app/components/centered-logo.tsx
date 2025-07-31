import Image from "next/image";

export function CenteredLogo() {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
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
  );
}