import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { site } from "../lib/content";

/** Layout family: split, copy left and form right. Used once on the page. */
export default function Contact() {
  return (
    <section id="kontakt" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:gap-20 md:py-32">
        <Reveal>
          <SectionHeading>Erzählen Sie uns von Ihrer Website.</SectionHeading>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Wir melden uns innerhalb von {site.replyWindow} mit einer ersten
            Einschätzung und einem unverbindlichen Angebot.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block border-b border-border pb-1 text-sm text-muted-strong transition-colors hover:border-accent hover:text-accent-text-text"
          >
            {site.email}
          </a>
        </Reveal>

        <Reveal index={1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
