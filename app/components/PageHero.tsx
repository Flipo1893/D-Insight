import Link from "next/link";
import Reveal from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 pt-16 pb-12 md:pt-24">
      <Reveal>
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Zurück zur Startseite
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-2xl break-words text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
      </Reveal>
    </section>
  );
}
