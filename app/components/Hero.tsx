export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 pt-20 pb-16 md:pt-28">
      <h1
        className="animate-hero max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
        style={{ animationDelay: "0ms" }}
      >
        Ihre Website.
        <br />
        Neu gedacht.
      </h1>
      <p
        className="animate-hero mt-6 max-w-2xl text-lg text-muted"
        style={{ animationDelay: "120ms" }}
      >
        Wir sind zwei Webentwickler, die veraltete Websites in schnelle,
        moderne Auftritte verwandeln — mit klarem Redesign und
        KI-gestützter Suchmaschinenoptimierung. Ein Projekt, zwei
        Ansprechpartner, ein Ergebnis, das misst und konvertiert.
      </p>
      <div
        className="animate-hero mt-8 flex flex-wrap items-center gap-6"
        style={{ animationDelay: "220ms" }}
      >
        <a
          href="#kontakt"
          className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
        >
          Angebot anfordern
        </a>
        <a
          href="#beispiele"
          className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Beispiele ansehen
        </a>
      </div>
    </section>
  );
}
