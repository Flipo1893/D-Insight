import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import LogoutButton from "./LogoutButton";
import MobileMenu from "./MobileMenu";

const navItems = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/#beispiele", label: "Beispiele" },
  { href: "/prozess", label: "Prozess" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default async function Header() {
  const user = await getCurrentUser();

  const authLink = user ? (
    <LogoutButton />
  ) : (
    <Link
      href="/login"
      className="text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      Login
    </Link>
  );

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
          <div className="hidden md:block">{authLink}</div>
          <Link
            href={user ? "/dashboard" : "/registrieren"}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
          >
            {user ? "Dashboard" : "Registrieren"}
          </Link>
          <MobileMenu navItems={navItems} authLink={authLink} />
        </div>
      </div>
    </header>
  );
}
