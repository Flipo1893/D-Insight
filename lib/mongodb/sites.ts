import { getMongoClientPromise } from "./client";
import { mongodbDbName } from "./config";

export type SiteFieldType = "text" | "textarea";

/** One editable field on a customer's website, configured by an admin. */
export type SiteField = {
  /** Key the customer's website reads from the content API, e.g. "heroTitle". */
  key: string;
  /** Label the customer sees in the dashboard, e.g. "Hero-Überschrift". */
  label: string;
  type: SiteFieldType;
};

export type Site = {
  /** Supabase user id — doubles as the site id in the public content API. */
  userId: string;
  /** Captured on login so admins can tell who a site belongs to. */
  email: string;
  /** Customer/project name, set by an admin, e.g. "Bäckerei Müller". */
  siteName: string;
  /** The customer's live website, e.g. "https://baeckerei-mueller.de". */
  siteUrl: string;
  fields: SiteField[];
  /** The actual values, keyed by SiteField.key. */
  content: Record<string, string>;
  /**
   * Where the project stands, as an index into the process steps. -1 means
   * not started, steps.length means finished. An index rather than free
   * text, so the customer view can draw progress without parsing prose.
   */
  phase: number;
  /**
   * What we are waiting for from the customer. The most common reason a
   * project stalls is that nobody said out loud whose turn it is.
   */
  pending: string[];
  /** Optional note from us, shown above the steps. */
  phaseNote: string;
  /** Abo-Status, gespiegelt aus Stripe — siehe SiteSubscription. */
  subscription: SiteSubscription;
  updatedAt: Date;
};

/** What a brand-new customer gets before an admin configures their site. */
export const defaultSiteFields: SiteField[] = [
  { key: "heroTitle", label: "Hero-Überschrift", type: "text" },
  { key: "heroSubtitle", label: "Hero-Text", type: "textarea" },
  { key: "aboutText", label: "Über-uns-Text", type: "textarea" },
];

const defaultContent: Record<string, string> = {
  heroTitle: "Ihre Website. Neu gedacht.",
  heroSubtitle:
    "Kurzer Text, der Besucherinnen und Besuchern sofort zeigt, worum es auf Ihrer Website geht.",
  aboutText: "Erzählen Sie hier kurz, wer Sie sind und was Sie besonders macht.",
};

/**
 * Documents written before sites had configurable fields kept the three
 * content values at the top level. Fold those into `content` so nobody's
 * saved text is lost.
 */
type StoredSite = Partial<Site> & {
  userId: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
};

/**
 * Dokumente aus der Zeit vor der Bezahlschranke haben kein `subscription`,
 * und ein halb geschriebenes trägt nur die Kundennummer (siehe
 * rememberStripeCustomer). Beides muss ein vollständiges Objekt ergeben,
 * sonst prüft die Zugriffskontrolle gegen undefined.
 */
function normalizeSubscription(
  stored: Partial<SiteSubscription> | undefined,
): SiteSubscription {
  return { ...noSubscription, ...stored };
}

function normalize(doc: StoredSite): Site {
  const legacyContent: Record<string, string> = {};
  for (const key of ["heroTitle", "heroSubtitle", "aboutText"] as const) {
    if (typeof doc[key] === "string") {
      legacyContent[key] = doc[key];
    }
  }

  return {
    userId: doc.userId,
    email: doc.email ?? "",
    siteName: doc.siteName ?? "",
    siteUrl: doc.siteUrl ?? "",
    fields: doc.fields?.length ? doc.fields : defaultSiteFields,
    content: doc.content ?? { ...defaultContent, ...legacyContent },
    // Documents written before project tracking existed carry none of these.
    phase: typeof doc.phase === "number" ? doc.phase : -1,
    pending: Array.isArray(doc.pending) ? doc.pending : [],
    phaseNote: doc.phaseNote ?? "",
    subscription: normalizeSubscription(doc.subscription),
    updatedAt: doc.updatedAt ?? new Date(),
  };
}

async function getCollection() {
  const client = await getMongoClientPromise();
  return client.db(mongodbDbName).collection<StoredSite>("websites");
}

