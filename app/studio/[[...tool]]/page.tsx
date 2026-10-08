import { Studio } from "./Studio";

// Sanity Studio embedded at /studio. The catch-all segment lets the Studio own
// its sub-routes (/studio/structure/...). All Studio code lives in the client
// boundary in ./Studio.tsx.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
