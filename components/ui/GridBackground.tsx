// The light sections sit on a drafting grid: minor lines every 72px, major
// lines every 288px with a small "+" at each major intersection. Values from
// design/spec.md §2.1. One SVG pattern instead of 97 vector layers.
// The 288px tile is shifted by 144px so the major line and "+" sit inside the
// tile (at 144) rather than on its edge, which would clip the stroke.
export function GridBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-grid"
    >
      <defs>
        <pattern
          id="drafting-grid"
          width="288"
          height="288"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(144 144)"
        >
          {/* minor lines */}
          <path
            d="M0.5 0V288 M72.5 0V288 M216.5 0V288 M0 0.5H288 M0 72.5H288 M0 216.5H288"
            className="stroke-grid-minor"
            strokeWidth="1"
          />
          {/* major lines */}
          <path d="M144.5 0V288 M0 144.5H288" className="stroke-grid" strokeWidth="1" />
          {/* "+" marker, 20px, drawn in the major colour over a white gap */}
          <circle cx="144.5" cy="144.5" r="12" fill="white" />
          <path d="M134.5 144.5H154.5 M144.5 134.5V154.5" className="stroke-grid" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#drafting-grid)" />
    </svg>
  );
}
