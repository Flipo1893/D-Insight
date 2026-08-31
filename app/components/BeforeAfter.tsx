import CompareSlider from "./CompareSlider";
import PlaceholderImage from "./PlaceholderImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Layout family: full-width interactive comparison. The slider is the point
 * of the section, so it gets the whole column width rather than sitting in a
 * two-up grid of static thumbnails.
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
              <PlaceholderImage
                label="Screenshot vorher"
                hint="wird nachgeliefert"
              />
            }
            after={
              <PlaceholderImage
                label="Screenshot nachher"
                hint="wird nachgeliefert"
              />
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
