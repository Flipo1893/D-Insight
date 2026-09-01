"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems, primaryCta, site } from "../lib/content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [pinned, setPinned] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // Header border appears once the page has scrolled past the hero top.
  // A sentinel + IntersectionObserver avoids a per-frame scroll listener.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Highlight the nav item for whichever section currently owns the viewport.
  // The nav mixes in-page anchors with real routes now, so only the anchors
  // take part; a missing element for a route link is expected, not a bug.
  useEffect(() => {
    const ids = navItems
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => item.href.slice(2));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`/#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // While the mobile sheet is open, lock the page and allow Escape to close.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div ref={sentinel} aria-hidden className="absolute top-0 h-px w-full" />
      <header
        className={`sticky top-0 z-[var(--z-header)] relative bg-background/85 backdrop-blur-md transition-colors duration-300 ${
          pinned ? "border-b border-border" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="#top"
            className="text-base font-semibold tracking-tight"
            onClick={() => setOpen(false)}
          >
            {site.name}
          </Link>

          <nav
            aria-label="Hauptnavigation"
            className="hidden items-center gap-8 text-sm md:flex"
          >
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative py-1 transition-colors ${
                    isActive ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Points at /dashboard rather than /login so it works in both
                states: the dashboard sends anyone without a session on to
                the login page and back again afterwards. */}
            <Link
              href="/dashboard"
              className="hidden text-sm text-muted transition-colors hover:text-foreground md:inline-block"
            >
              Kundenbereich
            </Link>
            <a
              href="#kontakt"
              className="hidden rounded-brand bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px md:inline-block"
            >
              {primaryCta}
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Menü schliessen" : "Menü öffnen"}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-brand text-foreground md:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        {/* Reading progress. Driven by scroll(), so no JS and no listener. */}
        <span
          aria-hidden
          className="read-progress absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        />

        </div>

        {/* Mobile sheet. Height transition keeps it off the main thread. */}
        <div
          id="mobile-nav"
          className={`grid overflow-hidden border-border transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            open
              ? "grid-rows-[1fr] border-t opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <nav
              aria-label="Navigation mobil"
              className="flex flex-col px-6 pb-6 pt-2"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 text-lg text-muted-strong transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-lg text-muted-strong transition-colors hover:text-foreground"
              >
                Kundenbereich
              </Link>
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-brand bg-accent-strong px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                {primaryCta}
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
