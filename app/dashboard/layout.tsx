import { redirect } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardNav from "../components/DashboardNav";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/auth";

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

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Kundenbereich
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Willkommen, {user.email}
          </h1>
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <DashboardNav />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">{children}</div>
      </main>
      <Footer />
    </>
  );
}