export async function getSite(userId: string): Promise<Site> {
  const collection = await getCollection();
  const doc = await collection.findOne({ userId });

  return doc
    ? normalize(doc)
    : normalize({ userId, content: { ...defaultContent } });
}

/** Admin overview: every customer site we know about, newest first. */
export async function listSites(): Promise<Site[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();

  return docs.map(normalize);
}

/**
 * Called when a customer opens the dashboard, so admins see them in the
 * customer list even before they ever save content. Only touches the
 * identity fields — never the customer's content or an admin's settings.
 */
export async function rememberSiteOwner(
  userId: string,
  email: string,
): Promise<void> {
  const collection = await getCollection();

  await collection.updateOne(
    { userId },
    {
      $set: { email },
      $setOnInsert: {
        siteName: "",
        siteUrl: "",
        fields: defaultSiteFields,
        content: { ...defaultContent },
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}

/** Saved by the customer from /dashboard/inhalte. */
export async function saveSiteContent(
  userId: string,
  content: Record<string, string>,
): Promise<void> {
  const collection = await getCollection();

  await collection.updateOne(
    { userId },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true },
  );
}

/** Saved by an admin from /dashboard/kunden/[userId]. */
export async function saveSiteSettings(
  userId: string,
  settings: {
    siteName: string;
    siteUrl: string;
    fields: SiteField[];
    phase: number;
    pending: string[];
    phaseNote: string;
  },
): Promise<void> {
  const collection = await getCollection();

  await collection.updateOne(
    { userId },
    { $set: { ...settings, updatedAt: new Date() } },
    { upsert: true },
  );
}

/**
 * Der Abo-Status, wie Stripe ihn kennt.
 *
 * "none" ist kein Stripe-Status, sondern unser Zustand für "war noch nie
 * Kunde". Alles andere kommt eins zu eins von Stripe, damit hier keine
 * eigene Übersetzungstabelle entsteht, die bei einem neuen Status still
 * das Falsche tut.
 */
export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused"
  | "canceled";

export type SiteSubscription = {
  /** Bleibt dem Konto für immer erhalten, auch nach einer Kündigung. */
  customerId: string;
  subscriptionId: string;
  status: SubscriptionStatus;
  priceId: string;
  /** Bis hierhin ist bezahlt — auch bei einer laufenden Kündigung. */
  currentPeriodEnd: Date | null;
  /** Gekündigt, läuft aber noch bis currentPeriodEnd. */
  cancelAtPeriodEnd: boolean;
  updatedAt: Date;
};

export const noSubscription: SiteSubscription = {
  customerId: "",
  subscriptionId: "",
  status: "none",
  priceId: "",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  updatedAt: new Date(0),
};

/**
 * Merkt sich die Stripe-Kundennummer, bevor der Checkout überhaupt startet.
 *
 * Damit bekommt niemand bei einem zweiten Abo eine zweite Kundennummer —
 * sonst stünde derselbe Mensch mehrfach in Stripe und die Rechnungen im
 * Kundenportal wären auf mehrere Konten verteilt.
 */
export async function rememberStripeCustomer(
  userId: string,
  customerId: string,
): Promise<void> {
  const collection = await getCollection();

  await collection.updateOne(
    { userId },
    { $set: { "subscription.customerId": customerId } },
    { upsert: true },
  );
}

/** Geschrieben ausschliesslich vom Stripe-Webhook. */
export async function saveSubscription(
  userId: string,
  subscription: SiteSubscription,
): Promise<void> {
  const collection = await getCollection();

  await collection.updateOne(
    { userId },
    { $set: { subscription } },
    { upsert: true },
  );
}

/**
 * Der Weg vom Stripe-Event zurück zum Konto.
 *
 * Ereignisse zu einem Abo nennen die Kundennummer, nicht unsere userId.
 * Die Metadaten am Abo sind der erste Weg, das hier der zweite — für
 * Abos, die jemand von Hand im Stripe-Dashboard angelegt hat.
 */
export async function findSiteByStripeCustomer(
  customerId: string,
): Promise<Site | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ "subscription.customerId": customerId });

  return doc ? normalize(doc) : null;
}
