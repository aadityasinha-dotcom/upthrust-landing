import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

// Builds a cdn.sanity.io URL for an image reference. next/image handles resizing,
// so we only ask Sanity for the original (format auto = webp/avif when supported).
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
