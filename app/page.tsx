import Header from "./components/Header";
import Hero from "./components/Hero";
import ExploreLinks from "./components/ExploreLinks";
import BeforeAfter from "./components/BeforeAfter";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";

// Structured data so search engines and AI assistants (ChatGPT, Perplexity,
// Google AI Overviews, …) can understand and cite this business directly —
// the same practice we sell as "KI-SEO" / GEO.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "D-Insight",
  description:
    "Website-Refactoring, visuelles Redesign und KI-gestützte Suchmaschinenoptimierung (GEO) für bestehende Unternehmenswebsites.",
  areaServed: "DE",
  founders: [
    { "@type": "Person", name: "Dominic Felder", jobTitle: "Web Developer" },
    { "@type": "Person", name: "Beg Sherifi", jobTitle: "Web Developer" },
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Visuelles Redesign" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Technisches Refactoring" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "KI-SEO / GEO" } },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <ExploreLinks />
        <BeforeAfter />
        <Contact />
        <FAQ />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
