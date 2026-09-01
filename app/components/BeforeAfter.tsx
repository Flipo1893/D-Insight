import ComparePanel from "./ComparePanel";
import CompareSlider from "./CompareSlider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { comparison } from "../lib/content";

/**
 * Layout family: full-width interactive comparison. The slider is the point
 * of the section, so it gets the whole column width.
 *
 * The panels currently carry statements rather than screenshots, because
 * there are no finished projects to show yet. When the first one is live,
 * swap the two ComparePanel elements for <Image /> and nothing else in this
 * file has to change.
 */
export default function BeforeAfter() {
  return (
    <section id="beispiele" className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-2xl">
            Gleiches Unternehmen, neues Fundament.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-muted">
            Ziehen Sie den Regler, um den Unterschied zu sehen. Inhalte und
            Marke bleiben, Technik und Gestaltung werden ersetzt.
          </p>
        </Reveal>

        <Reveal index={1} className="mt-12">
          <CompareSlider
            before={
              <ComparePanel
                variant="before"
                align="left"
                headline={comparison.before.headline}
                points={comparison.before.points}
              />
            }
            after={
              <ComparePanel
                variant="after"
                align="right"
                headline={comparison.after.headline}
                points={comparison.after.points}
              />
            }
            beforeLabel={comparison.before.label}
            afterLabel={comparison.after.label}
          />
        </Reveal>

        <Reveal index={2}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Eine Gegenüberstellung dessen, was wir verändern. Sobald die ersten
            Projekte live sind, stehen hier echte Screenshots und gemessene
            Werte.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
