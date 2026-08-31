"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

type MobileMenuProps = {
  navItems: NavItem[];
  authLink: ReactNode;
};

export default function MobileMenu({ navItems, authLink }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className="flex h-9 w-9 items-center justify-center text-foreground"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background px-6 py-6 shadow-lg">
          <nav
            className="flex flex-col gap-4 text-sm text-muted"
            onClick={() => setOpen(false)}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div
            className="mt-6 border-t border-border pt-6"
            onClick={() => setOpen(false)}
          >
            {authLink}
          </div>
        </div>
      )}
    </div>
  );
}
