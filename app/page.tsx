import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import BeforeAfter from "./components/BeforeAfter";
import Process from "./components/Process";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import CtaBanner from "./components/CtaBanner";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";
import { faqs, services, site, team } from "./lib/content";

/*
 * Structured data so search engines and AI assistants (ChatGPT, Perplexity,
 * Google AI Overviews) can understand and cite this business directly. This
 * is the same practice we sell as KI-SEO / GEO, so the site has to pass its
 * own test. The FAQ graph is generated from the same array the accordion
 * renders, which keeps markup and content in sync by construction.
 */
const graph = [
  {
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    email: site.email,
    description:
      "Website-Refactoring, visuelles Redesign und KI-gestützte Suchmaschinenoptimierung (GEO) für bestehende Unternehmenswebsites.",
    areaServed: "DE",
    founders: team.map((person) => ({
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
    })),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  },
  {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

const jsonLd = { "@context": "https://schema.org", "@graph": graph };

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
        <About />
        <Marquee />
        <Services />
        <BeforeAfter />
        <Process />
        <Contact />
        <FAQ />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
