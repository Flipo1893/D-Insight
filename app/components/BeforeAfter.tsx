import PlaceholderImage from "./PlaceholderImage";
import Reveal from "./Reveal";

export default function BeforeAfter() {
  return (
    <section id="beispiele" className="border-t border-border">
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 py-20">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Vorher / Nachher
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Gleiches Unternehmen, neues Fundament
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <Reveal delay={0}>
            <PlaceholderImage
              label="Screenshot: Website vorher"
              hint="wird nachgeliefert"
            />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Vorher
            </p>
          </Reveal>
          <Reveal delay={120}>
            <PlaceholderImage
              label="Screenshot: Website nachher"
              hint="wird nachgeliefert"
            />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Nachher
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
