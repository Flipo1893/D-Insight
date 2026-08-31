const steps = [
  {
    number: "01",
    title: "Analyse",
    description:
      "Wir prüfen bestehende Website, Technik und Suchmaschinen-Performance.",
  },
  {
    number: "02",
    title: "Konzept & Design",
    description:
      "Struktur und visuelles Konzept entstehen, abgestimmt mit Ihnen.",
  },
  {
    number: "03",
    title: "Umsetzung",
    description:
      "Code-Refactoring, Redesign und KI-SEO werden implementiert und getestet.",
  },
  {
    number: "04",
    title: "Launch & Betreuung",
    description: "Go-live, Erfolgsmessung und Betreuung nach Bedarf.",
  },
];

export default function Process() {
  return (
    <section id="prozess" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Prozess
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="mb-3 block h-2 w-2 bg-accent" />
              <h3 className="font-semibold">
                {step.number} · {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
