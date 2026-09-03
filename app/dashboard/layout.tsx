import { redirect } from "next/navigation";
import { after } from "next/server";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardNav from "../components/DashboardNav";
import Paywall from "../components/Paywall";
import Reveal from "../components/Reveal";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isAdminEmail } from "@/lib/admin";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getAccess } from "@/lib/billing";
import { rememberSiteOwner } from "@/lib/mongodb/sites";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="mx-auto max-w-2xl px-6 py-24 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Kundenbereich
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Noch nicht konfiguriert
            </h1>
            <p className="mt-4 text-muted">
              Sobald <code className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              und <code className="text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              in <code className="text-foreground">.env.local</code> gesetzt sind, können
              sich Kund:innen hier anmelden und ihre Website verwalten.
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Record who this account belongs to, so admins see the customer in the
  // list even before they have saved any content. Runs via after() so this
  // bookkeeping write never delays the first paint — and its failure can't
  // take the dashboard down, since errors thrown in a layout escape the
  // segment's error boundary anyway.
  if (isMongoConfigured && user.email) {
    const { id, email } = user;
    after(async () => {
      try {
        await rememberSiteOwner(id, email);
      } catch {
        // The pages themselves surface database problems to the customer.
      }
    });
  }

  // Eine einzige Stelle entscheidet über den Zugang zum ganzen
  // Kundenbereich. Ohne Stripe-Konfiguration und für Admins ist das immer
  // ein Ja — siehe getAccess().
  const access = await getAccess();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 pt-12">
          <p
            className="animate-hero text-sm font-semibold uppercase tracking-wider text-accent"
            style={{ animationDelay: "0ms" }}
          >
            Kundenbereich
          </p>
          <h1
            className="animate-hero mt-2 break-words text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ animationDelay: "80ms" }}
          >
            Willkommen, {user.email}
          </h1>
        </div>
        {access.allowed && (
          <div
            className="animate-hero mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 pt-8"
            style={{ animationDelay: "160ms" }}
          >
            <DashboardNav isAdmin={isAdminEmail(user.email)} />
          </div>
        )}
        <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 py-12">
          <Reveal>{access.allowed ? children : <Paywall access={access} />}</Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
