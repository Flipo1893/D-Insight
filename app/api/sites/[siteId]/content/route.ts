import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite } from "@/lib/mongodb/sites";

// Public, read-only content feed for a customer's own (separately hosted)
// website. Their Next.js project fetches this server-side to render the
// editable fields a customer changes in /dashboard/inhalte — no auth here
// since this is exactly the content meant to be public on their live site.
//
// `siteId` is the customer's Supabase user id (1 customer = 1 site). Which
// keys appear in the response is configured per customer under
// /dashboard/kunden.
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

  try {
    const site = await getSite(siteId);

    return NextResponse.json(
      { ...site.content, updatedAt: site.updatedAt },
      {
        headers: {
          // ISR-friendly: the client site can cache this and revalidate
          // periodically instead of hitting MongoDB on every request.
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    // A customer's website should get a clean, handleable failure here
    // rather than an HTML error page from a crashed route.
    return NextResponse.json(
      { error: "Inhalte sind derzeit nicht abrufbar." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
