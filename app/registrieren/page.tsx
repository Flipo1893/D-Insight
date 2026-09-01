import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthForm from "../components/AuthForm";
import { signup } from "./actions";

export const metadata: Metadata = {
  title: "Registrieren",
  robots: { index: false, follow: false },
};

export default function Registrieren() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight">
            Konto erstellen
          </h1>
          <p className="mt-3 text-muted">
            Damit pflegen Sie nach dem Launch Ihre Website-Inhalte selbst und
            sehen Ihre Besucherzahlen.
          </p>

          <div className="mt-8">
            <AuthForm mode="signup" action={signup} />
          </div>

          <p className="mt-6 text-sm text-muted">
            Schon ein Konto?{" "}
            <Link
              href="/login"
              className="font-medium text-accent-text transition-colors hover:text-foreground"
            >
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
