import PlaceholderImage from "./PlaceholderImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { team } from "../lib/content";

/**
 * Layout family: two-up people cards, photo and text side by side. The photo
 * is a fixed small square rather than a full-width portrait, which keeps the
 * section dense instead of letting two big empty frames dominate it.
 */
export default function About() {
  return (
    <section className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <Reveal>
          <SectionHeading className="max-w-2xl">
            Zwei Entwickler, kein Agentur-Apparat.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-muted">
            Sie sprechen mit den Leuten, die auch bauen. Keine Weitergabe an
            wechselnde Projektteams.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {team.map((person, index) => (
            <Reveal key={person.name} index={index} className="scroll-lift">
              <article className="sheen group h-full rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6 transition-colors duration-300 hover:border-border-strong">
                <div className="flex items-start gap-5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-brand sm:h-24 sm:w-24">
                    <PlaceholderImage
                      label="Foto"
                      hint={person.name.split(" ")[0]}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {person.name}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-muted">
                      {person.role}
                    </p>
                    <p className="mt-2 text-sm text-accent-text">
                      {person.focus}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {person.bio}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
