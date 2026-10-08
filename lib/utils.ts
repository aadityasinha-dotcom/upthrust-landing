import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge has to be told about our custom text-* tokens. Without this it
// guesses that "text-h5" is a colour (unknown value) and drops "text-primary"
// when both are present, which made the CTA text invisible.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "special",
            "h3",
            "h4",
            "h5",
            "h6",
            "h7",
            "body",
            "small",
            "fine",
            "note",
            "cta",
            "wordmark",
          ],
        },
      ],
    },
  },
});

// Merge Tailwind classes safely: clsx handles conditionals, twMerge removes
// conflicting utilities (e.g. "p-4" + "p-6" -> "p-6").
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
