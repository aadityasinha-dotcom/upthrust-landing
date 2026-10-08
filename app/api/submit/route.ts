import { type NextRequest, NextResponse } from "next/server";
import { fieldErrorsFrom, newsletterSchema } from "@/lib/validation";
import { getWriteClient } from "@/sanity/server-client";

const FORM_NAME = "newsletter";

// Best-effort rate limit: 5 submissions per IP per 10 minutes, kept in memory.
// On serverless hosting each instance has its own map, so this only blunts
// naive abuse; the honeypot and validation do the real work. Good enough for
// a newsletter form; a shared store (Upstash/KV) would be the next step.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(json);
  if (!parsed.success) {
    // Honeypot filled -> pretend success so the bot learns nothing.
    const honeypot = parsed.error.issues.some((i) => i.path[0] === "website");
    if (honeypot) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errors: fieldErrorsFrom(parsed.error) }, { status: 400 });
  }

  const writeClient = getWriteClient();
  if (!writeClient) {
    return NextResponse.json(
      { ok: false, message: "Form storage is not configured" },
      { status: 500 },
    );
  }

  try {
    await writeClient.create({
      _type: "submission",
      formName: FORM_NAME,
      email: parsed.data.email,
      consent: true,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to store submission", error);
    return NextResponse.json({ ok: false, message: "Could not save, try again" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
