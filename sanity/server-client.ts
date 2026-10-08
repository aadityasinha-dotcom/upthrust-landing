import { client } from "./client";

// Server-only writer. Imported exclusively by route handlers; the token comes
// from the server environment and never reaches the browser bundle.
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return client.withConfig({ token, useCdn: false });
}
