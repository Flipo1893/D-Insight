import Link from "next/link";
import ConsentReset from "./ConsentReset";
import { site } from "../lib/content";

const legalLinks = [
  { href: "/agb", label: "AGB" },
  { href: "/nutzungsbedingungen", label: "Nutzungsbedingungen" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}, {site.tagline}
        </p>
        <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-6 gap-y-2">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="-my-2 py-2 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {/* Withdrawing consent has to be as easy as giving it, which means a
              permanent entry rather than a buried setting. Renders nothing
              when there is no tracking to consent to. */}
          <ConsentReset />
        </nav>
      </div>
    </footer>
  );
}
