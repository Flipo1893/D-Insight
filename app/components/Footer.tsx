import Link from "next/link";
import { site } from "../lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}, {site.tagline}
        </p>
        <nav aria-label="Rechtliches" className="flex gap-6">
          <Link href="/wissen" className="-my-2 py-2 transition-colors hover:text-foreground">
            Wissen
          </Link>
          <Link href="/impressum" className="-my-2 py-2 transition-colors hover:text-foreground">
            Impressum
          </Link>
          <Link href="/datenschutz" className="-my-2 py-2 transition-colors hover:text-foreground">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
