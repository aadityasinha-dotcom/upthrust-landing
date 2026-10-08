"use client";

// Client boundary for the Studio. sanity.config.ts (and the whole `sanity`
// package) must only be imported here: pulling it into the Server Component
// graph breaks the build because a dependency (swr) has a server-only build
// without the default export the Studio uses.
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export function Studio() {
  return <NextStudio config={config} />;
}
