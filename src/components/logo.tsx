import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <span
        className={cn(
          "font-headline text-2xl font-bold",
          "text-foreground"
        )}
      >
        NUBARBER
      </span>
    </Link>
  );
}
