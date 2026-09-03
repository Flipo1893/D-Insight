"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

const baseTabs = [
  { href: "/dashboard", label: "Übersicht" },
  { href: "/dashboard/projekt", label: "Projekt" },
  { href: "/dashboard/inhalte", label: "Inhalte" },
  { href: "/dashboard/verlauf", label: "Verlauf" },
  { href: "/dashboard/traffic", label: "Traffic" },
];

const adminTabs = [
  { href: "/dashboard/kunden", label: "Kunden" },
  { href: "/dashboard/statistik", label: "Statistik" },
  { href: "/dashboard/monitoring", label: "Monitoring" },
];

/**
 * Lives inside <Link> so useLinkStatus can report that tab's navigation.
 * Gives immediate feedback on the tab you clicked, before the next page's
 * skeleton takes over.
 */
function TabLabel({ label }: { label: string }) {
  const { pending } = useLinkStatus();

  return (
    <span className="flex items-center gap-2">
      {label}
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full bg-accent transition-opacity duration-200 ${
          pending ? "animate-pulse opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

export default function DashboardNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const tabs = isAdmin ? [...baseTabs, ...adminTabs] : baseTabs;

  return (
    <nav className="flex gap-6 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        // Sub-pages (e.g. /dashboard/kunden/<id>) keep their parent tab active.
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/dashboard" && pathname.startsWith(`${tab.href}/`));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <TabLabel label={tab.label} />
          </Link>
        );
      })}
    </nav>
  );
}
