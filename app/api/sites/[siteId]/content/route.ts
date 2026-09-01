import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getWebsiteContent } from "@/lib/mongodb/websites";

// Public, read-only content feed for a customer's own (separately hosted)
// website. Their Next.js project fetches this server-side to render the
// editable fields a customer changes in /dashboard/inhalte — no auth here
// since this is exactly the content meant to be public on their live site.
//
// `siteId` is the customer's Supabase user id for now (1 customer = 1
// site). Once real client sites are onboarded, this is the place to add a
// friendlier site slug instead of the raw user id.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  if (!isMongoConfigured) {
    return NextResponse.json(
      { error: "MongoDB ist nicht konfiguriert." },
      { status: 503 },
    );
  }

  const { siteId } = await params;
  const content = await getWebsiteContent(siteId);

  return NextResponse.json(content, {
    headers: {
      // ISR-friendly: the client site can cache this and revalidate
      // periodically instead of hitting MongoDB on every request.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
