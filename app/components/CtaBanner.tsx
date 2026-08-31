import Reveal from "./Reveal";

export default function CtaBanner() {
  return (
    <section className="overflow-hidden bg-accent">
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 py-20">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Bereit für eine neue Website?
          </h2>
          <a
            href="#kontakt"
            className="mt-8 inline-block rounded-md border border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-accent"
          >
            Angebot anfordern
          </a>
        </Reveal>
      </div>
    </section>
  );
}
