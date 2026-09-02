import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { team } from "../lib/content";

function hasPhoto(photo: string) {
  return photo !== "" && existsSync(join(process.cwd(), "public", photo));
}

/**
 * Two faces, high on the page.
 *
 * "Zwei Entwickler, kein Agentur-Apparat" is the strongest thing this
 * business has to say, and it was sitting one click away on /ueber-uns.
 * People decide whether to trust a supplier in seconds, and a face does
 * that faster than a paragraph. Kept to a strip rather than a full section
 * so it introduces the two of you without delaying the rest of the page.
 */
export default function TeamStrip() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 xl:max-w-7xl 2xl:max-w-[1440px]">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex items-center gap-5">
            <div className="flex shrink-0 -space-x-3">
              {team.map((person) =>
                hasPhoto(person.photo) ? (
                  <div
                    key={person.name}
                    className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-background sm:h-16 sm:w-16"
                  >
                    <Image
                      src={person.photo}
                      alt={`Portrait von ${person.name}`}
                      fill
                      sizes="80px"
                      quality={85}
                      className="scale-[1.18] object-cover object-[50%_18%]"
                    />
                  </div>
                ) : null,
              )}
            </div>

            <div className="min-w-0">
              <p className="text-lg font-semibold tracking-tight md:text-xl">
                Zwei Entwickler, kein Agentur-Apparat.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {team.map((person) => person.name).join(" und ")}. Sie sprechen
                mit den Leuten, die auch bauen.
              </p>
            </div>
          </div>

          <Link
            href="/ueber-uns"
            className="group inline-flex shrink-0 items-center gap-2 self-start py-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-text md:self-auto"
          >
            Wer wir sind
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
