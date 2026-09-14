"use server";

import { revalidatePath } from "next/cache";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite, saveSiteContent, type Site } from "@/lib/mongodb/sites";
import { publishContent } from "@/lib/github/publish";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getAccess } from "@/lib/billing";

export type ContentActionState = {
  error: string | null;
  success?: boolean;
  /**
   * Nur gesetzt, wenn die Kundenseite ihre Texte aus einem Repository liest.
   *
   * "live": neu geschrieben, die Website baut gerade. "unveraendert": es gab
   * nichts Neues zu schreiben. "ausstehend": in der Datenbank gespeichert,
   * aber noch nicht auf der Website. Der dritte Fall darf nicht wie Erfolg
   * aussehen, sonst wartet der Kunde auf eine Änderung, die nie kommt.
   */
  publish?: "live" | "unveraendert" | "ausstehend";
};

/** Generous enough for a long about-text, small enough to stay sane. */
const MAX_FIELD_LENGTH = 2000;

export const notConfiguredState: ContentActionState = {
  error: "MongoDB ist noch nicht konfiguriert. Bitte MONGODB_URI in .env.local setzen.",
};

export async function saveContent(
  _prevState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  if (!isMongoConfigured) {
    return notConfiguredState;
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an." };
  }

  // Die Bezahlschranke im Layout versteckt nur die Oberfläche. Eine Server
  // Action ist ein öffentlicher Endpunkt: wer die Adresse kennt, kann sie
  // ohne die Seite aufrufen.
  const access = await getAccess();
  if (!access.allowed) {
    return { error: "Für dieses Konto ist kein aktives Abo hinterlegt." };
  }

  let site: Site;
  const content: Record<string, string> = {};

  try {
    // Only the fields an admin configured for this site get saved — the
    // form is rendered from the same list, so anything else in the payload
    // is ignored rather than trusted.
    site = await getSite(user.id);
    for (const field of site.fields) {
      const value = String(formData.get(field.key) ?? "").trim();

      // The browser enforces maxLength, but a server action is a public
      // endpoint: anything posted straight to it skips that entirely, and
      // an unbounded string goes into the database as-is.
      if (value.length > MAX_FIELD_LENGTH) {
        return {
          error: `Das Feld "${field.label}" ist zu lang. Bitte auf ${MAX_FIELD_LENGTH} Zeichen kürzen.`,
        };
      }

      content[field.key] = value;
    }

    await saveSiteContent(user.id, content);
  } catch {
    return {
      error:
        "Die Datenbank ist gerade nicht erreichbar — Ihre Änderungen wurden nicht gespeichert. Bitte versuchen Sie es erneut.",
    };
  }

  revalidatePath("/dashboard/inhalte");

  // Sites without a repository still read the content API; for them the
  // database is the whole story.
  if (!site.repo) {
    return { error: null, success: true };
  }

  // The database is written first on purpose. If publishing fails, the
  // customer's text is not lost: it is still in the form next time, and the
  // next save publishes it.
  const result = await publishContent(site.repo, site.contentPath, content);

  if (result.ok) {
    return {
      error: null,
      success: true,
      publish: result.changed ? "live" : "unveraendert",
    };
  }

  // The reason goes to our log, not to the customer. "Token hat keinen
  // Zugriff" is our problem to fix and means nothing to a bakery.
  console.error(
    `[inhalte] Veröffentlichen fehlgeschlagen für ${user.id} (${site.repo}): ${result.reason}${
      result.detail ? `, ${result.detail}` : ""
    }`,
  );
  return { error: null, success: true, publish: "ausstehend" };
}
