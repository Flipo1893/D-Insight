import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthForm from "../components/AuthForm";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Registrieren",
  robots: { index: false, follow: false },
};

export default function Registrieren() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <Reveal className="w-full max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Kundenbereich
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Konto erstellen
          </h1>
          <p className="mt-2 text-muted">
            Registrieren Sie sich, um nach dem Launch Ihre Website-Inhalte
            selbst zu pflegen und Ihre Traffic-Zahlen einzusehen.
          </p>

          <div className="mt-8">
            <AuthForm mode="signup" />
          </div>

          <p className="mt-6 text-sm text-muted">
            Schon ein Konto?{" "}
            <Link
              href="/login"
              className="font-medium text-accent hover:text-accent-hover"
            >
              Jetzt anmelden
            </Link>
          </p>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
