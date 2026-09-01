import type { Metadata } from "next";
import ContentForm from "../../components/ContentForm";
import { isMongoConfigured } from "@/lib/mongodb/config";
import {
  defaultFields,
  getWebsiteContent,
  type WebsiteContentFields,
} from "@/lib/mongodb/websites";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Inhalte bearbeiten",
  robots: { index: false, follow: false },
};

export default async function Inhalte() {
  const user = await getCurrentUser();
  const content: WebsiteContentFields =
    isMongoConfigured && user ? await getWebsiteContent(user.id) : defaultFields;

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold tracking-tight">
        Website-Inhalte
      </h2>
      <p className="mt-2 text-muted">
        Passen Sie die Texte Ihrer Website an. Änderungen erscheinen nach dem
        Speichern auf Ihrer Seite.
      </p>

      {!isMongoConfigured && (
        <p className="mt-6 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Die Datenbank ist noch nicht eingerichtet, deshalb zeigen die Felder
          Beispieltexte. Speichern wird aktiv, sobald{" "}
          <code className="text-muted-strong">MONGODB_URI</code> gesetzt ist.
        </p>
      )}

      <div className="mt-8">
        <ContentForm content={content} disabled={!isMongoConfigured} />
      </div>
    </div>
  );
}
