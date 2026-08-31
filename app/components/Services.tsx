import Reveal from "./Reveal";

const services = [
  {
    number: "01",
    title: "Visuelles Redesign",
    description:
      "Ein zeitgemäßes Erscheinungsbild für Ihre Marke: klare Struktur, lesbare Typografie und eine Nutzerführung, die auf jedem Gerät funktioniert.",
  },
  {
    number: "02",
    title: "Technisches Refactoring",
    description:
      "Sauberer, wartbarer Code statt Altlasten: schnellere Ladezeiten, stabile Struktur und eine Basis, auf der Sie langfristig weiterbauen können.",
  },
  {
    number: "03",
    title: "KI-SEO",
    description:
      "KI-gestützte Optimierung für Suchmaschinen und KI-Suchassistenten: relevante Inhalte, saubere Struktur-Daten und bessere Sichtbarkeit dort, wo heute gesucht wird.",
  },
];

export default function Services() {
  return (
    <div className="divide-y divide-border border-t border-border">
      {services.map((service, index) => (
        <Reveal
          key={service.number}
          delay={index * 100}
          className="grid gap-4 py-8 transition-colors md:grid-cols-[80px_1fr_1fr] md:gap-8 hover:bg-surface/60"
        >
          <span className="text-sm text-muted">{service.number}</span>
          <h3 className="text-xl font-semibold md:text-2xl">
            {service.title}
          </h3>
          <p className="max-w-md text-muted">{service.description}</p>
        </Reveal>
      ))}
    </div>
  );
}
