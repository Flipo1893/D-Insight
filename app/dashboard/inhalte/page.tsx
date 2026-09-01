import type { Metadata } from "next";
import ContentForm from "../../components/ContentForm";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getWebsiteContent, type WebsiteContentFields } from "@/lib/mongodb/websites";
import { getCurrentUser } from "@/lib/supabase/auth";
import { siteUrl } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Inhalte bearbeiten",
  robots: { index: false, follow: false },
};

const placeholderContent: WebsiteContentFields = {
  heroTitle: "Ihre Website. Neu gedacht.",
  heroSubtitle:
    "Kurzer Text, der Besucherinnen und Besuchern sofort zeigt, worum es auf Ihrer Website geht.",
  aboutText: "Erzählen Sie hier kurz, wer Sie sind und was Sie besonders macht.",
};

export default async function Inhalte() {
  const user = await getCurrentUser();
  const content =
    isMongoConfigured && user ? await getWebsiteContent(user.id) : placeholderContent;

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold tracking-tight">
        Website-Inhalte
      </h2>
      <p className="mt-2 text-muted">
        Passen Sie die Texte Ihrer Website an — Änderungen erscheinen nach dem
        Speichern live auf Ihrer Seite.
      </p>

      {!isMongoConfigured && (
        <p className="mt-4 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
          MongoDB ist noch nicht konfiguriert — die Felder unten zeigen
          Beispielinhalte. Speichern ist erst aktiv, sobald{" "}
          <code className="text-foreground">MONGODB_URI</code> gesetzt ist.
        </p>
      )}

      <div className="mt-8">
        <ContentForm content={content} />
      </div>

      {user && (
        <div className="mt-10 rounded-md border border-border bg-surface p-4">
          <p className="text-sm font-medium">Content-API für Ihre Website</p>
          <p className="mt-1 text-sm text-muted">
            Ihre Website ruft diese Inhalte über folgende Adresse ab (nur
            lesend, kein Login nötig):
          </p>
          <code className="mt-2 block overflow-x-auto rounded bg-background px-3 py-2 text-xs text-foreground">
            {siteUrl}/api/sites/{user.id}/content
          </code>
        </div>
      )}
    </div>
  );
}
