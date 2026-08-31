import Link from "next/link";

const navItems = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#beispiele", label: "Beispiele" },
  { href: "#prozess", label: "Prozess" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#top" className="text-lg font-semibold tracking-tight">
          D-Insight
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#kontakt"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Angebot anfordern
        </a>
      </div>
    </header>
  );
}
