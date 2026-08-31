import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="kontakt" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Kontakt
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Angebot anfordern
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Erzählen Sie uns kurz von Ihrer Website. Wir melden uns
            innerhalb von zwei Werktagen mit einer ersten Einschätzung und
            einem unverbindlichen Angebot.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
