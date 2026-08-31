import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import About from "../components/About";
import CtaBanner from "../components/CtaBanner";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Zwei Webentwickler, ein Projekt: Dominic Felder und Beg Sherifi bringen Technik und Konzept unter einem Dach zusammen.",
};

export default function UeberUns() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Über uns"
          title="Zwei Ansprechpartner, ein Projekt"
          description="Wir sind Dominic Felder und Beg Sherifi — zwei Webentwickler, die sich Technik und Konzept aufteilen, damit Sie während des gesamten Projekts einen direkten Draht zu beidem haben."
        />
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <About />
          </div>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
