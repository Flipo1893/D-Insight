"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseTabs = [
  { href: "/dashboard", label: "Übersicht" },
  { href: "/dashboard/inhalte", label: "Inhalte" },
  { href: "/dashboard/traffic", label: "Traffic" },
];

/**
 * showStats is decided on the server from the admin allowlist. Customers
 * never receive the tab, and the page itself returns 404 for them anyway, so
 * hiding it here is convenience rather than the actual gate.
 */
export default function DashboardNav({ showStats = false }: { showStats?: boolean }) {
  const pathname = usePathname();
  const tabs = showStats
    ? [...baseTabs, { href: "/dashboard/statistik", label: "Statistik" }]
    : baseTabs;

  return (
    <nav aria-label="Kundenbereich" className="border-b border-border">
      <ul className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative block whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-accent transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
