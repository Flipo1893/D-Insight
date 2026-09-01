import { redirect } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardNav from "../components/DashboardNav";
import LogoutButton from "../components/LogoutButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { displayName, getCurrentUser } from "@/lib/supabase/auth";

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
          <section className="mx-auto max-w-2xl px-6 py-24">
            <h1 className="text-3xl font-semibold tracking-tight">
              Kundenbereich noch nicht eingerichtet
            </h1>
            <p className="mt-4 text-muted">
              Sobald{" "}
              <code className="text-muted-strong">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              und{" "}
              <code className="text-muted-strong">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              in <code className="text-muted-strong">.env.local</code> stehen,
              können sich Kundinnen und Kunden hier anmelden und ihre Website
              verwalten.
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="min-w-0 break-words text-3xl font-semibold tracking-tight md:text-4xl">
              Willkommen, {displayName(user)}
            </h1>
            <LogoutButton variant="button" />
          </div>
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
