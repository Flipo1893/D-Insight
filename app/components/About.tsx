import PlaceholderImage from "./PlaceholderImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { team } from "../lib/content";

/**
 * Layout family: two-up portrait grid. One card per person, exactly as many
 * cells as there are people.
 */
export default function About() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-2xl">
            Zwei Entwickler, kein Agentur-Apparat.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-muted">
            Sie sprechen mit den Leuten, die auch bauen. Keine Weitergabe an
            wechselnde Projektteams.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-8">
          {team.map((person, index) => (
            <Reveal key={person.name} index={index} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-brand">
                <PlaceholderImage
                  label={`Foto ${person.name}`}
                  hint="wird nachgeliefert"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-semibold tracking-tight">
                  {person.name}
                </h3>
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {person.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-accent-text">{person.focus}</p>
              <p className="mt-3 max-w-md leading-relaxed text-muted">
                {person.bio}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
