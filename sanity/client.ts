import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Read-only client for the website. The dataset is public, so no token.
// useCdn: true serves from Sanity's edge cache; freshness comes from the
// revalidate webhook, not from bypassing the CDN.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
