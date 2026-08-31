import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthForm from "../components/AuthForm";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function Login() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <Reveal className="w-full max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Kundenbereich
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Willkommen zurück
          </h1>
          <p className="mt-2 text-muted">
            Melden Sie sich an, um Ihre Website zu verwalten.
          </p>

          <div className="mt-8">
            <AuthForm mode="login" />
          </div>

          <p className="mt-6 text-sm text-muted">
            Noch kein Konto?{" "}
            <Link
              href="/registrieren"
              className="font-medium text-accent hover:text-accent-hover"
            >
              Jetzt registrieren
            </Link>
          </p>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
