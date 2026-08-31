import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Process from "../components/Process";
import CtaBanner from "../components/CtaBanner";

export const metadata: Metadata = {
  title: "Prozess",
  description:
    "Von der Analyse Ihrer bestehenden Website bis zum Launch — so läuft ein Refactoring-Projekt mit D-Insight ab.",
};

export default function Prozess() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Prozess"
          title="Vier Schritte, ein klarer Zeitplan"
          description="Von der ersten Analyse bis zum Go-live wissen Sie jederzeit, in welcher Phase wir stecken und was als Nächstes kommt."
        />
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 py-16">
            <Process />
          </div>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
