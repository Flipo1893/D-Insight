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
    <section id="leistungen" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Leistungen
        </p>
        <div className="mt-8 divide-y divide-border border-t border-border">
          {services.map((service) => (
            <div
              key={service.number}
              className="grid gap-4 py-8 md:grid-cols-[80px_1fr_1fr] md:gap-8"
            >
              <span className="text-sm text-muted">{service.number}</span>
              <h3 className="text-xl font-semibold md:text-2xl">
                {service.title}
              </h3>
              <p className="max-w-md text-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
