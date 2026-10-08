import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  // "header": Anton 36px (CONTACT US). "panel": Inter bold 32px (CONTACT in services).
  variant?: "header" | "panel";
  className?: string;
};

// The design's CTA is a white box with orange text and square corners.
// Orange on white is 3.48:1, which only passes WCAG as large text, so these
// never go below 24px (see design/spec.md §3).
export function CtaLink({ href, children, variant = "panel", className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center bg-white text-primary uppercase",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "header" && "px-5 py-2.5 font-display text-cta",
        variant === "panel" && "p-5 font-bold text-h5",
        className,
      )}
    >
      {children}
    </Link>
  );
}
