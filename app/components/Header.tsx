import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { primaryCta } from "../lib/content";

// Startseite and Referenzen are listed explicitly: the wordmark already goes
// home, but only people who know that convention find it, and the references
// were reachable from nowhere. The anchor carries a leading slash so it also
// works from the subpages.
const navItems = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/prozess", label: "Prozess" },
  { href: "/referenzen", label: "Referenzen" },
  { href: "/#schnellcheck", label: "Schnellcheck" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          D-Insight
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative py-1 transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#kontakt"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
          >
            {primaryCta}
          </Link>
          <MobileMenu navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
