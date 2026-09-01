import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { bookingUrl, site } from "../lib/content";

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
            className="mt-8 inline-block border-b border-border pb-1 text-sm text-muted-strong transition-colors hover:border-accent hover:text-accent-text"
          >
            {site.email}
          </a>

          {/* Only rendered once a real booking link exists, so nobody clicks
              through to a dead page. */}
          {bookingUrl ? (
            <div className="mt-10 rounded-brand border border-border bg-surface p-5">
              <p className="text-sm font-medium">Lieber direkt sprechen?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Buchen Sie 20 Minuten, in denen wir Ihre Seite gemeinsam
                anschauen.
              </p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-text transition-colors hover:text-foreground"
              >
                Termin auswählen
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
            </div>
          ) : null}
        </Reveal>

        <Reveal index={1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
