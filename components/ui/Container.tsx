import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Centres content at the 1440px design width. Padding is left to callers because
// each section has its own gutter in the design (72 / 40 / 20).
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-page", className)}>{children}</div>;
}
