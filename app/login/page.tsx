import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthForm from "../components/AuthForm";
import { safeNext } from "@/lib/auth-redirect";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Anmelden",
  robots: { index: false, follow: false },
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight">
            Willkommen zurück
          </h1>
          <p className="mt-3 text-muted">
            Melden Sie sich an, um Ihre Website zu verwalten.
          </p>

          {params.error === "auth-code-error" ? (
            <p className="mt-6 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-accent-text">
              Der Bestätigungslink war ungültig oder ist abgelaufen. Bitte
              melden Sie sich an oder fordern Sie einen neuen an.
            </p>
          ) : null}

          <div className="mt-8">
            <AuthForm mode="login" action={login} next={next} />
          </div>

          <p className="mt-6 text-sm text-muted">
            Noch kein Konto?{" "}
            <Link
              href="/registrieren"
              className="font-medium text-accent-text transition-colors hover:text-foreground"
            >
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
