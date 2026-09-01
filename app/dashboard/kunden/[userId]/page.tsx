import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteSettingsForm from "../../../components/SiteSettingsForm";
import { isAdminEmail } from "@/lib/admin";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite } from "@/lib/mongodb/sites";
import { getCurrentUser } from "@/lib/supabase/auth";
import { siteUrl as portalUrl } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Kunde bearbeiten",
  robots: { index: false, follow: false },
};

export default async function KundeDetail({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email) || !isMongoConfigured) {
    notFound();
  }

  const { userId } = await params;
  const site = await getSite(userId);

  return (
    <div>
      <Link
        href="/dashboard/kunden"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Zurück zur Kundenliste
      </Link>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        {site.siteName || site.email || "Kunde"}
      </h2>
      <p className="mt-2 text-muted">{site.email}</p>

      <div className="mt-6 rounded-md border border-border bg-surface p-4">
        <p className="text-sm font-medium">Content-API dieser Website</p>
        <p className="mt-1 text-sm text-muted">
          Diese Adresse trägt ihr im Code der Kundenwebsite ein, damit sie die
          Inhalte von hier abruft:
        </p>
        <code className="mt-2 block overflow-x-auto rounded bg-background px-3 py-2 text-xs text-foreground">
          {portalUrl}/api/sites/{site.userId}/content
        </code>
      </div>

      <div className="mt-10 max-w-3xl">
        <SiteSettingsForm site={site} />
      </div>
    </div>
  );
}
