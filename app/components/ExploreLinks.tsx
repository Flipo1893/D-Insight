import Link from "next/link";
import Reveal from "./Reveal";

const links = [
  {
    href: "/leistungen",
    eyebrow: "01",
    title: "Leistungen",
    description: "Redesign, Refactoring und KI-SEO im Detail.",
  },
  {
    href: "/ueber-uns",
    eyebrow: "02",
    title: "Über uns",
    description: "Wer hinter D-Insight steckt und wofür wir stehen.",
  },
  {
    href: "/prozess",
    eyebrow: "03",
    title: "Prozess",
    description: "So läuft ein Projekt von Analyse bis Launch ab.",
  },
];

export default function ExploreLinks() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {links.map((link, index) => (
            <Reveal key={link.href} delay={index * 100}>
              <Link
                href={link.href}
                className="group block h-full rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <span className="text-sm text-muted">{link.eyebrow}</span>
                <h3 className="mt-3 flex items-center gap-2 text-xl font-semibold">
                  {link.title}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h3>
                <p className="mt-2 text-sm text-muted">{link.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
