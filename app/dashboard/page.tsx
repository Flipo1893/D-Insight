import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LogoutButton from "../components/LogoutButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function Dashboard() {
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Kundenbereich
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Willkommen, {user.email}
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Hier entstehen als Nächstes: die Inhalte Ihrer Website selbst
            bearbeiten und Ihre Traffic-Zahlen einsehen.
          </p>
          <div className="mt-8">
            <LogoutButton variant="button" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
