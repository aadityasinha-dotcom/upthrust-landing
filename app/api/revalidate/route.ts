import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/lib/content";

// Sanity webhook target. Configure in sanity.io/manage -> API -> Webhooks:
//   URL: https://<site>/api/revalidate, trigger on create/update/delete,
//   secret = SANITY_REVALIDATE_SECRET. parseBody verifies the HMAC signature
//   header, so nobody can purge our cache without the secret.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET not set" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // One tag for all content: the page is small, so purging everything is simpler
  // and cheaper to explain than per-type tags. "max" = serve stale while refetching.
  revalidateTag(CONTENT_TAG, "max");
  return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
}
