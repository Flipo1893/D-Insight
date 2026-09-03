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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-sm text-muted lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        {/* Every subpage ends here, so this is the last thing a lot of
            visitors see. Legal links alone left them with no way to reach us
            without scrolling back up, and an agency with no address in the
            footer reads as one that would rather not be found. */}
        <div className="flex flex-col gap-3">
          <p className="font-medium text-muted-strong">
            {site.name}, {site.tagline}
          </p>
          <address className="not-italic leading-relaxed">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city},{" "}
            {site.address.country}
          </address>
          <a
            href={`mailto:${site.email}`}
            className="-my-1 w-fit py-1 transition-colors hover:text-foreground"
          >
            {site.email}
          </a>
        </div>

        <nav
          aria-label="Rechtliches"
          className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end"
        >
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

      <div className="mx-auto max-w-6xl px-6 pb-10 text-sm text-muted">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
