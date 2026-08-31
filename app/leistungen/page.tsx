import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Services from "../components/Services";
import CtaBanner from "../components/CtaBanner";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Visuelles Redesign, technisches Refactoring und KI-SEO — die drei Bausteine, mit denen wir Ihre Website neu aufstellen.",
};

export default function Leistungen() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Leistungen"
          title="Drei Bausteine für eine Website, die wieder trägt"
          description="Redesign, Refactoring und KI-SEO greifen ineinander — visuell, technisch und in der Sichtbarkeit. Je nach Ausgangslage setzen wir bei einem oder allen drei Bausteinen an."
        />
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Services />
          </div>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
