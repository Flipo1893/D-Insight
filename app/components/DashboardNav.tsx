"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "Übersicht" },
  { href: "/dashboard/inhalte", label: "Inhalte" },
  { href: "/dashboard/traffic", label: "Traffic" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 border-b border-border">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
