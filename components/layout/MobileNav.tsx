"use client";

// Client component because it owns the open/closed state of the menu button.
// It is the only interactive part of the header; the rest stays server-rendered.
import Link from "next/link";
import { useId, useState } from "react";
import type { NavLink } from "@/lib/types";

export function MobileNav({ cta }: { cta: NavLink }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className="md:hidden"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-12 items-center justify-center text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {/* Figma "dehaze" icon: three bars. Becomes an X when open. */}
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          {open ? (
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3z" />
          ) : (
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          )}
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-grid bg-white px-5 py-6"
      >
        <Link
          href={cta.href}
          onClick={() => setOpen(false)}
          className="font-display text-h5 uppercase text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
